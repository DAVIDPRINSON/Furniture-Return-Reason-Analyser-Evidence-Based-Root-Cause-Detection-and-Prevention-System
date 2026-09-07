import React, { useState, useMemo } from "react";
import {
  Beaker,
  CheckCircle2,
  XCircle,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TEST_CASES } from "../data/testCases";
import { analyzeReturnRecord } from "../services/analyzer";

export const TestHarnessView: React.FC = () => {
  const [filterMode, setFilterMode] = useState<"ALL" | "PASSED" | "FAILED" | "EDGES">("ALL");
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testRunCount, setTestRunCount] = useState<number>(0);

  const evaluatedTests = useMemo(() => {
    return TEST_CASES.map((tc) => {
      const result = analyzeReturnRecord({
        return_text: tc.input.return_text,
        original_return_reason: tc.input.original_return_reason,
        inspection_finding: tc.input.inspection_finding,
        packaging_condition: tc.input.packaging_condition,
        delivery_condition: tc.input.delivery_condition,
        listing_title: tc.input.listing_title,
        customer_action: tc.input.customer_action,
      });

      const categoryMatch = result.category === tc.expected_category;
      const rootCauseMatch = result.root_cause === tc.expected_root_cause;
      const preventabilityMatch = result.preventability === tc.expected_preventability;
      const passed = categoryMatch && rootCauseMatch && preventabilityMatch;

      return {
        ...tc,
        actual: result,
        passed,
        categoryMatch,
        rootCauseMatch,
        preventabilityMatch,
      };
    });
  }, [testRunCount]);

  const passedCount = evaluatedTests.filter((t) => t.passed).length;
  const failedCount = evaluatedTests.length - passedCount;
  const accuracyPct = Math.round((passedCount / (evaluatedTests.length || 1)) * 100);

  const displayedTests = useMemo(() => {
    if (filterMode === "PASSED") return evaluatedTests.filter((t) => t.passed);
    if (filterMode === "FAILED") return evaluatedTests.filter((t) => !t.passed);
    if (filterMode === "EDGES") return evaluatedTests.filter((t) => t.is_edge_case);
    return evaluatedTests;
  }, [evaluatedTests, filterMode]);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestRunCount((c) => c + 1);
      setIsRunning(false);
    }, 300);
  };

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              TEST_HARNESS // REGRESSION_SUITE & SYNTHETIC_FIXTURES
            </h2>
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5">
            20 automated verification test vectors verifying joinery fatigue, drop shocks, and ambiguous customer edge cases.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-[2px] text-[10px] font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{isRunning ? "EXECUTING_VECTORS..." : "[RUN_ALL_20_VECTORS]"}</span>
        </button>
      </div>

      {/* Test Scorecard KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#666666] block uppercase">TOTAL_VECTORS</span>
          <span className="text-xl font-bold text-[#e0e0e0]">{evaluatedTests.length}</span>
          <span className="text-[9px] text-[#444444] block mt-0.5">Includes 4 edge cases</span>
        </div>

        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#00ff66] block uppercase font-bold">PASSED</span>
          <span className="text-xl font-bold text-[#00ff66]">{passedCount}</span>
          <span className="text-[9px] text-[#444444] block mt-0.5">Triple match confirmed</span>
        </div>

        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#ff0055] block uppercase font-bold">FAILED</span>
          <span className="text-xl font-bold text-[#ff0055]">{failedCount}</span>
          <span className="text-[9px] text-[#444444] block mt-0.5">Rule drift alert</span>
        </div>

        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#00f0ff] block uppercase font-bold">ACCURACY_BENCHMARK</span>
          <span className="text-xl font-bold text-[#00f0ff]">{accuracyPct}%</span>
          <span className="text-[9px] text-[#444444] block mt-0.5">Classification precision</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#1f1f1f] pb-2 text-[10px]">
        <button
          onClick={() => setFilterMode("ALL")}
          className={`px-2.5 py-1 rounded-[2px] transition-colors ${
            filterMode === "ALL" ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/40 font-bold" : "text-[#666666] hover:bg-[#141414]"
          }`}
        >
          ALL ({evaluatedTests.length})
        </button>
        <button
          onClick={() => setFilterMode("PASSED")}
          className={`px-2.5 py-1 rounded-[2px] transition-colors ${
            filterMode === "PASSED" ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 font-bold" : "text-[#666666] hover:bg-[#141414]"
          }`}
        >
          PASSED ({passedCount})
        </button>
        <button
          onClick={() => setFilterMode("FAILED")}
          className={`px-2.5 py-1 rounded-[2px] transition-colors ${
            filterMode === "FAILED" ? "bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/40 font-bold" : "text-[#666666] hover:bg-[#141414]"
          }`}
        >
          FAILED ({failedCount})
        </button>
        <button
          onClick={() => setFilterMode("EDGES")}
          className={`px-2.5 py-1 rounded-[2px] transition-colors ${
            filterMode === "EDGES" ? "bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/40 font-bold" : "text-[#666666] hover:bg-[#141414]"
          }`}
        >
          EDGE_CASES (4)
        </button>
      </div>

      {/* Test Cases List */}
      <div className="space-y-1.5">
        {displayedTests.map((t) => {
          const isExpanded = expandedTestId === t.id;
          return (
            <div
              key={t.id}
              className={`rounded-[2px] border transition-all ${
                t.passed ? "bg-[#0d0d0d] border-[#1f1f1f]" : "bg-[#0d0d0d] border-[#ff0055]/40"
              }`}
            >
              <div
                onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#141414]"
              >
                <div className="flex items-center gap-2.5">
                  {t.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#ff0055] shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#00f0ff]">{t.id}</span>
                      <span className="font-bold text-xs text-[#ffffff]">{t.title}</span>
                      {t.is_edge_case && (
                        <span className="px-1.5 py-0.2 rounded-[2px] text-[8px] font-bold bg-[#ffb700]/10 text-[#ffb700] border border-[#ffb700]/40">
                          EDGE_CASE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#666666] italic mt-0.5 truncate max-w-xl">
                      "{t.input.return_text}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block text-[10px]">
                    <span className="text-[#666666] block text-[9px]">PREDICTED</span>
                    <span className="font-semibold text-[#e0e0e0]">{t.actual.root_cause}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#666666]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                  )}
                </div>
              </div>

              {/* Expanded Test Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-2 border-t border-[#1f1f1f] bg-[#050505] text-[10px] space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                    <div className="space-y-1">
                      <span className="font-bold text-[#666666] text-[9px] uppercase">INPUT_PAYLOAD:</span>
                      <p><strong className="text-[#888888]">SKU/Title:</strong> {t.input.listing_title}</p>
                      <p><strong className="text-[#888888]">Reason:</strong> {t.input.original_return_reason}</p>
                      <p><strong className="text-[#888888]">Inspection:</strong> {t.input.inspection_finding || "(EMPTY)"}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-[#666666] text-[9px] uppercase">TRANSIT_TELEMETRY:</span>
                      <p><strong className="text-[#888888]">Carton:</strong> {t.input.packaging_condition || "N/A"}</p>
                      <p><strong className="text-[#888888]">Transit:</strong> {t.input.delivery_condition || "N/A"}</p>
                      <p className="text-[#ffb700] text-[9px]">{t.notes}</p>
                    </div>
                  </div>

                  {/* Expected vs Actual Table */}
                  <div className="border border-[#1f1f1f] rounded-[2px] overflow-hidden bg-[#080808]">
                    <table className="w-full text-left text-[10px] border-collapse font-mono">
                      <thead>
                        <tr className="bg-[#050505] text-[#666666] border-b border-[#1f1f1f]">
                          <th className="py-1.5 px-2.5">FIELD</th>
                          <th className="py-1.5 px-2.5">GROUND_TRUTH</th>
                          <th className="py-1.5 px-2.5">RULE_ENGINE_OUTPUT</th>
                          <th className="py-1.5 px-2.5 text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#141414] text-[#cccccc]">
                        <tr>
                          <td className="py-1.5 px-2.5 text-[#888888]">CATEGORY</td>
                          <td className="py-1.5 px-2.5">{t.expected_category}</td>
                          <td className="py-1.5 px-2.5 text-[#00f0ff] font-bold">{t.actual.category}</td>
                          <td className="py-1.5 px-2.5 text-right">
                            {t.categoryMatch ? (
                              <span className="text-[#00ff66] font-bold">MATCH</span>
                            ) : (
                              <span className="text-[#ff0055] font-bold">MISMATCH</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2.5 text-[#888888]">ROOT_CAUSE</td>
                          <td className="py-1.5 px-2.5">{t.expected_root_cause}</td>
                          <td className="py-1.5 px-2.5 text-[#ffb700] font-bold">{t.actual.root_cause}</td>
                          <td className="py-1.5 px-2.5 text-right">
                            {t.rootCauseMatch ? (
                              <span className="text-[#00ff66] font-bold">MATCH</span>
                            ) : (
                              <span className="text-[#ff0055] font-bold">MISMATCH</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2.5 text-[#888888]">PREVENTABILITY</td>
                          <td className="py-1.5 px-2.5">{t.expected_preventability}</td>
                          <td className="py-1.5 px-2.5 text-[#00ff66] font-bold">{t.actual.preventability}</td>
                          <td className="py-1.5 px-2.5 text-right">
                            {t.preventabilityMatch ? (
                              <span className="text-[#00ff66] font-bold">MATCH</span>
                            ) : (
                              <span className="text-[#ff0055] font-bold">MISMATCH</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2.5 text-[#888888]">CONFIDENCE</td>
                          <td className="py-1.5 px-2.5">&ge; {t.min_confidence}%</td>
                          <td className="py-1.5 px-2.5 text-[#00f0ff] font-bold">{t.actual.confidence_score}%</td>
                          <td className="py-1.5 px-2.5 text-right">
                            {t.actual.confidence_score >= t.min_confidence ? (
                              <span className="text-[#00ff66] font-bold">PASS</span>
                            ) : (
                              <span className="text-[#ff0055] font-bold">LOW</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
