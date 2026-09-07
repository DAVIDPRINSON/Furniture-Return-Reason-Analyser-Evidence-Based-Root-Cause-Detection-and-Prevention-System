import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = require("@google/genai");
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Could not load @google/genai or missing key", e);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health & Status
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      mode: process.env.GEMINI_API_KEY ? "AI_ASSISTED_READY" : "RULE_BASED_PRIMARY",
    });
  });

  // Optional AI structured analysis endpoint
  app.post("/api/ai-analyze", async (req, res) => {
    try {
      const { returnRecord } = req.body;
      if (!returnRecord) {
        return res.status(400).json({ error: "Missing returnRecord" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          status: "fallback",
          message: "No GEMINI_API_KEY configured. Using deterministic rule-based engine.",
        });
      }

      // Dynamic import to support ESM in server.ts
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a furniture returns forensics expert. Analyze this furniture return record:
Product: ${returnRecord.product_name} (${returnRecord.product_category})
Return Text: "${returnRecord.return_text}"
Original Reason: "${returnRecord.original_return_reason}"
Inspection: "${returnRecord.inspection_finding}"
Packaging Condition: "${returnRecord.packaging_condition}"
Delivery Condition: "${returnRecord.delivery_condition}"
Listing Title: "${returnRecord.listing_title}"
Dimensions: ${returnRecord.product_dimensions}

Respond in strict JSON with:
{
  "category": "PRODUCT_DEFECT" | "PRODUCT_DAMAGE" | "PACKAGING_FAILURE" | "DELIVERY_DAMAGE" | "MISSING_PART" | "ASSEMBLY_DIFFICULTY" | "SIZE_OR_DIMENSION_MISMATCH" | "LISTING_CONTENT_MISMATCH" | "QUALITY_EXPECTATION" | "CUSTOMER_CHANGED_MIND" | "CUSTOMER_ERROR" | "UNKNOWN",
  "root_cause": "short_snake_case_name",
  "preventability": "PREVENTABLE" | "PARTIALLY_PREVENTABLE" | "NOT_PREVENTABLE" | "INSUFFICIENT_EVIDENCE",
  "confidence": 0-100 number,
  "explanation": "2-3 sentence evidence rationale",
  "recommended_action": "Specific engineering, packaging, or content action"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ status: "success", analysis: parsed });
    } catch (err: any) {
      console.error("AI Analysis error:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze with Gemini" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Furniture Return Reason Analyser server running at http://localhost:${PORT}`);
  });
}

startServer();
