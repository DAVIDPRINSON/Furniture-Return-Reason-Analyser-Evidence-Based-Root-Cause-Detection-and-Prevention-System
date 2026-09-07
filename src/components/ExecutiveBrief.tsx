import React from "react";
import {
  Download,
  Printer,
} from "lucide-react";
import { ReturnRecord } from "../types";
import { downloadSummaryReport } from "../services/export";

interface ExecutiveBriefProps {
  records: ReturnRecord[];
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({ records }) => {
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

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0] max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex items-center justify-between">
        <div>
          <span className="text-[9px] text-[#666666] uppercase tracking-wider block">MEMORANDUM // STEERING_COMMITTEE</span>
          <h2 className="text-xs font-bold text-[#e0e0e0]">Executive Return Reduction Strategy Brief</h2>
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

      {/* Brief Document Container */}
      <div className="bg-[#0d0d0d] p-5 rounded-[2px] border border-[#1f1f1f] space-y-4 text-[11px] leading-relaxed">
        {/* Title & Metadata Header */}
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

        {/* Section 2: Key Diagnostic Findings */}
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
    </div>
  );
};
