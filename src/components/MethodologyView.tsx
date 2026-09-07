import React from "react";
import {
  BookOpen,
  Sliders,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_THRESHOLDS,
  RETURN_CATEGORIES,
} from "../data/taxonomy";
import { STAKEHOLDER_ASSUMPTIONS, RISK_REGISTER } from "../data/assumptions";

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen className="w-4 h-4 text-[#00f0ff]" />
          <h2 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider">
            SYSTEM_ARCHITECTURE // METHODOLOGY_&_SCORING_MATRICES
          </h2>
        </div>
        <p className="text-[10px] text-[#666666]">
          Multi-source forensic weighting heuristics, Bayes-adjusted confidence calculations, and operational risk mitigation registers.
        </p>
      </div>

      {/* Multi-Source Weighting Formula Card */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2.5">
        <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" /> MULTI_SOURCE_EVIDENCE_SCORING_FORMULA
        </h3>

        <p className="text-[10px] text-[#888888] leading-relaxed">
          The classifier synthesizes six independent signals to compute a composite confidence score (0–100%). Signals
          are weighted based on empirical forensic reliability:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">TEXT_NLP</span>
            <span className="font-bold text-[#ffb700] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.text_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">Customer feedback NLP</p>
          </div>

          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">INSPECTION</span>
            <span className="font-bold text-[#00ff66] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.inspection_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">Warehouse teardown</p>
          </div>

          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">PRODUCT_ATTR</span>
            <span className="font-bold text-[#00f0ff] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.product_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">CAD joins, material</p>
          </div>

          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">LISTING_DATA</span>
            <span className="font-bold text-[#00f0ff] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.listing_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">Color swatch, specs</p>
          </div>

          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">HISTORICAL</span>
            <span className="font-bold text-[#aaaaaa] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.historical_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">SKU family defect rate</p>
          </div>

          <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <span className="text-[9px] text-[#666666] block uppercase font-bold">HUMAN_AUDIT</span>
            <span className="font-bold text-[#ff0055] text-sm">
              {(DEFAULT_SCORING_WEIGHTS.validation_weight * 100).toFixed(0)}%
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">Engineer verification</p>
          </div>
        </div>

        {/* Confidence Tiering Logic */}
        <div className="p-2.5 bg-[#050505] rounded-[2px] border border-[#1f1f1f] text-[10px] text-[#888888]">
          <strong className="text-[#ffffff] block mb-1">DECISION_THRESHOLDS:</strong>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <li>
              &bull; <strong className="text-[#00ff66]">HIGH (&ge; {DEFAULT_THRESHOLDS.high_confidence}%):</strong> Auto-assign to engineering ECO queue.
            </li>
            <li>
              &bull; <strong className="text-[#ffb700]">REVIEW ({DEFAULT_THRESHOLDS.low_confidence}–{DEFAULT_THRESHOLDS.high_confidence - 1}%):</strong> Route to Human Validation Queue.
            </li>
            <li>
              &bull; <strong className="text-[#ff0055]">LOW (&lt; {DEFAULT_THRESHOLDS.low_confidence}%):</strong> Mandatory customer triage photo required before dispatch.
            </li>
          </ul>
        </div>
      </div>

      {/* Assumptions & Risk Register */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Stakeholder Assumptions */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" /> STAKEHOLDER_ASSUMPTIONS
          </h3>
          <div className="space-y-1.5 text-[10px] max-h-80 overflow-y-auto pr-1">
            {STAKEHOLDER_ASSUMPTIONS.map((a) => (
              <div key={a.id} className="p-2 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-[#ffffff]">{a.stakeholder}</span>
                  <span className="text-[8px] text-[#ffb700] px-1.5 py-0.2 bg-[#ffb700]/10 rounded-[2px] border border-[#ffb700]/40 font-bold">
                    {a.validationStatus}
                  </span>
                </div>
                <div className="text-[#aaaaaa]">{a.need} &bull; TARGET: <span className="text-[#00f0ff]">{a.successMeasure}</span></div>
                <p className="text-[#666666] mt-0.5 italic">"{a.keyHypothesis}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Register & Mitigations */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#ffb700]" /> RISK_REGISTER_&_MITIGATIONS
          </h3>
          <div className="space-y-1.5 text-[10px] max-h-80 overflow-y-auto pr-1">
            {RISK_REGISTER.map((r) => (
              <div key={r.id} className="p-2 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-[#ffffff]">{r.id}: {r.risk}</span>
                  <span className="text-[9px] text-[#666666]">OWNER: {r.owner}</span>
                </div>
                <p className="text-[#888888] mt-0.5">
                  <strong className="text-[#aaaaaa]">MITIGATION:</strong> {r.mitigation}
                </p>
                <div className="text-[9px] text-[#ffb700] mt-0.5">
                  IMPACT: {r.impact} &bull; PROB: {r.probability} &bull; STATUS: {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Category Taxonomy Table */}
      <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
        <div className="p-2.5 border-b border-[#1f1f1f]">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
            CANONICAL_RETURN_REASON_TAXONOMY (12_CATEGORIES)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                <th className="py-2 px-3">CATEGORY_ID</th>
                <th className="py-2 px-3">CATEGORY_NAME</th>
                <th className="py-2 px-3">PREVENTABILITY</th>
                <th className="py-2 px-3">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] text-[#cccccc]">
              {Object.values(RETURN_CATEGORIES).map((cat) => (
                <tr key={cat.id} className="hover:bg-[#141414]">
                  <td className="py-2 px-3 font-bold text-[#00f0ff]">{cat.id}</td>
                  <td className="py-2 px-3 font-semibold text-[#ffffff]">{cat.label}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] text-[8px] font-bold border ${
                        cat.defaultPreventability === "PREVENTABLE"
                          ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                          : cat.defaultPreventability === "PARTIALLY_PREVENTABLE"
                          ? "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                          : "bg-[#141414] text-[#888888] border-[#222222]"
                      }`}
                    >
                      {cat.defaultPreventability}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#888888]">{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
