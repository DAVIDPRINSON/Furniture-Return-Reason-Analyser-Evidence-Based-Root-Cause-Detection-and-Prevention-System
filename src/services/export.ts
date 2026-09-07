import { ReturnRecord } from "../types";

export function exportToCSV(records: ReturnRecord[], filename: string = "furniture_returns_analysed.csv") {
  if (!records || records.length === 0) return;

  const headers = [
    "return_id",
    "return_date",
    "sku",
    "product_name",
    "product_category",
    "product_price",
    "original_return_reason",
    "return_text",
    "inspection_finding",
    "analysed_category",
    "analysed_root_cause",
    "analysed_preventability",
    "confidence_score",
    "priority_level",
    "priority_score",
    "total_cost",
    "estimated_co2e_kg",
    "validation_status",
    "recommended_action",
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) => [
    escapeCSV(r.return_id),
    escapeCSV(r.return_date),
    escapeCSV(r.sku),
    escapeCSV(r.product_name),
    escapeCSV(r.product_category),
    escapeCSV(r.product_price),
    escapeCSV(r.original_return_reason),
    escapeCSV(r.return_text),
    escapeCSV(r.inspection_finding),
    escapeCSV(r.analysed_category),
    escapeCSV(r.analysed_root_cause),
    escapeCSV(r.analysed_preventability),
    escapeCSV(r.confidence_score),
    escapeCSV(r.priority_level),
    escapeCSV(r.priority_score),
    escapeCSV(r.total_cost),
    escapeCSV(r.estimated_co2e_kg),
    escapeCSV(r.validation_status),
    escapeCSV(r.recommended_action),
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(records: ReturnRecord[], filename: string = "furniture_returns_analysed.json") {
  const jsonContent = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateSummaryReportText(records: ReturnRecord[]): string {
  const total = records.length;
  const preventableCount = records.filter((r) => r.analysed_preventability === "PREVENTABLE").length;
  const preventablePct = ((preventableCount / total) * 100).toFixed(1);

  const totalCost = records.reduce((acc, r) => acc + (r.total_cost || 0), 0);
  const totalCO2e = records.reduce((acc, r) => acc + (r.estimated_co2e_kg || 0), 0).toFixed(1);
  const avgConfidence = Math.round(records.reduce((acc, r) => acc + (r.confidence_score || 0), 0) / (total || 1));

  // Count root causes
  const causeCounts: Record<string, { count: number; cost: number; co2e: number }> = {};
  for (const r of records) {
    const rc = r.analysed_root_cause || "unknown";
    if (!causeCounts[rc]) causeCounts[rc] = { count: 0, cost: 0, co2e: 0 };
    causeCounts[rc].count++;
    causeCounts[rc].cost += r.total_cost || 0;
    causeCounts[rc].co2e += r.estimated_co2e_kg || 0;
  }

  const sortedCauses = Object.entries(causeCounts).sort((a, b) => b[1].count - a[1].count);

  return `===================================================================
FURNITURE RETURN REASON ANALYSER — EXECUTIVE SUMMARY REPORT
Generated at: ${new Date().toLocaleString()}
Dataset Scope: ${total} Total Bulky Furniture Return Records
===================================================================

KEY METRICS & PREVENTABILITY:
- Total Analyzed Returns: ${total}
- Preventable Returns: ${preventableCount} (${preventablePct}%)
- Total Reverse Logistics & Replacement Cost: ₹${totalCost.toLocaleString()}
- Total Transport Footprint: ${totalCO2e} kg CO2e
- Model Classification Confidence: ${avgConfidence}%

TOP ROOT CAUSES IDENTIFIED:
${sortedCauses
  .slice(0, 5)
  .map(
    ([cause, data], idx) =>
      `  ${idx + 1}. ${cause.toUpperCase().replace(/_/g, " ")}: ${data.count} returns (${((data.count / total) * 100).toFixed(1)}%) | Cost: ₹${data.cost.toLocaleString()} | CO2e: ${data.co2e.toFixed(1)} kg`
  )
  .join("\n")}

STAKEHOLDER NOTICE:
Illustrative demo results generated from synthetic furniture return patterns.
Prior to committing engineering tooling investments, validate top defects with
physical warehouse inspection batches.
===================================================================`;
}

export function downloadSummaryReport(records: ReturnRecord[]) {
  const text = generateSummaryReportText(records);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "furniture_return_root_cause_report.txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
