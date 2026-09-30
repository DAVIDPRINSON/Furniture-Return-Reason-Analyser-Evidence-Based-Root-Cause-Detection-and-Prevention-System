import React, { useState } from "react";
import {
  X,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Leaf,
  ShieldAlert,
  Percent,
  TrendingDown,
  Info,
  DollarSign,
} from "lucide-react";
import { ScoringWeights, ModelThresholds, CostModelFactors } from "../types";
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_THRESHOLDS,
  DEFAULT_COST_FACTORS,
} from "../data/taxonomy";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeights: ScoringWeights;
  currentThresholds: ModelThresholds;
  currentCostFactors: CostModelFactors;
  onApplySettings: (
    weights: ScoringWeights,
    thresholds: ModelThresholds,
    costFactors: CostModelFactors
  ) => void;
  recordCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentWeights,
  currentThresholds,
  currentCostFactors,
  onApplySettings,
  recordCount,
}) => {
  if (!isOpen) return null;

  const [weights, setWeights] = useState<ScoringWeights>({ ...currentWeights });
  const [thresholds, setThresholds] = useState<ModelThresholds>({ ...currentThresholds });
  const [costFactors, setCostFactors] = useState<CostModelFactors>({ ...currentCostFactors });
  const [activeTab, setActiveTab] = useState<"weights" | "thresholds" | "emissions_cost">("weights");

  // Calculate sum of weights
  const totalWeight = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);

  const handleNormalizeWeights = () => {
    if (totalWeight <= 0) return;
    const factor = 100 / totalWeight;
    setWeights({
      text_weight: Math.round(weights.text_weight * factor),
      inspection_weight: Math.round(weights.inspection_weight * factor),
      product_weight: Math.round(weights.product_weight * factor),
      listing_weight: Math.round(weights.listing_weight * factor),
      customer_action_weight: Math.round(weights.customer_action_weight * factor),
      historical_weight: Math.round(weights.historical_weight * factor),
      validation_weight: Math.round(weights.validation_weight * factor),
    });
  };

  const handleResetDefaults = () => {
    setWeights({ ...DEFAULT_SCORING_WEIGHTS });
    setThresholds({ ...DEFAULT_THRESHOLDS });
    setCostFactors({ ...DEFAULT_COST_FACTORS });
  };

  const handleApply = () => {
    onApplySettings(weights, thresholds, costFactors);
    onClose();
  };

  // DEFRA and EPA presets for vehicle emission factors
  const setEmissionPreset = (val: number) => {
    setCostFactors((prev) => ({ ...prev, vehicle_emission_factor_kg_per_km: val }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 font-mono text-[#e0e0e0]">
      <div className="bg-[#0d0d0d] rounded-[2px] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#1f1f1f] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#0d0d0d] border-b border-[#1f1f1f] px-4 py-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00f0ff]" />
            <div>
              <h2 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
                ENGINE_CALIBRATION_SETTINGS // SCORING & EMISSION FACTORS
              </h2>
              <p className="text-[10px] text-[#666666]">
                Configure evidence weights, confidence cutoffs, and DEFRA emission metrics across {recordCount} records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-[#666666] hover:text-[#e0e0e0] hover:bg-[#1f1f1f] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1f1f1f] bg-[#080808] px-4 py-1 gap-2 text-[10px]">
          <button
            onClick={() => setActiveTab("weights")}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === "weights"
                ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                : "text-[#666666] hover:text-[#e0e0e0]"
            }`}
          >
            [EVIDENCE_SCORING_WEIGHTS]
          </button>
          <button
            onClick={() => setActiveTab("thresholds")}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === "thresholds"
                ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                : "text-[#666666] hover:text-[#e0e0e0]"
            }`}
          >
            [CONFIDENCE_THRESHOLDS]
          </button>
          <button
            onClick={() => setActiveTab("emissions_cost")}
            className={`px-3 py-1 rounded-[2px] transition-colors ${
              activeTab === "emissions_cost"
                ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                : "text-[#666666] hover:text-[#e0e0e0]"
            }`}
          >
            [EMISSIONS_&_COST_FACTORS]
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 space-y-4 flex-1">
          {activeTab === "weights" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f] text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#666666]">TOTAL_WEIGHT_SUM:</span>
                  <span
                    className={`font-bold text-xs ${
                      totalWeight === 100
                        ? "text-[#00ff66]"
                        : "text-[#ffb700]"
                    }`}
                  >
                    {totalWeight}%
                  </span>
                  {totalWeight !== 100 && (
                    <span className="text-[9px] text-[#ffb700] italic">
                      (Recommended sum is 100%)
                    </span>
                  )}
                </div>
                <button
                  onClick={handleNormalizeWeights}
                  className="px-2 py-0.5 bg-[#141414] hover:bg-[#1a1a1a] text-[#00f0ff] border border-[#00f0ff]/30 rounded-[2px] text-[9px] transition-colors cursor-pointer"
                >
                  [NORMALIZE_TO_100%]
                </button>
              </div>

              <div className="space-y-2 text-[10px]">
                {/* Text Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">Customer Return Text & Feedback (W_text)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.text_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={weights.text_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, text_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Weight attributed to keywords in customer return descriptions.
                  </span>
                </div>

                {/* Inspection Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#00ff66]">Physical Warehouse Inspection Report (W_insp)</span>
                    <span className="font-bold text-[#00ff66]">{weights.inspection_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={weights.inspection_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, inspection_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00ff66]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Highest-authority ground truth from physical return inspection teardown.
                  </span>
                </div>

                {/* Product Attributes Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">Product Physical Attributes & Weight (W_prod)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.product_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weights.product_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, product_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Weight factor for heavy solid wood joints, tempered glass fragility, and dimensions.
                  </span>
                </div>

                {/* Listing Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">Catalog Listing & 3D CAD Discrepancy (W_list)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.listing_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weights.listing_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, listing_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Flags dimension mismatches between product title/specs and customer expectations.
                  </span>
                </div>

                {/* Customer Action Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">Customer Portal Return Action (W_act)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.customer_action_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weights.customer_action_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, customer_action_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Distinguishes standard portal returns from direct calls or technician requests.
                  </span>
                </div>

                {/* Historical Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">Historical SKU Failure Rate (W_hist)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.historical_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weights.historical_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, historical_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Prior distribution of defects across identical SKU manufacturing batches.
                  </span>
                </div>

                {/* Validation Weight */}
                <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#e0e0e0]">QA / Product Team Feedback Ground Truth (W_val)</span>
                    <span className="font-bold text-[#00f0ff]">{weights.validation_weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weights.validation_weight}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, validation_weight: Number(e.target.value) }))
                    }
                    className="w-full accent-[#00f0ff]"
                  />
                  <span className="text-[9px] text-[#666666] block">
                    Weight granted to human QA engineer validation logs.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thresholds" && (
            <div className="space-y-3 text-[10px]">
              <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#ff0055]">Insufficient Evidence Cutoff (&lt; X)</span>
                  <span className="font-bold text-[#ff0055]">&lt; {thresholds.low_confidence}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="55"
                  value={thresholds.low_confidence}
                  onChange={(e) =>
                    setThresholds((prev) => ({ ...prev, low_confidence: Number(e.target.value) }))
                  }
                  className="w-full accent-[#ff0055]"
                />
                <span className="text-[9px] text-[#666666] block">
                  Records below this score default to UNKNOWN / INSUFFICIENT_EVIDENCE to avoid false positives.
                </span>
              </div>

              <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#ffb700]">Human Review Queue Range</span>
                  <span className="font-bold text-[#ffb700]">
                    {thresholds.low_confidence}% - {thresholds.high_confidence}%
                  </span>
                </div>
                <span className="text-[9px] text-[#666666] block">
                  Borderline confidence returns routed to Product Quality Engineers for manual verification.
                </span>
              </div>

              <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#00ff66]">Preventable Root Cause Auto-Flagging Threshold</span>
                  <span className="font-bold text-[#00ff66]">&ge; {thresholds.preventable_threshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={thresholds.preventable_threshold}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      preventable_threshold: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#00ff66]"
                />
                <span className="text-[9px] text-[#666666] block">
                  Confidence required before tagging an incident as PREVENTABLE and attributing to supplier SLA.
                </span>
              </div>
            </div>
          )}

          {activeTab === "emissions_cost" && (
            <div className="space-y-3 text-[10px]">
              {/* Emission Factor */}
              <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span className="font-bold text-[#e0e0e0]">
                      Vehicle Freight Emission Factor (DEFRA / EPA Standards)
                    </span>
                  </div>
                  <span className="font-bold text-[#00ff66]">
                    {costFactors.vehicle_emission_factor_kg_per_km} kg CO2e / km
                  </span>
                </div>

                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  max="1.5"
                  value={costFactors.vehicle_emission_factor_kg_per_km}
                  onChange={(e) =>
                    setCostFactors((prev) => ({
                      ...prev,
                      vehicle_emission_factor_kg_per_km: parseFloat(e.target.value) || 0.28,
                    }))
                  }
                  className="w-full px-2 py-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] text-[#e0e0e0] font-mono text-[11px]"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] text-[#666666] self-center mr-1">PRESETS:</span>
                  <button
                    type="button"
                    onClick={() => setEmissionPreset(0.28)}
                    className="px-2 py-0.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#aaaaaa] border border-[#222222] rounded-[2px] text-[9px]"
                  >
                    DEFRA 2026 Light Van (0.28)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmissionPreset(0.36)}
                    className="px-2 py-0.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#aaaaaa] border border-[#222222] rounded-[2px] text-[9px]"
                  >
                    EPA Class 4 Medium Freight (0.36)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmissionPreset(0.09)}
                    className="px-2 py-0.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#00ff66] border border-[#00ff66]/30 rounded-[2px] text-[9px]"
                  >
                    EV Delivery Fleet (0.09)
                  </button>
                </div>
              </div>

              {/* Base Pickup & Handling Cost */}
              <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#e0e0e0]">Disposal / Landfill Base Surcharge</span>
                  <span className="font-bold text-[#ffb700]">₹{costFactors.disposal_cost_base}</span>
                </div>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={costFactors.disposal_cost_base}
                  onChange={(e) =>
                    setCostFactors((prev) => ({
                      ...prev,
                      disposal_cost_base: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-2 py-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] text-[#e0e0e0] font-mono text-[11px]"
                />
              </div>

              {/* Warehouse Inspection & Labor Cost */}
              <div className="bg-[#050505] p-3 rounded-[2px] border border-[#1f1f1f] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#e0e0e0]">Hourly Ops Labor Cost</span>
                  <span className="font-bold text-[#00f0ff]">₹{costFactors.hourly_ops_labor_cost} / hr</span>
                </div>
                <input
                  type="number"
                  step="50"
                  min="100"
                  value={costFactors.hourly_ops_labor_cost}
                  onChange={(e) =>
                    setCostFactors((prev) => ({
                      ...prev,
                      hourly_ops_labor_cost: Number(e.target.value) || 450,
                    }))
                  }
                  className="w-full px-2 py-1 bg-[#0d0d0d] border border-[#1f1f1f] rounded-[2px] text-[#e0e0e0] font-mono text-[11px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-[#1f1f1f] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#888888] hover:text-[#e0e0e0] bg-[#141414] hover:bg-[#1c1c1c] border border-[#222222] rounded-[2px] text-[10px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>[RESET_DEFAULTS]</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[#888888] hover:text-[#e0e0e0] border border-[#1f1f1f] rounded-[2px] text-[10px] transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-[#050505] font-bold text-[10px] rounded-[2px] transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APPLY & RECALIBRATE DATASET</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
