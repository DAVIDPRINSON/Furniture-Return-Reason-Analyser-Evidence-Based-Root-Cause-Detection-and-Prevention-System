export type ReturnCategory =
  | "PRODUCT_DEFECT"
  | "PRODUCT_DAMAGE"
  | "PACKAGING_FAILURE"
  | "DELIVERY_DAMAGE"
  | "MISSING_PART"
  | "ASSEMBLY_DIFFICULTY"
  | "SIZE_OR_DIMENSION_MISMATCH"
  | "LISTING_CONTENT_MISMATCH"
  | "QUALITY_EXPECTATION"
  | "CUSTOMER_CHANGED_MIND"
  | "CUSTOMER_ERROR"
  | "UNKNOWN";

export type Preventability =
  | "PREVENTABLE"
  | "PARTIALLY_PREVENTABLE"
  | "NOT_PREVENTABLE"
  | "INSUFFICIENT_EVIDENCE";

export type RootCauseId =
  | "weak_joint"
  | "cracked_panel"
  | "missing_hardware"
  | "poor_packaging"
  | "insufficient_corner_protection"
  | "incorrect_dimensions_in_listing"
  | "misleading_material_description"
  | "assembly_instruction_gap"
  | "assembly_complexity"
  | "delivery_handling"
  | "customer_measurement_error"
  | "customer_preference"
  | "conflicting_evidence"
  | "unknown_root_cause";

export type ValidationStatus =
  | "VALIDATED"
  | "PARTIALLY_VALIDATED"
  | "REJECTED"
  | "NEEDS_MORE_EVIDENCE"
  | "PENDING_REVIEW";

export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface ReturnRecord {
  return_id: string;
  return_date: string;
  product_id: string;
  sku: string;
  product_category: string;
  product_name: string;
  product_price: number;
  product_weight: number; // in kg
  product_dimensions: string; // e.g. "180x90x75 cm"
  return_text: string;
  original_return_reason: string;
  customer_action: string;
  listing_title: string;
  listing_description: string;
  assembly_instructions: string; // e.g. "Available", "Missing Step 4", "Text Only"
  product_images_available: number;
  inspection_finding: string;
  damage_type: string;
  damage_location: string;
  packaging_condition: string; // "Intact", "Crushed", "Torn Corner", "Missing Padding"
  delivery_condition: string; // "Normal", "Rough Transit", "Damaged Carton"
  pickup_required: boolean;
  replacement_required: boolean;
  refund_amount: number;
  pickup_cost: number;
  replacement_cost: number;
  pickup_time_hours: number;
  resolution_time_hours: number;
  estimated_distance_km: number;
  validated_root_cause?: string;
  product_team_feedback?: string;

  // Computed / Analysed Fields
  analysed_category?: ReturnCategory;
  analysed_root_cause?: RootCauseId;
  analysed_preventability?: Preventability;
  confidence_score?: number; // 0 - 100
  priority_score?: number; // 0 - 100
  priority_level?: PriorityLevel;
  evidence_breakdown?: EvidenceBreakdown;
  evidence_points?: string[];
  recommended_action?: string;
  is_edge_case?: boolean;
  edge_case_type?: string;
  estimated_co2e_kg?: number;
  total_cost?: number;
  validation_status?: ValidationStatus;
  validation_history?: ValidationLog[];
}

export interface EvidenceBreakdown {
  text_evidence: number; // 0 - 100
  inspection_evidence: number; // 0 - 100
  product_evidence: number; // 0 - 100
  listing_evidence: number; // 0 - 100
  customer_action_evidence: number; // 0 - 100
  historical_evidence: number; // 0 - 100
  validation_evidence: number; // 0 - 100
}

export interface ScoringWeights {
  text_weight: number;
  inspection_weight: number;
  product_weight: number;
  listing_weight: number;
  customer_action_weight: number;
  historical_weight: number;
  validation_weight: number;
}

export interface ModelThresholds {
  low_confidence: number; // < 40
  review_confidence: number; // 40 - 69
  high_confidence: number; // 70 - 84
  very_high_confidence: number; // >= 85
  preventable_threshold: number; // >= 80
  partially_preventable_threshold: number; // 50 - 79
}

export interface CostModelFactors {
  vehicle_emission_factor_kg_per_km: number; // default ~0.28 kg CO2e / km for van/light truck
  disposal_cost_base: number;
  refurbishment_cost_ratio: number; // fraction of product price
  inspection_cost_base: number;
  hourly_ops_labor_cost: number;
}

export interface TradeOffWeights {
  cost_importance: number; // 0 - 100
  service_importance: number; // 0 - 100
  emission_importance: number; // 0 - 100
  reliability_importance: number; // 0 - 100
}

export interface StrategyOption {
  id: string;
  name: string;
  description: string;
  cost_index: number; // 0 - 100 (higher = worse/more expensive)
  time_hours: number; // resolution time
  co2e_kg: number; // carbon emissions
  reliability_score: number; // 0 - 100 (higher = more reliable)
  cost_display: string;
  time_display: string;
  co2e_display: string;
  reliability_display: string;
  recommended_for: string;
  trade_off_score?: number;
}

export interface ValidationLog {
  id: string;
  timestamp: string;
  reviewer: string;
  status: ValidationStatus;
  comment: string;
  corrected_root_cause?: string;
}

export interface TestCase {
  id: string;
  title: string;
  category: string;
  input: {
    return_text: string;
    original_return_reason: string;
    inspection_finding: string;
    packaging_condition: string;
    delivery_condition: string;
    listing_title: string;
    listing_dimensions?: string;
    customer_action?: string;
  };
  expected_category: ReturnCategory;
  expected_root_cause: RootCauseId;
  expected_preventability: Preventability;
  min_confidence: number;
  notes: string;
  is_edge_case?: boolean;
}

export interface ActionItem {
  id: string;
  root_cause: RootCauseId;
  root_cause_label: string;
  recommended_action: string;
  category: "PRODUCT" | "PACKAGING" | "CONTENT" | "INSTRUCTIONS" | "LOGISTICS";
  owner: string;
  priority: PriorityLevel;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "MONITORING";
  expected_benefit: string;
  estimated_cost: string;
  target_date: string;
  confidence: number;
}

export interface UserPersona {
  id: "ops_analyst" | "product_team" | "exec_sustainability";
  name: string;
  role: string;
  description: string;
  focus_metrics: string[];
}
