import React, { useState } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { ReturnRecord, ValidationStatus } from "../types";
import { RETURN_CATEGORIES, ROOT_CAUSES } from "../data/taxonomy";

interface ReturnDetailModalProps {
  record: ReturnRecord | null;
  onClose: () => void;
  onValidateRecord: (recordId: string, status: ValidationStatus, comment: string, correctedCause?: string) => void;
  useAiMode: boolean;
}

export const ReturnDetailModal: React.FC<ReturnDetailModalProps> = ({
  record,
  onClose,
  onValidateRecord,
  useAiMode,
}) => {
  if (!record) return null;

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [validationComment, setValidationComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ValidationStatus>("VALIDATED");

  const rootMeta = ROOT_CAUSES[record.analysed_root_cause || "unknown_root_cause"];
  const catMeta = RETURN_CATEGORIES[record.analysed_category || "UNKNOWN"];

  const handleRunAiAnalysis = async () => {
    setAiAnalyzing(true);
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnRecord: record }),
      });
      const data = await res.json();
      if (data.status === "success" && data.analysis) {
        setAiResult(data.analysis);
      } else {
        setAiResult({
          fallback: true,
          explanation: "Rule-based engine active. No external Gemini key supplied in server environment.",
        });
      }
    } catch (err) {
      console.error(err);
      setAiResult({
        fallback: true,
        explanation: "Network or server error during AI analysis. Falling back to rule-based engine.",
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  const submitValidation = () => {
    onValidateRecord(record.return_id, selectedStatus, validationComment || "Verified from inspection report");
    setValidationComment("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 font-mono text-[#e0e0e0]">
      <div className="bg-[#0d0d0d] rounded-[2px] max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#1f1f1f] shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0d0d0d] border-b border-[#1f1f1f] px-4 py-2.5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#00f0ff]">{record.return_id}</span>
              <span className="px-1.5 py-0.2 rounded-[2px] text-[9px] bg-[#141414] text-[#888888] border border-[#222222]">
                {record.return_date}
              </span>
              {record.is_edge_case && (
                <span className="px-1.5 py-0.2 rounded-[2px] text-[8px] font-bold bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/40">
                  EDGE_CASE_FLAG
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#666666] mt-0.5">
              {record.product_name} &bull; SKU: <span className="text-[#e0e0e0]">{record.sku}</span> &bull; CAT:{" "}
              {record.product_category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-[#666666] hover:text-[#e0e0e0] hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Top Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">STRUCTURED_CATEGORY</span>
              <span className="font-bold text-[#ffffff] text-xs">{catMeta?.label || record.analysed_category}</span>
            </div>
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">ROOT_CAUSE</span>
              <span className="font-bold text-[#00f0ff] text-xs">{rootMeta?.label || record.analysed_root_cause}</span>
            </div>
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">PREVENTABILITY</span>
              <span
                className={`inline-block font-bold text-[9px] px-1.5 py-0.2 rounded-[2px] mt-0.5 border ${
                  record.analysed_preventability === "PREVENTABLE"
                    ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                    : record.analysed_preventability === "PARTIALLY_PREVENTABLE"
                    ? "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                    : "bg-[#141414] text-[#888888] border-[#222222]"
                }`}
              >
                {record.analysed_preventability}
              </span>
            </div>
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">CONFIDENCE</span>
              <span className="font-bold text-[#00ff66] text-xs">{record.confidence_score}%</span>
            </div>
          </div>

          {/* Side-by-Side: Customer Claim vs Physical Warehouse Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Customer Inputs */}
            <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2 text-[10px]">
              <h3 className="text-[9px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-[#00f0ff]" /> CUSTOMER_SUBMISSION
              </h3>
              <div>
                <span className="text-[#555555] block text-[9px]">ORIGINAL_REASON_CODE:</span>
                <span className="font-medium text-[#e0e0e0]">{record.original_return_reason}</span>
              </div>
              <div>
                <span className="text-[#555555] block text-[9px]">RAW_CUSTOMER_FEEDBACK:</span>
                <p className="text-[#cccccc] bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f]">
                  "{record.return_text}"
                </p>
              </div>
              <div>
                <span className="text-[#555555] block text-[9px]">PORTAL_ACTION:</span>
                <span className="text-[#888888]">{record.customer_action}</span>
              </div>
            </div>

            {/* Warehouse Inspection & Logistics */}
            <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2 text-[10px]">
              <h3 className="text-[9px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#00ff66]" /> CERTIFIED_PHYSICAL_INSPECTION
              </h3>
              <div>
                <span className="text-[#555555] block text-[9px]">INSPECTION_FINDINGS:</span>
                <p className="text-[#00ff66] bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f]">
                  {record.inspection_finding || "No inspection recorded (NULL)"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#555555] block text-[9px]">CARTON_CONDITION:</span>
                  <span className="font-semibold text-[#e0e0e0]">{record.packaging_condition}</span>
                </div>
                <div>
                  <span className="text-[#555555] block text-[9px]">TRANSIT_CONDITION:</span>
                  <span className="font-semibold text-[#e0e0e0]">{record.delivery_condition}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#555555] block text-[9px]">DAMAGE_LOCATION:</span>
                  <span className="font-semibold text-[#e0e0e0]">{record.damage_location || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[#555555] block text-[9px]">PICKUP_REQUIRED:</span>
                  <span className="font-semibold text-[#e0e0e0]">{record.pickup_required ? "YES (2-MAN BULKY)" : "NO"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Evidence Flow Timeline */}
          <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f]">
            <h3 className="text-[9px] font-bold text-[#666666] uppercase tracking-wider mb-2">
              FORENSIC_EVIDENCE_FLOW_TIMELINE
            </h3>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-1.5 text-[10px]">
              <div className="flex-1 bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f] w-full">
                <span className="text-[8px] font-bold text-[#666666] uppercase">1. CUSTOMER_CLAIM</span>
                <div className="font-medium text-[#cccccc] truncate">{record.original_return_reason}</div>
              </div>
              <ChevronRight className="hidden md:block w-3 h-3 text-[#444444] shrink-0" />

              <div className="flex-1 bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f] w-full">
                <span className="text-[8px] font-bold text-[#666666] uppercase">2. RETURN_TEXT</span>
                <div className="font-medium text-[#cccccc] truncate">"{record.return_text}"</div>
              </div>
              <ChevronRight className="hidden md:block w-3 h-3 text-[#444444] shrink-0" />

              <div className="flex-1 bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f] w-full">
                <span className="text-[8px] font-bold text-[#666666] uppercase">3. INSPECTION</span>
                <div className="font-medium text-[#00ff66] truncate">{record.inspection_finding || "PENDING"}</div>
              </div>
              <ChevronRight className="hidden md:block w-3 h-3 text-[#444444] shrink-0" />

              <div className="flex-1 bg-[#0d0d0d] p-2 rounded-[2px] border border-[#1f1f1f] w-full">
                <span className="text-[8px] font-bold text-[#666666] uppercase">4. PRODUCT_SPEC</span>
                <div className="font-medium text-[#cccccc] truncate">
                  {record.product_weight}kg &bull; {record.product_dimensions}
                </div>
              </div>
              <ChevronRight className="hidden md:block w-3 h-3 text-[#444444] shrink-0" />

              <div className="flex-1 bg-[#00f0ff]/10 p-2 rounded-[2px] border border-[#00f0ff]/40 w-full">
                <span className="text-[8px] font-bold text-[#00f0ff] uppercase">5. ROOT_CAUSE</span>
                <div className="font-bold text-[#00f0ff] truncate">{rootMeta?.label || record.analysed_root_cause}</div>
              </div>
            </div>
          </div>

          {/* Evidence Scoring Breakdown Bars */}
          <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-bold text-[#666666] uppercase tracking-wider">
                MULTI_SOURCE_EVIDENCE_QUALITY_WEIGHTS
              </h3>
              <span className="text-[10px] font-bold text-[#00ff66]">
                CONFIDENCE: {record.confidence_score}%
              </span>
            </div>

            {record.evidence_breakdown && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[10px]">
                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">TEXT:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.text_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#ffb700]" style={{ width: `${record.evidence_breakdown.text_evidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">INSPECTION:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.inspection_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#00ff66]" style={{ width: `${record.evidence_breakdown.inspection_evidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">ATTR:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.product_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#00f0ff]" style={{ width: `${record.evidence_breakdown.product_evidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">LISTING:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.listing_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#00f0ff]" style={{ width: `${record.evidence_breakdown.listing_evidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">HISTORICAL:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.historical_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#aaaaaa]" style={{ width: `${record.evidence_breakdown.historical_evidence}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-[#666666]">VALIDATION:</span>
                    <span className="font-bold text-[#e0e0e0]">{record.evidence_breakdown.validation_evidence}%</span>
                  </div>
                  <div className="h-1 bg-[#141414] rounded-[1px] overflow-hidden">
                    <div className="h-full bg-[#ff0055]" style={{ width: `${record.evidence_breakdown.validation_evidence}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Evidence Bullet Points */}
            <div className="pt-2 border-t border-[#1f1f1f]">
              <span className="text-[9px] font-bold text-[#666666] block mb-1">KEY_EVIDENCE_FACTORS:</span>
              <ul className="space-y-0.5 text-[10px] text-[#aaaaaa]">
                {record.evidence_points?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#00ff66] font-bold">&bull;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Action Box */}
          <div className="bg-[#00f0ff]/5 border border-[#00f0ff]/30 p-2.5 rounded-[2px] text-[10px]">
            <span className="text-[#00f0ff] uppercase tracking-wider block font-bold text-[9px] mb-0.5">
              RECOMMENDED_ENGINEERING_ACTION:
            </span>
            <p className="text-[#cccccc]">{record.recommended_action}</p>
          </div>

          {/* AI-Assisted Mode Execution */}
          <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span className="text-[10px] font-bold text-[#ffffff]">AI_ASSISTED_GEMINI_AUDIT</span>
              </div>
              <button
                onClick={handleRunAiAnalysis}
                disabled={aiAnalyzing}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[10px] font-bold rounded-[2px] border border-[#00f0ff]/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                {aiAnalyzing ? "ANALYZING..." : "[EXECUTE_DEEP_AUDIT]"}
              </button>
            </div>

            {aiResult && (
              <div className="mt-2 p-2 bg-[#0d0d0d] rounded-[2px] border border-[#00f0ff]/30 text-[10px] text-[#e0e0e0] space-y-0.5">
                {aiResult.fallback ? (
                  <p className="text-[#888888] italic">{aiResult.explanation}</p>
                ) : (
                  <>
                    <div className="font-bold text-[#00f0ff]">GEMINI_CLASSIFICATION_OUTPUT:</div>
                    <p>
                      <strong>PREDICTED:</strong> {aiResult.category} &bull; {aiResult.root_cause} (
                      {aiResult.confidence}% confidence)
                    </p>
                    <p className="italic text-[#888888]">"{aiResult.explanation}"</p>
                    <p className="text-[#00ff66]">ACTION: {aiResult.recommended_action}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Product-Team Validation Form */}
          <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f] space-y-2">
            <h3 className="text-[9px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#00ff66]" /> PRODUCT_TEAM_VALIDATION_STATION
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <select
                aria-label="Validation Outcome"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ValidationStatus)}
                className="border border-[#1f1f1f] rounded-[2px] px-2 py-1 bg-[#0d0d0d] text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="VALIDATED">VALIDATED (CONFIRM)</option>
                <option value="PARTIALLY_VALIDATED">PARTIALLY VALIDATED</option>
                <option value="REJECTED">REJECTED (DISAGREE)</option>
                <option value="NEEDS_MORE_EVIDENCE">NEEDS MORE EVIDENCE</option>
              </select>

              <input
                type="text"
                placeholder="Reviewer calibration notes..."
                value={validationComment}
                onChange={(e) => setValidationComment(e.target.value)}
                className="flex-1 border border-[#1f1f1f] rounded-[2px] px-2 py-1 bg-[#0d0d0d] text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff] min-w-[200px]"
              />

              <button
                onClick={submitValidation}
                className="px-3 py-1 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 text-[10px] font-bold rounded-[2px] transition-colors cursor-pointer"
              >
                [RECORD_AUDIT]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
