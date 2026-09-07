import { ReturnCategory, RootCauseId, Preventability, ScoringWeights, ModelThresholds, CostModelFactors } from "../types";

export interface TaxonomyCategoryMeta {
  id: ReturnCategory;
  label: string;
  description: string;
  defaultPreventability: Preventability;
  color: string;
}

export const RETURN_CATEGORIES: Record<ReturnCategory, TaxonomyCategoryMeta> = {
  PRODUCT_DEFECT: {
    id: "PRODUCT_DEFECT",
    label: "Product Defect",
    description: "Inherent manufacturing flaw, material weakness, or engineering failure.",
    defaultPreventability: "PREVENTABLE",
    color: "emerald",
  },
  PRODUCT_DAMAGE: {
    id: "PRODUCT_DAMAGE",
    label: "Product Damage",
    description: "Physical breakage or damage requiring root-cause triage (transit vs structural).",
    defaultPreventability: "PREVENTABLE",
    color: "amber",
  },
  PACKAGING_FAILURE: {
    id: "PACKAGING_FAILURE",
    label: "Packaging Failure",
    description: "Crushed carton, corner puncture, or insufficient interior cushioning/strapping.",
    defaultPreventability: "PREVENTABLE",
    color: "orange",
  },
  DELIVERY_DAMAGE: {
    id: "DELIVERY_DAMAGE",
    label: "Delivery Damage",
    description: "Transit mishandling, drop impact, carrier crush, or weather exposure.",
    defaultPreventability: "PARTIALLY_PREVENTABLE",
    color: "rose",
  },
  MISSING_PART: {
    id: "MISSING_PART",
    label: "Missing Part / Hardware",
    description: "Screws, bolts, brackets, cushions, or legs absent from the shipped package.",
    defaultPreventability: "PREVENTABLE",
    color: "teal",
  },
  ASSEMBLY_DIFFICULTY: {
    id: "ASSEMBLY_DIFFICULTY",
    label: "Assembly Difficulty",
    description: "Ambiguous manual, misaligned pilot holes, missing tools, or extreme complexity.",
    defaultPreventability: "PREVENTABLE",
    color: "indigo",
  },
  SIZE_OR_DIMENSION_MISMATCH: {
    id: "SIZE_OR_DIMENSION_MISMATCH",
    label: "Size / Dimension Mismatch",
    description: "Item does not fit in customer space or doorway, or customer mismeasured.",
    defaultPreventability: "PARTIALLY_PREVENTABLE",
    color: "cyan",
  },
  LISTING_CONTENT_MISMATCH: {
    id: "LISTING_CONTENT_MISMATCH",
    label: "Listing Content Mismatch",
    description: "Discrepancy between online photos/specs and physical product delivered.",
    defaultPreventability: "PREVENTABLE",
    color: "purple",
  },
  QUALITY_EXPECTATION: {
    id: "QUALITY_EXPECTATION",
    label: "Quality Expectation Gap",
    description: "Subjective dissatisfaction with wood grain, finish luster, foam firmness, etc.",
    defaultPreventability: "PARTIALLY_PREVENTABLE",
    color: "violet",
  },
  CUSTOMER_CHANGED_MIND: {
    id: "CUSTOMER_CHANGED_MIND",
    label: "Customer Changed Mind",
    description: "Discretionary return without functional defect, error, or listing divergence.",
    defaultPreventability: "NOT_PREVENTABLE",
    color: "slate",
  },
  CUSTOMER_ERROR: {
    id: "CUSTOMER_ERROR",
    label: "Customer Error",
    description: "Incorrect ordering, customer assembly damage, or customer measurement mistake.",
    defaultPreventability: "NOT_PREVENTABLE",
    color: "gray",
  },
  UNKNOWN: {
    id: "UNKNOWN",
    label: "Unknown / Needs Review",
    description: "Ambiguous comments or conflicting reports requiring manual inspection.",
    defaultPreventability: "INSUFFICIENT_EVIDENCE",
    color: "zinc",
  },
};

export interface RootCauseMeta {
  id: RootCauseId;
  label: string;
  category: ReturnCategory;
  preventability: Preventability;
  description: string;
  department: "PRODUCT" | "PACKAGING" | "CONTENT" | "INSTRUCTIONS" | "LOGISTICS" | "CUSTOMER";
  suggestedAction: string;
}

export const ROOT_CAUSES: Record<RootCauseId, RootCauseMeta> = {
  weak_joint: {
    id: "weak_joint",
    label: "Weak Joint / Dowel Failure",
    category: "PRODUCT_DEFECT",
    preventability: "PREVENTABLE",
    description: "Under-engineered mortise/tenon or insufficient joint glue causing seam separation.",
    department: "PRODUCT",
    suggestedAction: "Reinforce joint dowel diameter by 3mm and specify polyurethane adhesive.",
  },
  cracked_panel: {
    id: "cracked_panel",
    label: "Cracked Wood Panel",
    category: "PRODUCT_DAMAGE",
    preventability: "PREVENTABLE",
    description: "Kiln drying stress or stress concentration causing timber grain split.",
    department: "PRODUCT",
    suggestedAction: "Audit moisture content at supplier kiln (<10% EMC threshold).",
  },
  missing_hardware: {
    id: "missing_hardware",
    label: "Missing Hardware Pack / Screws",
    category: "MISSING_PART",
    preventability: "PREVENTABLE",
    description: "Hardware blister pouch omitted or dropped during factory boxing.",
    department: "PRODUCT",
    suggestedAction: "Implement optical weight-check sensors on hardware packaging line.",
  },
  poor_packaging: {
    id: "poor_packaging",
    label: "Poor / Thin Packaging",
    category: "PACKAGING_FAILURE",
    preventability: "PREVENTABLE",
    description: "Single-wall corrugated carton crushed under standard pallet stacking.",
    department: "PACKAGING",
    suggestedAction: "Upgrade carton grade to 275-lb double-wall corrugated with 200# Mullen burst.",
  },
  insufficient_corner_protection: {
    id: "insufficient_corner_protection",
    label: "Insufficient Corner Protection",
    category: "PACKAGING_FAILURE",
    preventability: "PREVENTABLE",
    description: "Corner impact penetrates inadequate EPS foam blocks.",
    department: "PACKAGING",
    suggestedAction: "Standardize 50mm high-density molded EPE corner caps across bulky SKUs.",
  },
  incorrect_dimensions_in_listing: {
    id: "incorrect_dimensions_in_listing",
    label: "Incorrect Dimensions in Listing",
    category: "LISTING_CONTENT_MISMATCH",
    preventability: "PREVENTABLE",
    description: "Listing text or CAD schematic provides inaccurate exterior clearance dimensions.",
    department: "CONTENT",
    suggestedAction: "Re-measure physical production golden sample and revise listing PDP.",
  },
  misleading_material_description: {
    id: "misleading_material_description",
    label: "Misleading Material Description",
    category: "LISTING_CONTENT_MISMATCH",
    preventability: "PREVENTABLE",
    description: "Listing stated 'Solid Walnut' when item has engineered veneer core.",
    department: "CONTENT",
    suggestedAction: "Align copy guidelines with legal truth-in-advertising terminology.",
  },
  assembly_instruction_gap: {
    id: "assembly_instruction_gap",
    label: "Assembly Instruction Gap",
    category: "ASSEMBLY_DIFFICULTY",
    preventability: "PREVENTABLE",
    description: "Missing orientation diagrams for cam-lock fasteners or ambiguous fastener steps.",
    department: "INSTRUCTIONS",
    suggestedAction: "Add exploded 3D isometric view and QR code assembly video link.",
  },
  assembly_complexity: {
    id: "assembly_complexity",
    label: "Assembly Complexity / Tolerance Defect",
    category: "ASSEMBLY_DIFFICULTY",
    preventability: "PREVENTABLE",
    description: "Tolerance stack-up causes misaligned pilot holes requiring heavy force.",
    department: "PRODUCT",
    suggestedAction: "Adjust CNC drilling jig tolerance from ±1.5mm to ±0.5mm.",
  },
  delivery_handling: {
    id: "delivery_handling",
    label: "Delivery Handling Impact",
    category: "DELIVERY_DAMAGE",
    preventability: "PARTIALLY_PREVENTABLE",
    description: "Severe transit shock, drop, puncture, or vehicle shifting during last-mile haul.",
    department: "LOGISTICS",
    suggestedAction: "Require palletized lift-gate handling and shock-sensor audits on top carriers.",
  },
  customer_measurement_error: {
    id: "customer_measurement_error",
    label: "Customer Measurement / Fit Error",
    category: "CUSTOMER_ERROR",
    preventability: "NOT_PREVENTABLE",
    description: "Customer failed to measure entryway, hallway turn, or ceiling clearance.",
    department: "CONTENT",
    suggestedAction: "Introduce 'Will It Fit?' interactive fit calculator widget on product page.",
  },
  customer_preference: {
    id: "customer_preference",
    label: "Customer Discretionary Preference",
    category: "CUSTOMER_CHANGED_MIND",
    preventability: "NOT_PREVENTABLE",
    description: "Customer simply ordered multiple items or decided against keeping the product.",
    department: "CUSTOMER",
    suggestedAction: "Offer localized swatch samples or virtual room-render AR preview.",
  },
  conflicting_evidence: {
    id: "conflicting_evidence",
    label: "Conflicting Evidence (Requires Review)",
    category: "UNKNOWN",
    preventability: "INSUFFICIENT_EVIDENCE",
    description: "Customer claim and warehouse inspection contradict (e.g. claim damaged vs intact arrival).",
    department: "PRODUCT",
    suggestedAction: "Trigger secondary senior inspection with high-res photo audit.",
  },
  unknown_root_cause: {
    id: "unknown_root_cause",
    label: "Unknown Root Cause / Insufficient Evidence",
    category: "UNKNOWN",
    preventability: "INSUFFICIENT_EVIDENCE",
    description: "Minimal text, absent inspection, and inconclusive transit report.",
    department: "PRODUCT",
    suggestedAction: "Mandate mandatory photo upload during return initiation flow.",
  },
};

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  text_weight: 0.25,
  inspection_weight: 0.30,
  product_weight: 0.15,
  listing_weight: 0.10,
  customer_action_weight: 0.05,
  historical_weight: 0.10,
  validation_weight: 0.05,
};

export const DEFAULT_THRESHOLDS: ModelThresholds = {
  low_confidence: 40,
  review_confidence: 70,
  high_confidence: 85,
  very_high_confidence: 85,
  preventable_threshold: 80,
  partially_preventable_threshold: 50,
};

export const DEFAULT_COST_FACTORS: CostModelFactors = {
  vehicle_emission_factor_kg_per_km: 0.278, // Average diesel delivery van kg CO2e / km
  disposal_cost_base: 1200, // Landfill/waste fee
  refurbishment_cost_ratio: 0.35, // 35% of product price
  inspection_cost_base: 450,
  hourly_ops_labor_cost: 350,
};
