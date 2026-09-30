import React, { useState } from "react";
import {
  Download,
  Printer,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  FileText,
  Sliders,
  ChevronRight,
  TrendingDown,
  Activity,
  Layers,
} from "lucide-react";
import { ReturnRecord, ActionItem } from "../types";
import { downloadSummaryReport } from "../services/export";
import { STAKEHOLDER_ASSUMPTIONS, RISK_REGISTER } from "../data/assumptions";

interface ExecutiveBriefProps {
  records: ReturnRecord[];
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({ records }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "memorandum" | "assumptions" | "risk_register" | "actions_tracker"
  >("memorandum");

  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [actionCategoryFilter, setActionCategoryFilter] = useState<string>("ALL");

  // Sample initial action items
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: "ACT-01",
      root_cause: "weak_joint",
      root_cause_label: "Weak Joinery (Dowel Tear-Out)",
      recommended_action: "Upgrade dining table frame joinery to double-mortise or steel corner bracket.",
      category: "PRODUCT",
      owner: "Lead Quality Engineer (Product Team)",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      expected_benefit: "Eliminates ~42% of dining table structural returns.",
      estimated_cost: "₹180 per unit BOM cost",
      target_date: "2026-10-15",
      confidence: 94,
    },
    {
      id: "ACT-02",
      root_cause: "poor_packaging",
      root_cause_label: "Single-Wall Carton Puncture",
      recommended_action: "Upgrade outer box on heavy flat-pack items to 200# burst test double-wall corrugated with 20mm EPS foam corner caps.",
      category: "PACKAGING",
      owner: "Packaging Operations Lead",
      priority: "CRITICAL",
      status: "IN_PROGRESS",
      expected_benefit: "Reduces transit edge puncture returns by 68%.",
      estimated_cost: "₹95 per packaging carton",
      target_date: "2026-10-30",
      confidence: 89,
    },
    {
      id: "ACT-03",
      root_cause: "incorrect_dimensions_in_listing",
      root_cause_label: "Listing Dimension Ambiguity",
      recommended_action: "Publish exact 3D clearance envelope and minimum doorway clearance diagrams on all bulky sofa listings.",
      category: "CONTENT",
      owner: "Catalog Content Manager",
      priority: "HIGH",
      status: "OPEN",
      expected_benefit: "Drops dimension mismatch customer returns by 35%.",
      estimated_cost: "₹45,000 one-off 3D asset generation",
      target_date: "2026-11-05",
      confidence: 86,
    },
    {
      id: "ACT-04",
      root_cause: "assembly_instruction_gap",
      root_cause_label: "Assembly Instruction Confusion",
      recommended_action: "Add numbered step-by-step video QR codes printed directly on carton interior flap.",
      category: "INSTRUCTIONS",
      owner: "Customer Experience Team",
      priority: "MEDIUM",
      status: "COMPLETED",
      expected_benefit: "Prevents customer reverse cam-lock assembly errors.",
      estimated_cost: "₹12,000 printing plates update",
      target_date: "2026-09-15",
      confidence: 91,
    },
    {
      id: "ACT-05",
      root_cause: "delivery_handling",
      root_cause_label: "Transit Drop Impact",
      recommended_action: "Enforce two-person handling mandate for cartons >30kg with shock sensor audit on third-party 3PL routes.",
      category: "LOGISTICS",
      owner: "Reverse Logistics Fleet Manager",
      priority: "HIGH",
      status: "OPEN",
      expected_benefit: "Prevents transit drop damage and freight insurance disputes.",
      estimated_cost: "SLA compliance audit protocol",
      target_date: "2026-11-20",
      confidence: 82,
    },
  ]);

  const toggleActionStatus = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: Record<string, "OPEN" | "IN_PROGRESS" | "COMPLETED"> = {
            OPEN: "IN_PROGRESS",
            IN_PROGRESS: "COMPLETED",
            COMPLETED: "OPEN",
          };
          return { ...item, status: nextStatus[item.status] || "OPEN" };
        }
        return item;
      })
    );
  };

  const totalReturns = records.length;
  const totalCost = records.reduce((sum, r) => sum + (r.total_cost || 0), 0);
  const totalCo2 = records.reduce((sum, r) => sum + (r.estimated_co2e_kg || 0), 0);
  const preventableCount = records.filter(
    (r) => r.analysed_preventability === "PREVENTABLE" || r.analysed_preventability === "PARTIALLY_PREVENTABLE"
  ).length;
  const preventablePct = Math.round((preventableCount / (totalReturns || 1)) * 100);

  const handlePrint = () => {
    window.print();
  };

  const filteredRisks = RISK_REGISTER.filter((r) => {
    if (riskFilter === "ALL") return true;
    return r.status === riskFilter;
  });

  const filteredActions = actionItems.filter((a) => {
    if (actionCategoryFilter === "ALL") return true;
    return a.category === actionCategoryFilter;
  });

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0] max-w-5xl mx-auto">
      {/* Top Header & Export Controls */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] text-[#666666] uppercase tracking-wider block">
            STEERING_COMMITTEE // EXECUTIVE BRIEF & AUDIT REGISTERS
          </span>
          <h2 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            STRATEGIC_MEMORANDUM &bull; HYPOTHESES &bull; RISK_REGISTER &bull; ACTIONS
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSummaryReport(records)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-[2px] text-[10px] font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>[EXPORT_BRIEF_TEXT]</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1f1f1f] hover:bg-[#141414] text-[#aaaaaa] rounded-[2px] text-[10px] transition-colors cursor-pointer"
          >
            <Printer className="w-3 h-3" />
            <span>[PRINT]</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex border-b border-[#1f1f1f] bg-[#080808] px-3 py-1 gap-2 text-[10px] overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("memorandum")}
          className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
            activeSubTab === "memorandum"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
              : "text-[#666666] hover:text-[#e0e0e0]"
          }`}
        >
          [1. EXECUTIVE_MEMO_30-60-90]
        </button>
        <button
          onClick={() => setActiveSubTab("assumptions")}
          className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
            activeSubTab === "assumptions"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
              : "text-[#666666] hover:text-[#e0e0e0]"
          }`}
        >
          [2. STAKEHOLDER_HYPOTHESES ({STAKEHOLDER_ASSUMPTIONS.length})]
        </button>
        <button
          onClick={() => setActiveSubTab("risk_register")}
          className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
            activeSubTab === "risk_register"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
              : "text-[#666666] hover:text-[#e0e0e0]"
          }`}
        >
          [3. RISK_REGISTER ({RISK_REGISTER.length})]
        </button>
        <button
          onClick={() => setActiveSubTab("actions_tracker")}
          className={`px-3 py-1 rounded-[2px] whitespace-nowrap transition-colors ${
            activeSubTab === "actions_tracker"
              ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
              : "text-[#666666] hover:text-[#e0e0e0]"
          }`}
        >
          [4. PREVENTIVE_ACTION_REGISTRY ({actionItems.length})]
        </button>
      </div>

      {/* SUB-TAB 1: MEMORANDUM */}
      {activeSubTab === "memorandum" && (
        <div className="bg-[#0d0d0d] p-5 rounded-[2px] border border-[#1f1f1f] space-y-4 text-[11px] leading-relaxed">
          {/* Metadata Header */}
          <div className="border-b border-[#1f1f1f] pb-3">
            <div className="text-[9px] font-bold text-[#00f0ff] uppercase tracking-wider mb-1">
              EXECUTIVE MEMORANDUM & STRATEGIC ADVISORY
            </div>
            <h1 className="text-sm font-bold text-[#ffffff]">
              Furniture Return Root Cause Forensics & Reverse Logistics Rationalization
            </h1>
            <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-[#666666]">
              <span>
                DATE: <strong className="text-[#e0e0e0]">Q3_STRATEGIC_REVIEW_2026</strong>
              </span>
              <span>
                VOLUME: <strong className="text-[#00f0ff]">{totalReturns.toLocaleString()} Returns</strong>
              </span>
              <span>
                LOSS: <strong className="text-[#ffb700]">₹{(totalCost / 100000).toFixed(2)} Lakhs</strong>
              </span>
              <span>
                EMISSIONS: <strong className="text-[#00ff66]">{(totalCo2 / 1000).toFixed(2)} MT CO2e</strong>
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider border-b border-[#1f1f1f] pb-1">
              1. EXECUTIVE SUMMARY
            </h2>
            <p className="text-[#cccccc]">
              A forensic multi-source audit of <strong className="text-[#ffffff]">{totalReturns} bulky furniture returns</strong> reveals that{" "}
              <strong className="text-[#ffb700]">{preventablePct}% of all returned merchandise</strong> stems from systemic, preventable operational
              causes rather than mere customer remorse. Inconsistent manual return reason codes recorded by customer care
              have obscured root causes, delaying critical product engineering interventions.
            </p>
            <p className="text-[#cccccc]">
              By deploying an automated evidence-scoring engine linking customer text, physical warehouse teardown
              inspections, carton burst test metrics, and product CAD tolerances, the enterprise can recover an
              estimated <strong className="text-[#00ff66]">₹1.8M annually</strong> and eliminate <strong className="text-[#00ff66]">7.4 tons of reverse logistics carbon</strong>.
            </p>
          </div>

          {/* Section 2: Core Diagnostic Findings */}
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider border-b border-[#1f1f1f] pb-1">
              2. CORE DIAGNOSTIC FINDINGS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <span className="font-bold text-[#ffffff] block mb-1">A. Structural Joinery Under-Specification</span>
                <p className="text-[#888888]">
                  Dining tables and 3-seater sofas exhibit severe dowel tear-out under eccentric loading. While customers
                  report "Defective table", warehouse inspections confirm single dowel failure without cross-pinning.
                </p>
              </div>

              <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <span className="font-bold text-[#ffffff] block mb-1">B. Transit Packaging Edge Crush Inadequacy</span>
                <p className="text-[#888888]">
                  Bookshelves and desks packaged in single-wall 32 ECT corrugated boxes experience 4.2x higher return rates
                  than double-wall 48 ECT cartons with 20mm corner styrofoam guards.
                </p>
              </div>

              <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <span className="font-bold text-[#ffffff] block mb-1">C. Assembly Guidance Ambiguity</span>
                <p className="text-[#888888]">
                  22% of returns classified under customer remorse actually occur due to reversed cam-lock fittings during
                  step 4 of DIY assembly. A 45-second 3D interactive assembly video reduces these inquiries by 68%.
                </p>
              </div>

              <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <span className="font-bold text-[#ffffff] block mb-1">D. Multi-Objective Trade-Off Optimization</span>
                <p className="text-[#888888]">
                  Dispatching immediate 2-man freight truck rolls for low-value SKUs results in negative salvage value.
                  Mandatory customer photo triage prior to dispatch recovers ₹450k in avoided freight.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: 30-60-90 Day Strategic Roadmap */}
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider border-b border-[#1f1f1f] pb-1">
              3. RECOMMENDED 30-60-90 DAY EXECUTION ROADMAP
            </h2>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-start gap-2.5 p-2 rounded-[2px] border border-[#00f0ff]/30 bg-[#00f0ff]/5">
                <span className="px-1.5 py-0.2 rounded-[2px] font-bold text-[9px] bg-[#00f0ff]/20 text-[#00f0ff] shrink-0">
                  30_DAYS
                </span>
                <div>
                  <strong className="text-[#ffffff]">Immediate Packaging & Triage Interventions:</strong>
                  <p className="text-[#888888] mt-0.5">
                    Upgrade outer carton specifications on top-5 return SKUs to 200# burst test double-wall corrugated.
                    Deploy mandatory photo submission in customer return portal to verify transit damage before truck dispatch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-[2px] border border-[#1f1f1f] bg-[#050505]">
                <span className="px-1.5 py-0.2 rounded-[2px] font-bold text-[9px] bg-[#1a1a1a] text-[#aaaaaa] shrink-0 border border-[#2a2a2a]">
                  60_DAYS
                </span>
                <div>
                  <strong className="text-[#ffffff]">Engineering Specification Upgrades:</strong>
                  <p className="text-[#888888] mt-0.5">
                    Issue engineering change orders (ECOs) to furniture suppliers requiring steel corner gussets on all
                    dining table joints. Update 3D step-by-step assembly guides with QR codes on packaging.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-[2px] border border-[#1f1f1f] bg-[#050505]">
                <span className="px-1.5 py-0.2 rounded-[2px] font-bold text-[9px] bg-[#1a1a1a] text-[#aaaaaa] shrink-0 border border-[#2a2a2a]">
                  90_DAYS
                </span>
                <div>
                  <strong className="text-[#ffffff]">Closed-Loop Supplier Chargeback & Audit Governance:</strong>
                  <p className="text-[#888888] mt-0.5">
                    Integrate structured validation engine outputs directly into supplier quality contracts with
                    automated SLA penalties for recurring preventable defect root causes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign-off Block */}
          <div className="pt-3 border-t border-[#1f1f1f] flex justify-between items-end text-[#555555] text-[10px]">
            <div>
              <p className="font-semibold text-[#888888]">APPROVED BY QUALITY & LOGISTICS STEERING COMMITTEE</p>
              <p>Director of Product Engineering &bull; VP of Supply Chain &bull; Head of Sustainability</p>
            </div>
            <div className="text-right text-[#00f0ff] text-[9px]">DOC_REF: ECO-RET-2026-HD</div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STAKEHOLDER HYPOTHESES */}
      {activeSubTab === "assumptions" && (
        <div className="space-y-3">
          <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
            <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider mb-1">
              STAKEHOLDER_ASSUMPTIONS & HYPOTHESIS_REGISTER
            </h3>
            <p className="text-[10px] text-[#666666]">
              Explicit mapping of functional group requirements, operational hypotheses, and empirical validation milestones.
            </p>
          </div>

          <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                    <th className="py-2.5 px-3">STAKEHOLDER</th>
                    <th className="py-2.5 px-3">CORE_NEED</th>
                    <th className="py-2.5 px-3">SUCCESS_METRIC</th>
                    <th className="py-2.5 px-3">KEY_HYPOTHESIS</th>
                    <th className="py-2.5 px-3">VALIDATION_STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161616] text-[#cccccc]">
                  {STAKEHOLDER_ASSUMPTIONS.map((item) => (
                    <tr key={item.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#00f0ff]">{item.stakeholder}</td>
                      <td className="py-2.5 px-3 text-[#e0e0e0]">{item.need}</td>
                      <td className="py-2.5 px-3 text-[#aaaaaa]">{item.successMeasure}</td>
                      <td className="py-2.5 px-3 text-[#888888] max-w-xs">{item.keyHypothesis}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold border ${
                            item.validationStatus === "Empirically Validated"
                              ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                              : item.validationStatus === "Piloting"
                              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40"
                              : "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                          }`}
                        >
                          {item.validationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RISK REGISTER */}
      {activeSubTab === "risk_register" && (
        <div className="space-y-3">
          <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider mb-1">
                ENTERPRISE_RISK_REGISTER & DRIFT_MITIGATION
              </h3>
              <p className="text-[10px] text-[#666666]">
                Operational and algorithmic risk audit register with predefined fail-safes and ownership assignments.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-[#666666]">FILTER_STATUS:</span>
              <select
                aria-label="Filter Risk Status"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#050505] border border-[#1f1f1f] text-[#e0e0e0] rounded-[2px] px-2 py-0.5"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="Mitigated">MITIGATED</option>
                <option value="Monitoring">MONITORING</option>
                <option value="Open">OPEN</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead>
                  <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                    <th className="py-2.5 px-3">RISK_ID</th>
                    <th className="py-2.5 px-3">IDENTIFIED_RISK</th>
                    <th className="py-2.5 px-3">PROBABILITY</th>
                    <th className="py-2.5 px-3">IMPACT</th>
                    <th className="py-2.5 px-3">MITIGATION_STRATEGY</th>
                    <th className="py-2.5 px-3">OWNER</th>
                    <th className="py-2.5 px-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#161616] text-[#cccccc]">
                  {filteredRisks.map((r) => (
                    <tr key={r.id} className="hover:bg-[#141414] transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#00f0ff]">{r.id}</td>
                      <td className="py-2.5 px-3 font-medium text-[#e0e0e0]">{r.risk}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold ${
                            r.probability === "High"
                              ? "bg-[#ff0055]/15 text-[#ff0055]"
                              : r.probability === "Medium"
                              ? "bg-[#ffb700]/15 text-[#ffb700]"
                              : "bg-[#00ff66]/15 text-[#00ff66]"
                          }`}
                        >
                          {r.probability}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold ${
                            r.impact === "High"
                              ? "bg-[#ff0055]/15 text-[#ff0055]"
                              : r.impact === "Medium"
                              ? "bg-[#ffb700]/15 text-[#ffb700]"
                              : "bg-[#00ff66]/15 text-[#00ff66]"
                          }`}
                        >
                          {r.impact}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#aaaaaa] max-w-sm">{r.mitigation}</td>
                      <td className="py-2.5 px-3 text-[#888888]">{r.owner}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold border ${
                            r.status === "Mitigated"
                              ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                              : r.status === "Monitoring"
                              ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40"
                              : "bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/40"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PREVENTIVE ACTION REGISTRY */}
      {activeSubTab === "actions_tracker" && (
        <div className="space-y-3">
          <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider mb-1">
                PREVENTIVE_ENGINEERING_ACTION_REGISTRY
              </h3>
              <p className="text-[10px] text-[#666666]">
                Root-cause mitigation work orders across Product CAD, Packaging ECT, 3D Listing Content, and Logistics SLAs.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-[#666666]">CATEGORY:</span>
              <select
                aria-label="Filter Action Category"
                value={actionCategoryFilter}
                onChange={(e) => setActionCategoryFilter(e.target.value)}
                className="bg-[#050505] border border-[#1f1f1f] text-[#e0e0e0] rounded-[2px] px-2 py-0.5"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="PRODUCT">PRODUCT</option>
                <option value="PACKAGING">PACKAGING</option>
                <option value="CONTENT">CONTENT</option>
                <option value="INSTRUCTIONS">INSTRUCTIONS</option>
                <option value="LOGISTICS">LOGISTICS</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredActions.map((act) => (
              <div
                key={act.id}
                className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2 hover:border-[#00f0ff]/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#00f0ff]">{act.id}</span>
                    <span className="px-1.5 py-0.2 rounded-[2px] text-[9px] bg-[#141414] text-[#aaaaaa] border border-[#222222]">
                      {act.category}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold ${
                        act.priority === "CRITICAL"
                          ? "bg-[#ff0055]/20 text-[#ff0055]"
                          : act.priority === "HIGH"
                          ? "bg-[#ffb700]/20 text-[#ffb700]"
                          : "bg-[#00f0ff]/20 text-[#00f0ff]"
                      }`}
                    >
                      {act.priority}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleActionStatus(act.id)}
                    className={`px-2 py-0.5 rounded-[2px] text-[9px] font-bold border transition-colors cursor-pointer ${
                      act.status === "COMPLETED"
                        ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                        : act.status === "IN_PROGRESS"
                        ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40"
                        : "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                    }`}
                    title="Click to advance status"
                  >
                    STATUS: [{act.status}] &bull; CLICK TO ADVANCE
                  </button>
                </div>

                <div>
                  <div className="text-[10px] text-[#666666]">ROOT_CAUSE: {act.root_cause_label}</div>
                  <div className="text-[11px] font-semibold text-[#ffffff] mt-0.5">{act.recommended_action}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-[#191919] text-[10px]">
                  <div>
                    <span className="text-[#666666] block text-[9px]">EXPECTED_BENEFIT:</span>
                    <span className="text-[#00ff66]">{act.expected_benefit}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[9px]">ESTIMATED_COST / BUDGET:</span>
                    <span className="text-[#ffb700]">{act.estimated_cost}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block text-[9px]">OWNER & TARGET_DATE:</span>
                    <span className="text-[#aaaaaa]">
                      {act.owner} &bull; {act.target_date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
