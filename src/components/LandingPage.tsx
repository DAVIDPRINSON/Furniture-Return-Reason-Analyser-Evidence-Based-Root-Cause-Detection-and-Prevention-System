import React from "react";
import {
  Play,
  Upload,
  Network,
  BookOpen,
  Scale,
  ShieldCheck,
  Layers,
  Info,
} from "lucide-react";
import { STAKEHOLDER_ASSUMPTIONS } from "../data/assumptions";

interface LandingPageProps {
  onEnterApp?: () => void;
  onLaunchDemo?: () => void;
  onOpenUpload?: () => void;
  onViewArchitecture?: () => void;
  onOpenGuide?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onLaunchDemo,
  onOpenUpload,
  onViewArchitecture,
  onOpenGuide,
}) => {
  const handleLaunch = onLaunchDemo || onEnterApp || (() => {});

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#050505] text-[#e0e0e0] font-mono flex flex-col justify-between">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 space-y-4">
        {/* Synthetic Data Disclaimer Banner */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#ffb700]/10 border border-[#ffb700]/40 text-[#ffb700] text-[10px]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>SYNTHETIC_BENCHMARK_SUITE // VALIDATE WITH REAL ENTERPRISE ERP DATA FOR PRODUCTION DEPLOYMENT.</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-7 bg-[#0d0d0d] p-4 rounded-[2px] border border-[#1f1f1f] flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] text-[#00f0ff] uppercase tracking-wider block mb-1">
                SYSTEM_SPEC // BULKY_REVERSE_LOGISTICS_INTELLIGENCE
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#ffffff] leading-tight">
                Turn unstructured furniture returns into{" "}
                <span className="text-[#00f0ff]">actionable engineering proof.</span>
              </h1>
              <p className="text-xs text-[#888888] mt-2 leading-relaxed">
                Analyse customer feedback text, warehouse physical teardowns, CAD tolerances, and DEFRA CO2e emission factors to detect preventable root causes with cost, SLA, emissions, and reliability trade-offs.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleLaunch}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] font-bold rounded-[2px] transition-all text-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>[ENTER_APP_650_RECORDS]</span>
              </button>
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#1f1f1f] text-[#cccccc] font-semibold rounded-[2px] transition-all text-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>[UPLOAD_CSV]</span>
                </button>
              )}
              {onViewArchitecture && (
                <button
                  onClick={onViewArchitecture}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#1f1f1f] text-[#888888] hover:text-[#cccccc] rounded-[2px] transition-all text-xs cursor-pointer"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>[ARCHITECTURE]</span>
                </button>
              )}
              {onOpenGuide && (
                <button
                  onClick={onOpenGuide}
                  className="flex items-center gap-1.5 px-3 py-2 text-[#666666] hover:text-[#e0e0e0] text-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>[MANUAL]</span>
                </button>
              )}
            </div>

            {/* Value Highlights */}
            <div className="pt-3 grid grid-cols-3 gap-2 border-t border-[#1f1f1f] text-[10px]">
              <div>
                <span className="block text-base font-bold text-[#00ff66]">78.2%</span>
                <span className="text-[#666666]">PREVENTABLE_RATE</span>
              </div>
              <div>
                <span className="block text-base font-bold text-[#ffb700]">₹32.4L</span>
                <span className="text-[#666666]">AVOIDABLE_COST</span>
              </div>
              <div>
                <span className="block text-base font-bold text-[#00f0ff]">14.8 T</span>
                <span className="text-[#666666]">AVOIDABLE_CO2e</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f] mb-3">
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                  LIVE_FORENSIC_TELEMETRY_SAMPLE
                </span>
                <span className="px-1.5 py-0.2 rounded-[2px] bg-[#00ff66]/10 text-[#00ff66] text-[9px] font-bold border border-[#00ff66]/40">
                  91% CONFIDENCE
                </span>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="p-2 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
                  <div className="text-[#666666] text-[9px] mb-0.5">CUSTOMER_FEEDBACK:</div>
                  <div className="text-[#cccccc] italic">
                    "The front corner of the dining table is smashed and the carton had a hole at that corner."
                  </div>
                </div>

                <div className="p-2 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
                  <div className="text-[#666666] text-[9px] mb-0.5">WAREHOUSE_CERTIFIED_INSPECTION:</div>
                  <div className="text-[#00ff66]">
                    "Crushed front-left corner. EPS foam corner pad was only 15mm thick, fully compressed."
                  </div>
                </div>

                <div className="p-2 rounded-[2px] bg-[#00f0ff]/5 border border-[#00f0ff]/30">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[#00f0ff] font-bold">CLASSIFIED_ROOT_CAUSE:</span>
                    <span className="font-bold text-[#ffffff] uppercase text-[9px]">Insufficient Corner Protection</span>
                  </div>
                  <div className="text-[#888888] text-[9px]">
                    PREVENTABILITY: <strong className="text-[#00ff66]">PREVENTABLE</strong> | DEPT: <strong className="text-[#e0e0e0]">PACKAGING</strong>
                  </div>
                  <div className="mt-1 text-[9px] text-[#00f0ff]">
                    &rarr; ACTION: Standardize 50mm high-density molded EPE corner caps across bulky SKUs.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#1f1f1f] flex items-center justify-between text-[9px] text-[#666666]">
              <span>MULTI_OBJECTIVE_IMPACT:</span>
              <span className="text-[#aaaaaa]">Cost: ₹1,850 | SLA: 4.2d | CO2e: 18.7kg</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] p-3.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center mb-2 border border-[#00f0ff]/30">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#ffffff] mb-1">Evidence-Based Root Causes</h3>
            <p className="text-[10px] text-[#888888] leading-relaxed">
              Transparent multi-source scoring combining customer claims, certified warehouse tear-downs, listing CAD attributes, and SKU return history.
            </p>
          </div>

          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] p-3.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#00ff66]/10 text-[#00ff66] flex items-center justify-center mb-2 border border-[#00ff66]/30">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#ffffff] mb-1">Multi-Objective Trade-offs</h3>
            <p className="text-[10px] text-[#888888] leading-relaxed">
              Balances Cost × Turnaround Time × Emissions × Reliability. Dynamically optimizes reverse resolutions to prevent negative salvage truck runs.
            </p>
          </div>

          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] p-3.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#ffb700]/10 text-[#ffb700] flex items-center justify-center mb-2 border border-[#ffb700]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#ffffff] mb-1">Product-Team Validation</h3>
            <p className="text-[10px] text-[#888888] leading-relaxed">
              Closed-loop feedback station. Product engineers audit predictions, calibrate rule weights, and enforce ground-truth supplier chargebacks.
            </p>
          </div>
        </div>

        {/* Stakeholder Assumptions Section */}
        <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] p-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider">STAKEHOLDER_ASSUMPTIONS_MATRIX</h3>
              <p className="text-[10px] text-[#666666]">
                Core operational hypotheses mapped across functional divisions.
              </p>
            </div>
            <span className="px-2 py-0.5 bg-[#ffb700]/10 border border-[#ffb700]/40 text-[#ffb700] text-[9px] font-bold rounded-[2px]">
              STATUS: VALIDATION_PILOT
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-[#666666] bg-[#080808] text-[10px] uppercase">
                  <th className="py-2 px-3 font-semibold">STAKEHOLDER</th>
                  <th className="py-2 px-3 font-semibold">CORE_NEED</th>
                  <th className="py-2 px-3 font-semibold">SUCCESS_MEASURE</th>
                  <th className="py-2 px-3 font-semibold">HYPOTHESIS</th>
                  <th className="py-2 px-3 font-semibold">STAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616] text-[#cccccc]">
                {STAKEHOLDER_ASSUMPTIONS.map((item) => (
                  <tr key={item.id} className="hover:bg-[#141414]">
                    <td className="py-2 px-3 font-bold text-[#ffffff]">{item.stakeholder}</td>
                    <td className="py-2 px-3 text-[#aaaaaa]">{item.need}</td>
                    <td className="py-2 px-3 font-bold text-[#00f0ff]">{item.successMeasure}</td>
                    <td className="py-2 px-3 text-[#777777] max-w-xs">{item.keyHypothesis}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.2 rounded-[2px] bg-[#141414] text-[#aaaaaa] text-[9px] border border-[#222222]">
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
    </div>
  );
};
