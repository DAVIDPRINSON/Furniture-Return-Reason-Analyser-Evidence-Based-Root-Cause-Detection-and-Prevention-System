import React, { useMemo } from "react";
import {
  FileCheck,
} from "lucide-react";
import { ReturnRecord } from "../types";
import { evaluateDataQuality } from "../services/dataQuality";

interface DataQualityViewProps {
  records: ReturnRecord[];
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({ records }) => {
  const qualityReport = useMemo(() => {
    return evaluateDataQuality(records);
  }, [records]);

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#00f0ff]" />
            <h2 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              DATA_INTEGRITY // INGESTION_HYGIENE_AUDITOR
            </h2>
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5">
            Automated schema enforcement checking for null fields, negative costs, malformed dimensions, and duplicate keys.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] px-2.5 py-1 rounded-[2px] border border-[#1f1f1f] text-[10px]">
          <span className="text-[#666666]">AUDITED_RECORDS:</span>
          <span className="font-bold text-[#00f0ff]">{qualityReport.totalRecords}</span>
        </div>
      </div>

      {/* Main Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Overall Quality Score Meter */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex items-center gap-3">
          <div className="w-12 h-12 rounded-[2px] border border-[#00ff66] flex items-center justify-center font-bold text-base text-[#00ff66] bg-[#00ff66]/10">
            {qualityReport.overallScore}%
          </div>
          <div>
            <span className="text-[9px] text-[#666666] uppercase font-bold block">DATA_HYGIENE_INDEX</span>
            <span className="text-[11px] font-bold text-[#e0e0e0]">
              {qualityReport.overallScore >= 90 ? "PRODUCTION_READY" : "REQUIRES_CLEANSING"}
            </span>
            <p className="text-[9px] text-[#444444] mt-0.5">Weighted integrity index</p>
          </div>
        </div>

        {/* Missing Inspection Findings */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#ffb700] font-bold block uppercase">MISSING_INSPECTIONS</span>
          <span className="text-xl font-bold text-[#ffb700]">{qualityReport.missingInspectionPct}%</span>
          <p className="text-[9px] text-[#444444] mt-0.5">Pending warehouse audit</p>
        </div>

        {/* Duplicate Return IDs */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#666666] font-bold block uppercase">KEY_COLLISIONS</span>
          <span className="text-xl font-bold text-[#e0e0e0]">{qualityReport.duplicateIdsPct}%</span>
          <p className="text-[9px] text-[#444444] mt-0.5">Primary key check</p>
        </div>

        {/* Invalid Dimensions String */}
        <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <span className="text-[9px] text-[#00f0ff] font-bold block uppercase">MALFORMED_DIMENSIONS</span>
          <span className="text-xl font-bold text-[#00f0ff]">{qualityReport.invalidDimensionsPct}%</span>
          <p className="text-[9px] text-[#444444] mt-0.5">Non-standard (LxWxH)</p>
        </div>
      </div>

      {/* Detected Quality Anomalies & Recommendations Table */}
      <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
        <div className="p-2.5 border-b border-[#1f1f1f]">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
            SCHEMA_ANOMALIES // RECOMMENDED_ETL_FIXES
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                <th className="py-2 px-3">SEVERITY</th>
                <th className="py-2 px-3">COLUMN</th>
                <th className="py-2 px-3">DETECTED_ANOMALY</th>
                <th className="py-2 px-3">IMPACT</th>
                <th className="py-2 px-3">RECOMMENDED_ETL_FIX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] text-[#cccccc]">
              {qualityReport.issues.map((issue, idx) => (
                <tr key={idx} className="hover:bg-[#141414] transition-colors">
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] text-[8px] font-bold border ${
                        issue.type === "CRITICAL"
                          ? "bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/40"
                          : issue.type === "WARNING"
                          ? "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                          : "bg-[#141414] text-[#aaaaaa] border-[#2a2a2a]"
                      }`}
                    >
                      {issue.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-bold text-[#00f0ff]">{issue.field}</td>
                  <td className="py-2 px-3 text-[#ffffff] font-medium">{issue.issue}</td>
                  <td className="py-2 px-3 text-[#ffb700]">{issue.percentage}%</td>
                  <td className="py-2 px-3 text-[#888888]">{issue.recommendation}</td>
                </tr>
              ))}
              {qualityReport.issues.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[#00ff66] font-semibold">
                    100% CLEAN DATASET // ZERO SCHEMA DRIFT DETECTED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
