import { ReturnRecord } from "../types";

export interface QualityIssue {
  type: "CRITICAL" | "WARNING" | "INFO";
  field: string;
  issue: string;
  affectedCount: number;
  percentage: number;
  recommendation: string;
}

export interface DataQualityReport {
  overallScore: number; // 0 - 100
  totalRecords: number;
  cleanRecordsCount: number;
  issues: QualityIssue[];
  missingInspectionPct: number;
  duplicateIdsPct: number;
  invalidDimensionsPct: number;
  missingTextPct: number;
  negativeOrZeroPricePct: number;
}

export function evaluateDataQuality(records: ReturnRecord[]): DataQualityReport {
  if (!records || records.length === 0) {
    return {
      overallScore: 0,
      totalRecords: 0,
      cleanRecordsCount: 0,
      issues: [],
      missingInspectionPct: 0,
      duplicateIdsPct: 0,
      invalidDimensionsPct: 0,
      missingTextPct: 0,
      negativeOrZeroPricePct: 0,
    };
  }

  const total = records.length;
  const issues: QualityIssue[] = [];

  // Check 1: Duplicate Return IDs
  const idSet = new Set<string>();
  let duplicateCount = 0;
  for (const r of records) {
    if (idSet.has(r.return_id)) duplicateCount++;
    else idSet.add(r.return_id);
  }
  const duplicatePct = Number(((duplicateCount / total) * 100).toFixed(1));
  if (duplicateCount > 0) {
    issues.push({
      type: "CRITICAL",
      field: "return_id",
      issue: `${duplicateCount} duplicate return ID(s) detected`,
      affectedCount: duplicateCount,
      percentage: duplicatePct,
      recommendation: "Enforce primary key uniqueness constraint in ingestion ETL pipeline.",
    });
  }

  // Check 2: Missing Return Text
  let missingTextCount = 0;
  for (const r of records) {
    if (!r.return_text || r.return_text.trim().length === 0) missingTextCount++;
  }
  const missingTextPct = Number(((missingTextCount / total) * 100).toFixed(1));
  if (missingTextCount > 0) {
    issues.push({
      type: "WARNING",
      field: "return_text",
      issue: `${missingTextCount} record(s) with blank customer return reason text`,
      affectedCount: missingTextCount,
      percentage: missingTextPct,
      recommendation: "Mandate customer feedback capture during return initiation portal flow.",
    });
  }

  // Check 3: Missing or Pending Inspection Findings
  let missingInspectionCount = 0;
  for (const r of records) {
    if (
      !r.inspection_finding ||
      r.inspection_finding.trim().length === 0 ||
      r.inspection_finding.toLowerCase().includes("pending")
    ) {
      missingInspectionCount++;
    }
  }
  const missingInspectionPct = Number(((missingInspectionCount / total) * 100).toFixed(1));
  if (missingInspectionCount > 0) {
    issues.push({
      type: "WARNING",
      field: "inspection_finding",
      issue: `${missingInspectionCount} return(s) lack definitive warehouse physical inspection report`,
      affectedCount: missingInspectionCount,
      percentage: missingInspectionPct,
      recommendation: "Enforce 24-hr QA turnaround SLA at regional return consolidation hubs.",
    });
  }

  // Check 4: Negative or Zero Prices
  let invalidPriceCount = 0;
  for (const r of records) {
    if (r.product_price === undefined || r.product_price <= 0) invalidPriceCount++;
  }
  const invalidPricePct = Number(((invalidPriceCount / total) * 100).toFixed(1));
  if (invalidPriceCount > 0) {
    issues.push({
      type: "CRITICAL",
      field: "product_price",
      issue: `${invalidPriceCount} item(s) have negative or zero product price values`,
      affectedCount: invalidPriceCount,
      percentage: invalidPricePct,
      recommendation: "Reject negative price entries; backfill missing prices from ERP master data.",
    });
  }

  // Check 5: Invalid Dimensions Format
  let invalidDimCount = 0;
  for (const r of records) {
    if (!r.product_dimensions || !r.product_dimensions.match(/\d+\s*x\s*\d+/i)) invalidDimCount++;
  }
  const invalidDimPct = Number(((invalidDimCount / total) * 100).toFixed(1));
  if (invalidDimCount > 0) {
    issues.push({
      type: "INFO",
      field: "product_dimensions",
      issue: `${invalidDimCount} record(s) with non-standard dimensional string formatting`,
      affectedCount: invalidDimCount,
      percentage: invalidDimPct,
      recommendation: "Standardize product dimensions format to (L x W x H cm) in catalog schema.",
    });
  }

  // Compute overall Data Quality score (0 - 100)
  let deductions = 0;
  deductions += duplicatePct * 2.0; // severe penalty
  deductions += invalidPricePct * 1.5;
  deductions += missingTextPct * 0.8;
  deductions += missingInspectionPct * 0.4;
  deductions += invalidDimPct * 0.2;

  const overallScore = Math.max(10, Math.min(100, Math.round(100 - deductions)));
  const cleanRecordsCount = Math.max(
    0,
    total - (duplicateCount + missingTextCount + invalidPriceCount)
  );

  return {
    overallScore,
    totalRecords: total,
    cleanRecordsCount,
    issues,
    missingInspectionPct,
    duplicateIdsPct: duplicatePct,
    invalidDimensionsPct: invalidDimPct,
    missingTextPct,
    negativeOrZeroPricePct: invalidPricePct,
  };
}
