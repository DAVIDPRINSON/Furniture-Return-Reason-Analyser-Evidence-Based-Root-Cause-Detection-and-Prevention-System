import React, { useState, useMemo } from "react";
import {
  Layers,
  ShieldAlert,
  DollarSign,
  Leaf,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ReturnRecord, RootCauseId } from "../types";
import { ROOT_CAUSES } from "../data/taxonomy";

interface RootCauseExplorerProps {
  records: ReturnRecord[];
  onSelectReturn: (record: ReturnRecord) => void;
}

export const RootCauseExplorer: React.FC<RootCauseExplorerProps> = ({
  records,
  onSelectReturn,
}) => {
  const [selectedCauseId, setSelectedCauseId] = useState<RootCauseId>("weak_joint");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

  // Aggregate stats by root cause
  const rootCauseAggregates = useMemo(() => {
    const map: Record<
      string,
      {
        id: RootCauseId;
        label: string;
        department: string;
        preventability: string;
        count: number;
        cost: number;
        co2e: number;
        avgConfidence: number;
        avgResolutionDays: number;
        validatedCount: number;
        action: string;
        records: ReturnRecord[];
      }
    > = {};

    // Initialize all root causes
    Object.keys(ROOT_CAUSES).forEach((key) => {
      const rc = key as RootCauseId;
      const meta = ROOT_CAUSES[rc];
      map[rc] = {
        id: rc,
        label: meta.label,
        department: meta.department,
        preventability: meta.preventability,
        count: 0,
        cost: 0,
        co2e: 0,
        avgConfidence: 0,
        avgResolutionDays: 0,
        validatedCount: 0,
        action: meta.suggestedAction,
        records: [],
      };
    });

    // Populate with actual records
    records.forEach((r) => {
      const rc = (r.analysed_root_cause as RootCauseId) || "unknown_root_cause";
      if (map[rc]) {
        map[rc].count += 1;
        map[rc].cost += r.total_cost || 0;
        map[rc].co2e += r.estimated_co2e_kg || 0;
        map[rc].avgConfidence += r.confidence_score || 0;
        map[rc].avgResolutionDays += (r.resolution_time_hours || 48) / 24;
        if (r.validation_status === "VALIDATED") {
          map[rc].validatedCount += 1;
        }
        map[rc].records.push(r);
      }
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        avgConfidence: item.count > 0 ? Math.round(item.avgConfidence / item.count) : 0,
        avgResolutionDays: item.count > 0 ? Number((item.avgResolutionDays / item.count).toFixed(1)) : 0,
        validationRate: item.count > 0 ? Math.round((item.validatedCount / item.count) * 100) : 0,
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [records]);

  const filteredCauses = useMemo(() => {
    if (departmentFilter === "ALL") return rootCauseAggregates;
    return rootCauseAggregates.filter((c) => c.department === departmentFilter);
  }, [rootCauseAggregates, departmentFilter]);

  const activeCause = useMemo(() => {
    return (
      rootCauseAggregates.find((c) => c.id === selectedCauseId) || rootCauseAggregates[0]
    );
  }, [rootCauseAggregates, selectedCauseId]);

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
            EVIDENCE_TAXONOMY // ROOT_CAUSE_CORRELATION
          </span>
          <h2 className="text-xs font-bold text-[#e0e0e0]">Priority Root Causes & Forensic Evidence Profiles</h2>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[#666666] uppercase">DEPT_FILTER:</span>
          <select
            aria-label="Filter by department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-[#1f1f1f] bg-[#050505] text-[#e0e0e0] rounded-[2px] px-2 py-1 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">ALL_DEPARTMENTS</option>
            <option value="PRODUCT">PRODUCT_ENGINEERING</option>
            <option value="PACKAGING">PACKAGING_DESIGN</option>
            <option value="CONTENT">LISTING_CONTENT</option>
            <option value="INSTRUCTIONS">INSTRUCTIONS_MANUALS</option>
            <option value="LOGISTICS">LOGISTICS_CARRIERS</option>
            <option value="CUSTOMER">CUSTOMER_PREFERENCE</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Ranked Table */}
        <div className="lg:col-span-6 bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono border-collapse">
              <thead>
                <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                  <th className="py-2 px-3">RANK</th>
                  <th className="py-2 px-3">ROOT_CAUSE</th>
                  <th className="py-2 px-3">DEPT</th>
                  <th className="py-2 px-3 text-right">UNITS</th>
                  <th className="py-2 px-3 text-right">COST(₹)</th>
                  <th className="py-2 px-3 text-right">CONF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616] text-[#cccccc]">
                {filteredCauses.map((cause, idx) => {
                  const isSelected = cause.id === activeCause?.id;
                  return (
                    <tr
                      key={cause.id}
                      onClick={() => setSelectedCauseId(cause.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold" : "hover:bg-[#141414]"
                      }`}
                    >
                      <td className="py-2 px-3 text-[#00f0ff]">#{idx + 1}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-[#ffffff]">{cause.label}</div>
                        <div className="text-[9px] text-[#666666]">{cause.id}</div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.2 rounded-[2px] bg-[#1a1a1a] text-[#aaaaaa] text-[9px] border border-[#2a2a2a]">
                          {cause.department}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#e0e0e0]">{cause.count}</td>
                      <td className="py-2 px-3 text-right text-[#ffb700]">
                        ₹{(cause.cost / 1000).toFixed(0)}k
                      </td>
                      <td className="py-2 px-3 text-right text-[#00ff66]">{cause.avgConfidence}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Deep Forensic Evidence Engine Profile */}
        <div className="lg:col-span-6 space-y-3">
          {activeCause ? (
            <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] p-3.5 space-y-3">
              {/* Header */}
              <div className="border-b border-[#1f1f1f] pb-2.5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#ffffff] text-sm">{activeCause.label}</h3>
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold border ${
                        activeCause.preventability === "PREVENTABLE"
                          ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                          : "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                      }`}
                    >
                      {activeCause.preventability}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#666666] mt-0.5">
                    RESPONSIBILITY_OWNER: <span className="text-[#00f0ff] font-bold">{activeCause.department}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#00f0ff]">{activeCause.count}</span>
                  <span className="text-[9px] text-[#666666] block">DISPATCHES</span>
                </div>
              </div>

              {/* 6 Evidence Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f]">
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">TOTAL_COST</span>
                  <span className="font-bold text-[#e0e0e0] text-xs">
                    ₹{(activeCause.cost / 1000).toFixed(1)}k
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">GHG_BURDEN</span>
                  <span className="font-bold text-[#00f0ff] text-xs">
                    {activeCause.co2e.toFixed(1)} kg
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">AVG_SLA</span>
                  <span className="font-bold text-[#e0e0e0] text-xs">
                    {activeCause.avgResolutionDays}d
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">CONFIDENCE</span>
                  <span className="font-bold text-[#00ff66] text-xs">
                    {activeCause.avgConfidence}%
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">VALIDATION</span>
                  <span className="font-bold text-[#ffb700] text-xs">
                    {activeCause.validationRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[#666666] block uppercase text-[9px]">UNIT_COST</span>
                  <span className="font-bold text-[#e0e0e0] text-xs">
                    ₹{activeCause.count > 0 ? Math.round(activeCause.cost / activeCause.count).toLocaleString() : 0}
                  </span>
                </div>
              </div>

              {/* Recommended Engineering Action */}
              <div className="p-2.5 bg-[#00f0ff]/5 border border-[#00f0ff]/30 rounded-[2px] text-[10px]">
                <span className="text-[#00f0ff] uppercase tracking-wider block font-bold text-[9px] mb-0.5">
                  RECOMMENDED_PREVENTATIVE_FIX:
                </span>
                <p className="text-[#cccccc]">{activeCause.action}</p>
              </div>

              {/* Representative Anonymized Returns */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#666666] uppercase tracking-wider">
                  SAMPLE_INCIDENT_RECORDS ({activeCause.records.length})
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {activeCause.records.slice(0, 4).map((r) => (
                    <div
                      key={r.return_id}
                      onClick={() => onSelectReturn(r)}
                      className="p-2 rounded-[2px] border border-[#1f1f1f] hover:border-[#00f0ff]/60 bg-[#080808] hover:bg-[#141414] transition-all cursor-pointer text-[10px]"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[#00f0ff] font-bold">{r.return_id}</span>
                        <span className="text-[#666666]">{r.sku}</span>
                      </div>
                      <p className="text-[#bbbbbb] truncate">"{r.return_text}"</p>
                      <div className="mt-0.5 text-[9px] text-[#666666]">
                        INSPECTION: <span className="text-[#e0e0e0]">{r.inspection_finding}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d0d0d] p-6 rounded-[2px] border border-[#1f1f1f] text-center text-[#666666] text-xs">
              SELECT_ROOT_CAUSE_FROM_TABLE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
