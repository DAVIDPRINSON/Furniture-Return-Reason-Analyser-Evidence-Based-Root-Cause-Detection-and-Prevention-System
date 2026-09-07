import { UserPersona } from "../types";

export interface StakeholderAssumption {
  id: string;
  stakeholder: string;
  need: string;
  successMeasure: string;
  keyHypothesis: string;
  validationStatus: "Assumed - Requires Validation" | "Piloting" | "Empirically Validated";
}

export const STAKEHOLDER_ASSUMPTIONS: StakeholderAssumption[] = [
  {
    id: "ops",
    stakeholder: "Operations",
    need: "Reduce unnecessary returns/pickups",
    successMeasure: "Lower avoidable pickup rate",
    keyHypothesis: "Evidence-driven root cause flags will stop repeat dispatch of fragile SKUs before packaging fixes are applied.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "product",
    stakeholder: "Product Team",
    need: "Identify product defects",
    successMeasure: "Validated root causes",
    keyHypothesis: "Aggregating inspection + customer text enables engineering fixes for weak joints before batch reorders.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "content",
    stakeholder: "Content Team",
    need: "Improve product listings",
    successMeasure: "Lower content-related returns",
    keyHypothesis: "Clearer 3D dimensions and accurate material callouts will eliminate dimension-mismatch returns.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "logistics",
    stakeholder: "Logistics",
    need: "Reduce reverse logistics",
    successMeasure: "Lower pickup cost/time/emissions",
    keyHypothesis: "Local repair or replacement part dispatch saves 60% of bulky 2-man freight truck rolls.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "sustainability",
    stakeholder: "Sustainability",
    need: "Reduce environmental impact",
    successMeasure: "Lower CO2e per resolved return",
    keyHypothesis: "Refurbishment and spare-part interventions reduce landfill disposal and return transport greenhouse gas.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "support",
    stakeholder: "Customer Support",
    need: "Consistent return categorisation",
    successMeasure: "Higher classification consistency",
    keyHypothesis: "Standardized taxonomy eliminates vague reasons like 'Damaged' or 'Defective' chosen arbitrarily by agents.",
    validationStatus: "Assumed - Requires Validation",
  },
  {
    id: "management",
    stakeholder: "Management",
    need: "Better decisions",
    successMeasure: "Improved cost/service/reliability balance",
    keyHypothesis: "Multi-objective decision matrix prevents overspending on instant replacements when repair is optimal.",
    validationStatus: "Assumed - Requires Validation",
  },
];

export interface RiskItem {
  id: string;
  risk: string;
  probability: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  mitigation: string;
  status: "Open" | "Mitigated" | "Monitoring";
  owner: string;
}

export const RISK_REGISTER: RiskItem[] = [
  {
    id: "RISK-01",
    risk: "Incorrect classification (false positive defect)",
    probability: "Medium",
    impact: "High",
    mitigation: "Require multi-source evidence score + mandatory human product-team validation on critical fixes.",
    status: "Mitigated",
    owner: "Lead Data Scientist",
  },
  {
    id: "RISK-02",
    risk: "Missing inspection data from return warehouse",
    probability: "High",
    impact: "High",
    mitigation: "Penalize confidence score automatically down to 'INSUFFICIENT_EVIDENCE' instead of guessing.",
    status: "Mitigated",
    owner: "Warehouse Ops Manager",
  },
  {
    id: "RISK-03",
    risk: "Biased historical data toward high-volume SKUs",
    probability: "Medium",
    impact: "High",
    mitigation: "Normalize priority score by SKU sales volume and isolate unit return rates.",
    status: "Monitoring",
    owner: "Product Analytics",
  },
  {
    id: "RISK-04",
    risk: "Incorrect emissions estimate formula",
    probability: "Medium",
    impact: "Medium",
    mitigation: "Expose configurable vehicle emission factors (DEFRA / EPA standards) in settings panel.",
    status: "Mitigated",
    owner: "Sustainability Lead",
  },
  {
    id: "RISK-05",
    risk: "False positive on packaging vs transit blame",
    probability: "Medium",
    impact: "Medium",
    mitigation: "Check outer carton puncture vs interior corner integrity before penalizing factory packaging.",
    status: "Monitoring",
    owner: "Packaging Engineer",
  },
  {
    id: "RISK-06",
    risk: "False negative (missing genuine preventable flaw)",
    probability: "Medium",
    impact: "High",
    mitigation: "Tune model to favor recall on preventable tags; route borderline 40-69% scores to Review queue.",
    status: "Monitoring",
    owner: "Quality Assurance",
  },
  {
    id: "RISK-07",
    risk: "Poor product-team adoption due to workflow friction",
    probability: "Medium",
    impact: "High",
    mitigation: "One-click validation UI with pre-filled root causes and inline evidence previews.",
    status: "Open",
    owner: "Product Operations",
  },
  {
    id: "RISK-08",
    risk: "Ambiguous customer return text with zero detail",
    probability: "High",
    impact: "Medium",
    mitigation: "Explicit 'UNKNOWN / INSUFFICIENT_EVIDENCE' fallback state with customer photo prompt.",
    status: "Mitigated",
    owner: "Customer Experience",
  },
];

export const USER_PERSONAS: UserPersona[] = [
  {
    id: "ops_analyst",
    name: "Operations Analyst",
    role: "Reverse Logistics & Triage Lead",
    description: "Focuses on individual returns, logistics costs, delivery mishandling, and anomaly detection.",
    focus_metrics: ["Avoidable Pickup Rate", "Pickup & Freight Cost", "Resolution Lead Time", "Transit Damage Rate"],
  },
  {
    id: "product_team",
    name: "Product & Engineering Team",
    role: "Quality & Packaging Engineer",
    description: "Validates root causes, audits SKU failure rates, investigates structural weaknesses, and implements manufacturing fixes.",
    focus_metrics: ["Preventable Return %", "Root Cause Validation Rate", "SKU Defect Concentration", "Packaging Puncture Rate"],
  },
  {
    id: "exec_sustainability",
    name: "Operations & Sustainability Director",
    role: "Executive Leadership",
    description: "Monitors overall enterprise cost, fleet transport emissions, supplier SLA accountability, and trade-off balance.",
    focus_metrics: ["Total Reverse Logistics Cost", "CO2e Transport Footprint", "Multi-Objective Strategy Score", "Before/After Savings"],
  },
];
