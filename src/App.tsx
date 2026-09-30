import React, { useState, useMemo } from "react";
import { generateDemoDataset } from "./data/demoDataset";
import {
  ReturnRecord,
  ValidationStatus,
  ScoringWeights,
  ModelThresholds,
  CostModelFactors,
  UserPersona,
} from "./types";
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_THRESHOLDS,
  DEFAULT_COST_FACTORS,
} from "./data/taxonomy";
import { USER_PERSONAS } from "./data/assumptions";
import { analyzeReturnRecord } from "./services/analyzer";
import { exportToCSV } from "./services/export";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ReturnsExplorer } from "./components/ReturnsExplorer";
import { RootCauseExplorer } from "./components/RootCauseExplorer";
import { TradeOffAnalysis } from "./components/TradeOffAnalysis";
import { ValidationWorkflow } from "./components/ValidationWorkflow";
import { ExperimentView } from "./components/ExperimentView";
import { ErrorAnalysisView } from "./components/ErrorAnalysisView";
import { TestHarnessView } from "./components/TestHarnessView";
import { DataQualityView } from "./components/DataQualityView";
import { ExecutiveBrief } from "./components/ExecutiveBrief";
import { MethodologyView } from "./components/MethodologyView";
import { ReturnDetailModal } from "./components/ReturnDetailModal";
import { SettingsModal } from "./components/SettingsModal";
import { LandingPage } from "./components/LandingPage";
import { CheckCircle2, AlertCircle, X, ChevronRight, Sliders } from "lucide-react";

export default function App() {
  // Master state initialized with 650 synthetic bulky furniture returns
  const [records, setRecords] = useState<ReturnRecord[]>(() => generateDemoDataset());
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ReturnRecord | null>(null);
  const [useAiMode, setUseAiMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings & Calibration state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({ ...DEFAULT_SCORING_WEIGHTS });
  const [modelThresholds, setModelThresholds] = useState<ModelThresholds>({ ...DEFAULT_THRESHOLDS });
  const [costFactors, setCostFactors] = useState<CostModelFactors>({ ...DEFAULT_COST_FACTORS });

  // User Persona state
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(USER_PERSONAS[0]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  // Live Recalibration of entire dataset with custom scoring weights & thresholds
  const handleApplySettings = (
    newWeights: ScoringWeights,
    newThresholds: ModelThresholds,
    newCostFactors: CostModelFactors
  ) => {
    setScoringWeights(newWeights);
    setModelThresholds(newThresholds);
    setCostFactors(newCostFactors);

    setRecords((prev) =>
      prev.map((r) => {
        const analysis = analyzeReturnRecord(r, newWeights, newThresholds, newCostFactors);
        return {
          ...r,
          analysed_category: analysis.category,
          analysed_root_cause: analysis.root_cause,
          analysed_preventability: analysis.preventability,
          confidence_score: analysis.confidence_score,
          priority_score: analysis.priority_score,
          priority_level: analysis.priority_level,
          recommended_action: analysis.recommended_action,
          evidence_points: analysis.evidence_points,
          evidence_breakdown: analysis.evidence_breakdown,
          total_cost: analysis.total_cost || r.total_cost,
          estimated_co2e_kg: analysis.estimated_co2e_kg || r.estimated_co2e_kg,
        };
      })
    );

    showToast(
      `Dataset re-indexed: ${records.length} returns recalibrated with updated DEFRA emission & scoring weights.`
    );
  };

  // CSV Upload Handler
  const handleUploadCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          showToast("CSV file is empty or missing data rows.");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const newRecords: ReturnRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple CSV splitter handling quoted commas
          const row: string[] = [];
          let current = "";
          let inQuotes = false;
          for (const char of lines[i]) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              row.push(current.trim().replace(/^"|"$/g, ""));
              current = "";
            } else {
              current += char;
            }
          }
          row.push(current.trim().replace(/^"|"$/g, ""));

          const rowData: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowData[h] = row[idx] || "";
          });

          // Run real analyzer engine with active weights
          const analysis = analyzeReturnRecord(
            {
              return_text: rowData.return_text || rowData.customer_feedback || "",
              original_return_reason: rowData.original_return_reason || rowData.reason || "Defective",
              inspection_finding: rowData.inspection_finding || rowData.inspection || "",
              packaging_condition: (rowData.packaging_condition as any) || "INTACT",
              delivery_condition: (rowData.delivery_condition as any) || "NORMAL",
              listing_title: rowData.product_name || "Uploaded Furniture Item",
              customer_action: rowData.customer_action || "Standard Return Portal",
            },
            scoringWeights,
            modelThresholds,
            costFactors
          );

          newRecords.push({
            return_id: rowData.return_id || `RET-UP-${1000 + i}`,
            product_id: `PRD-${rowData.sku || "UP-001"}`,
            sku: rowData.sku || "UP-SKU-001",
            product_name: rowData.product_name || "Imported Furniture Item",
            product_category: rowData.product_category || "LIVING_ROOM",
            product_price: Number(rowData.item_price) || 12000,
            product_weight: Number(rowData.product_weight) || 45,
            product_dimensions: rowData.product_dimensions || "120x80x75 cm",
            original_return_reason: rowData.original_return_reason || "Defective",
            customer_action: rowData.customer_action || "Return Portal",
            return_text: rowData.return_text || "Uploaded return comments",
            listing_title: rowData.product_name || "Imported Furniture Item",
            listing_description: "Listing specifications",
            assembly_instructions: "Standard PDF",
            product_images_available: 4,
            inspection_finding: rowData.inspection_finding || "Pending Inspection",
            damage_type: rowData.damage_type || "Structural Defect",
            damage_location: rowData.damage_location || "Unknown",
            packaging_condition: rowData.packaging_condition || "Intact",
            delivery_condition: rowData.delivery_condition || "Normal",
            pickup_required: true,
            replacement_required: false,
            refund_amount: 0,
            pickup_cost: 3500,
            replacement_cost: 5000,
            pickup_time_hours: 24,
            resolution_time_hours: 48,
            estimated_distance_km: 45,
            return_date: rowData.return_date || new Date().toISOString().split("T")[0],
            is_edge_case: false,

            // Analysed fields
            analysed_category: analysis.category,
            analysed_root_cause: analysis.root_cause,
            analysed_preventability: analysis.preventability,
            confidence_score: analysis.confidence_score,
            priority_score: analysis.priority_score,
            priority_level: analysis.priority_level,
            recommended_action: analysis.recommended_action,
            evidence_points: analysis.evidence_points,
            evidence_breakdown: analysis.evidence_breakdown,
            total_cost: analysis.total_cost || 9500,
            estimated_co2e_kg: analysis.estimated_co2e_kg || 24.5,
            validation_status: "PENDING_REVIEW",
          });
        }

        if (newRecords.length > 0) {
          setRecords(newRecords);
          showToast(`Successfully imported and forensic-analyzed ${newRecords.length} return records!`);
          setActiveTab("explorer");
        }
      } catch (err) {
        console.error(err);
        showToast("Error parsing CSV. Ensure correct column formats.");
      }
    };
    reader.readAsText(file);
  };

  // Download Demo Dataset CSV
  const handleDownloadDemoCSV = () => {
    exportToCSV(records, "furniture_returns_benchmark_650.csv");
    showToast("Downloaded 650 synthetic return records CSV.");
  };

  // Product Team Validation Action
  const handleValidateRecord = (
    recordId: string,
    status: ValidationStatus,
    comment: string,
    correctedCause?: string
  ) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.return_id === recordId) {
          return {
            ...r,
            validation_status: status,
            validation_comment: comment,
            validation_reviewer: "David Vance (Sr. Quality Engineer)",
            validation_date: new Date().toISOString().split("T")[0],
            analysed_root_cause: (correctedCause as any) || r.analysed_root_cause,
          };
        }
        return r;
      })
    );

    // Also update selectedRecord if currently inspected
    if (selectedRecord && selectedRecord.return_id === recordId) {
      setSelectedRecord((prev) =>
        prev
          ? {
              ...prev,
              validation_status: status,
              validation_comment: comment,
              validation_reviewer: "David Vance (Sr. Quality Engineer)",
              validation_date: new Date().toISOString().split("T")[0],
              analysed_root_cause: (correctedCause as any) || prev.analysed_root_cause,
            }
          : null
      );
    }

    showToast(`Record ${recordId} updated to ${status}. Model calibration feedback logged.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-mono selection:bg-[#00f0ff]/20 selection:text-[#00f0ff]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setShowLanding(false);
        }}
        currentPersona={currentPersona}
        onSelectPersona={(persona) => {
          setCurrentPersona(persona);
          showToast(`Workspace switched to [${persona.name}] focus mode.`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        useAiMode={useAiMode}
        onToggleAiMode={() => setUseAiMode((prev) => !prev)}
        recordCount={records.length}
      />

      {/* Active Persona Context Ribbon */}
      <div className="bg-[#080808] border-b border-[#161616] px-4 py-1.5 text-[10px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#666666] uppercase">ACTIVE_WORKSPACE_ROLE:</span>
          <span className="font-bold text-[#00f0ff] uppercase">[{currentPersona.id}] {currentPersona.name}</span>
          <span className="text-[#333333] hidden sm:inline">//</span>
          <span className="text-[#888888] hidden md:inline">{currentPersona.description}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#555555] hidden sm:inline">FOCUS_METRICS:</span>
          <div className="flex items-center gap-1">
            {currentPersona.focus_metrics.map((m, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.2 bg-[#121212] text-[#aaaaaa] border border-[#1f1f1f] rounded-[2px] text-[9px]"
              >
                {m}
              </span>
            ))}
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 text-[9px] text-[#00f0ff] hover:underline ml-2"
          >
            <Sliders className="w-3 h-3" />
            <span>CALIBRATE</span>
          </button>
        </div>
      </div>

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 space-y-4">
        {showLanding ? (
          <LandingPage onEnterApp={() => setShowLanding(false)} />
        ) : (
          <>
            {activeTab === "dashboard" && (
              <Dashboard
                records={records}
                onSelectReturn={(r) => setSelectedRecord(r)}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            )}

            {activeTab === "explorer" && (
              <ReturnsExplorer
                records={records}
                onSelectReturn={(r) => setSelectedRecord(r)}
                onUploadCSV={handleUploadCSV}
                onDownloadDemoCSV={handleDownloadDemoCSV}
              />
            )}

            {activeTab === "root_causes" && (
              <RootCauseExplorer
                records={records}
                onSelectReturn={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === "trade_offs" && <TradeOffAnalysis records={records} />}

            {activeTab === "validation" && (
              <ValidationWorkflow
                records={records}
                onValidateRecord={handleValidateRecord}
                onSelectReturn={(r) => setSelectedRecord(r)}
              />
            )}

            {(activeTab === "experiments" || activeTab === "experiment") && <ExperimentView />}

            {(activeTab === "error_analysis" || activeTab === "errors") && (
              <ErrorAnalysisView
                records={records}
                onSelectReturn={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === "test_harness" && <TestHarnessView />}

            {activeTab === "data_quality" && <DataQualityView records={records} />}

            {(activeTab === "executive_brief" || activeTab === "actions_risks") && (
              <ExecutiveBrief records={records} />
            )}

            {(activeTab === "methodology" || activeTab === "schema_arch") && <MethodologyView />}

            {activeTab === "guide" && <LandingPage onEnterApp={() => setActiveTab("dashboard")} />}
          </>
        )}
      </main>

      {/* Engine Calibration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentWeights={scoringWeights}
        currentThresholds={modelThresholds}
        currentCostFactors={costFactors}
        onApplySettings={handleApplySettings}
        recordCount={records.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0d0d0d] text-[#e0e0e0] text-[11px] font-mono px-3 py-2 rounded-[2px] shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-2 border border-[#00f0ff] animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#666666] hover:text-[#00f0ff]"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Deep Return Inspection Modal */}
      {selectedRecord && (
        <ReturnDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onValidateRecord={handleValidateRecord}
          useAiMode={useAiMode}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#080808] border-t border-[#1f1f1f] mt-8 py-4 px-4 text-center text-[10px] font-mono text-[#666666]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#e0e0e0] tracking-wider">FURNITURE-RETURN-ANALYSER</span>
            <span className="text-[#333333]">//</span>
            <span className="text-[#00f0ff]">HIGH-DENSITY FORENSIC ENGINE</span>
          </div>
          <div className="flex items-center gap-4 text-[#888888]">
            <button
              onClick={() => setShowLanding(true)}
              className="hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              [DOCUMENTATION]
            </button>
            <span className="text-[#333333]">//</span>
            <button
              onClick={() => setActiveTab("schema_arch")}
              className="hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              [TAXONOMY_ARCH]
            </button>
            <span className="text-[#333333]">//</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#00f0ff] transition-colors cursor-pointer"
            >
              [SCORING_WEIGHTS]
            </button>
            <span className="text-[#333333]">//</span>
            <button
              onClick={handleDownloadDemoCSV}
              className="hover:text-[#00ff66] transition-colors cursor-pointer"
            >
              [EXPORT_DATASET.CSV]
            </button>
          </div>
          <div className="text-[10px] text-[#444444]">
            SYNTHETIC BENCHMARK &bull; BUILD 2026.09.30 &bull; 100% OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
}
