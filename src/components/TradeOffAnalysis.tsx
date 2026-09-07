import React, { useState, useMemo } from "react";
import {
  Scale,
  DollarSign,
  Clock,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { ReturnRecord, StrategyOption, TradeOffWeights } from "../types";

interface TradeOffAnalysisProps {
  records: ReturnRecord[];
}

export const TradeOffAnalysis: React.FC<TradeOffAnalysisProps> = ({ records }) => {
  // 4 Sliders ensuring sum is 100%
  const [weights, setWeights] = useState<TradeOffWeights>({
    cost_importance: 25,
    service_importance: 25,
    emission_importance: 25,
    reliability_importance: 25,
  });

  const handleWeightChange = (key: keyof TradeOffWeights, newVal: number) => {
    const clamped = Math.max(0, Math.min(100, newVal));
    const otherKeys = (Object.keys(weights) as (keyof TradeOffWeights)[]).filter((k) => k !== key);
    const currentOtherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0);

    const diff = 100 - clamped;
    const newWeights = { ...weights, [key]: clamped };

    if (currentOtherSum > 0) {
      otherKeys.forEach((k) => {
        newWeights[k] = Math.max(0, Math.round((weights[k] / currentOtherSum) * diff));
      });
    } else {
      const split = Math.floor(diff / otherKeys.length);
      otherKeys.forEach((k) => {
        newWeights[k] = split;
      });
    }

    // Fix rounding remainder
    const total = (Object.values(newWeights) as number[]).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      newWeights[otherKeys[0]] += 100 - total;
    }

    setWeights(newWeights);
  };

  // 5 Strategies from Section 16
  const baseStrategies: StrategyOption[] = useMemo(
    () => [
      {
        id: "immediate_replacement",
        name: "Immediate Replacement",
        description: "Dispatch new replacement unit immediately prior to return pickup inspection.",
        cost_index: 85,
        time_hours: 24,
        co2e_kg: 38.5,
        reliability_score: 85,
        cost_display: "High (₹18,500 avg)",
        time_display: "Low (1.0 day)",
        co2e_display: "High (38.5 kg)",
        reliability_display: "High (85%)",
        recommended_for: "VIP customer accounts, low-cost SKUs with catastrophic structural defect.",
      },
      {
        id: "on_site_repair",
        name: "On-Site / Local Carpenter Repair",
        description: "Dispatch technician with replacement joint, dowel, or cosmetic touch-up kit.",
        cost_index: 45,
        time_hours: 72,
        co2e_kg: 8.2,
        reliability_score: 72,
        cost_display: "Medium (₹3,200 avg)",
        time_display: "Medium (3.0 days)",
        co2e_display: "Low (8.2 kg)",
        reliability_display: "Medium (72%)",
        recommended_for: "Loose joints, veneer scratches, missing hardware packs.",
      },
      {
        id: "refurbish_repack",
        name: "Warehouse Refurbishment & Re-boxing",
        description: "Pick up bulky unit, return to regional hub, recondition and resell in outlet.",
        cost_index: 55,
        time_hours: 120,
        co2e_kg: 19.4,
        reliability_score: 78,
        cost_display: "Medium (₹6,400 avg)",
        time_display: "High (5.0 days)",
        co2e_display: "Medium (19.4 kg)",
        reliability_display: "Medium (78%)",
        recommended_for: "Bulky sofas and beds returned in unblemished condition.",
      },
      {
        id: "immediate_refund",
        name: "Full Customer Refund (Keep or Donate)",
        description: "Zero reverse logistics truck dispatch; customer keeps or donates bulky item.",
        cost_index: 30,
        time_hours: 48,
        co2e_kg: 2.0,
        reliability_score: 88,
        cost_display: "Low (₹1,800 net saving)",
        time_display: "Low (2.0 days)",
        co2e_display: "Minimal (2.0 kg)",
        reliability_display: "High (88%)",
        recommended_for: "Low-margin items where 2-man freight exceeds salvage value.",
      },
      {
        id: "secondary_inspection",
        name: "Mandatory Secondary Video / Photographic Inspection",
        description: "Triage customer photos or video call before scheduling bulky 2-man freight truck roll.",
        cost_index: 20,
        time_hours: 48,
        co2e_kg: 0.5,
        reliability_score: 95,
        cost_display: "Very Low (₹450 audit)",
        time_display: "Medium (2.0 days)",
        co2e_display: "Zero (0.5 kg)",
        reliability_display: "Very High (95%)",
        recommended_for: "Conflicting evidence, ambiguous return text, or customer sizing queries.",
      },
    ],
    []
  );

  const scoredStrategies = useMemo(() => {
    return baseStrategies
      .map((strat) => {
        const costUtility = 100 - strat.cost_index;
        const timeUtility = Math.max(0, 100 - (strat.time_hours / 140) * 100);
        const co2eUtility = Math.max(0, 100 - (strat.co2e_kg / 45) * 100);
        const reliabilityUtility = strat.reliability_score;

        const compositeScore = Math.round(
          (costUtility * weights.cost_importance +
            timeUtility * weights.service_importance +
            co2eUtility * weights.emission_importance +
            reliabilityUtility * weights.reliability_importance) /
            100
        );

        return {
          ...strat,
          trade_off_score: compositeScore,
        };
      })
      .sort((a, b) => (b.trade_off_score || 0) - (a.trade_off_score || 0));
  }, [baseStrategies, weights]);

  const recommendedStrategy = scoredStrategies[0];

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
        <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
          DECISION_ENGINE // MULTI_OBJECTIVE_OPTIMIZATION
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <Scale className="w-4 h-4 text-[#00f0ff]" />
          <h2 className="text-xs font-bold text-[#e0e0e0]">
            Multi-Objective Trade-off Matrix (Cost × SLA × GHG × Reliability)
          </h2>
        </div>
        <p className="text-[10px] text-[#666666] mt-1">
          Adjust corporate objective weights dynamically. The optimizer ranks reverse resolution strategies in real time.
        </p>
      </div>

      {/* Interactive Sliders: 4 Decision Weights */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider">
            CORPORATE_PRIORITY_WEIGHTS (Σ = 100%)
          </span>
          <button
            onClick={() =>
              setWeights({
                cost_importance: 25,
                service_importance: 25,
                emission_importance: 25,
                reliability_importance: 25,
              })
            }
            className="text-[10px] text-[#00f0ff] hover:underline cursor-pointer"
          >
            [EQUILIBRIUM_25_EACH]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Cost Importance */}
          <div className="p-2.5 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-[#888888] flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#ffb700]" /> COST_WEIGHT:
              </span>
              <span className="font-bold text-[#ffb700]">{weights.cost_importance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.cost_importance}
              onChange={(e) => handleWeightChange("cost_importance", Number(e.target.value))}
              className="w-full accent-[#ffb700] cursor-pointer"
            />
            <span className="text-[9px] text-[#555555] block mt-0.5">Minimizing reverse logistics cost</span>
          </div>

          {/* Service / SLA Importance */}
          <div className="p-2.5 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-[#888888] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00f0ff]" /> SPEED_SLA_WEIGHT:
              </span>
              <span className="font-bold text-[#00f0ff]">{weights.service_importance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.service_importance}
              onChange={(e) => handleWeightChange("service_importance", Number(e.target.value))}
              className="w-full accent-[#00f0ff] cursor-pointer"
            />
            <span className="text-[9px] text-[#555555] block mt-0.5">Minimizing resolution turnaround time</span>
          </div>

          {/* Emissions Importance */}
          <div className="p-2.5 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-[#888888] flex items-center gap-1">
                <Leaf className="w-3 h-3 text-[#00ff66]" /> CO2e_WEIGHT:
              </span>
              <span className="font-bold text-[#00ff66]">{weights.emission_importance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.emission_importance}
              onChange={(e) => handleWeightChange("emission_importance", Number(e.target.value))}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
            <span className="text-[9px] text-[#555555] block mt-0.5">Reducing return truck fuel emissions</span>
          </div>

          {/* Reliability Importance */}
          <div className="p-2.5 rounded-[2px] bg-[#050505] border border-[#1f1f1f]">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-[#888888] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#ff0055]" /> RELIABILITY_WEIGHT:
              </span>
              <span className="font-bold text-[#ff0055]">{weights.reliability_importance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.reliability_importance}
              onChange={(e) => handleWeightChange("reliability_importance", Number(e.target.value))}
              className="w-full accent-[#ff0055] cursor-pointer"
            />
            <span className="text-[9px] text-[#555555] block mt-0.5">Ensuring root defect permanently fixed</span>
          </div>
        </div>
      </div>

      {/* Recommended Winner Alert */}
      {recommendedStrategy && (
        <div className="bg-[#00ff66]/10 border border-[#00ff66]/40 p-3 rounded-[2px] flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#00ff66]">
                OPTIMAL_DECISION: {recommendedStrategy.name}
              </span>
              <span className="px-1.5 py-0.2 bg-[#00ff66]/20 text-[#00ff66] text-[9px] rounded-[2px] font-bold">
                SCORE: {recommendedStrategy.trade_off_score}/100
              </span>
            </div>
            <p className="text-[#aaaaaa]">{recommendedStrategy.description}</p>
            <div className="text-[10px] text-[#00ff66]">
              RULE: {recommendedStrategy.recommended_for}
            </div>
          </div>
        </div>
      )}

      {/* Strategies Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {scoredStrategies.map((strat, index) => {
          const isWinner = index === 0;
          return (
            <div
              key={strat.id}
              className={`p-3 rounded-[2px] border transition-all flex flex-col justify-between ${
                isWinner
                  ? "bg-[#0d0d0d] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "bg-[#0d0d0d] border-[#1f1f1f]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-[#666666]">RANK #{index + 1}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.2 rounded-[2px] border ${
                      isWinner
                        ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/40"
                        : "bg-[#141414] text-[#888888] border-[#222222]"
                    }`}
                  >
                    SCORE: {strat.trade_off_score}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-[#ffffff] mb-1">{strat.name}</h3>
                <p className="text-[10px] text-[#888888] mb-3 leading-relaxed">{strat.description}</p>

                {/* Strategy Metric Breakdown */}
                <div className="space-y-1.5 text-[10px] bg-[#050505] p-2 rounded-[2px] border border-[#1f1f1f] mb-3">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">COST:</span>
                    <span className="font-bold text-[#ffb700]">{strat.cost_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">TIME_TO_RESOLVE:</span>
                    <span className="font-bold text-[#00f0ff]">{strat.time_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">TRANSPORT_EMISSION:</span>
                    <span className="font-bold text-[#00ff66]">{strat.co2e_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">FIX_RELIABILITY:</span>
                    <span className="font-bold text-[#ff0055]">{strat.reliability_display}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1f1f1f] text-[9px] text-[#666666]">
                BEST_FOR: <span className="text-[#aaaaaa]">{strat.recommended_for}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
