import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";
import {
  TrendingDown,
  Clock,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
} from "lucide-react";
import { ReturnRecord } from "../types";
import { RETURN_CATEGORIES, ROOT_CAUSES } from "../data/taxonomy";

interface DashboardProps {
  records: ReturnRecord[];
  onSelectReturn: (record: ReturnRecord) => void;
  onNavigateTab?: (tabId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  onSelectReturn,
  onNavigateTab,
  onNavigateToTab,
}) => {
  const navigate = onNavigateTab || onNavigateToTab || (() => {});

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedPreventability, setSelectedPreventability] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedSku, setSelectedSku] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Categories & SKUs list
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.product_category));
    return Array.from(set).sort();
  }, [records]);

  const skuOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.sku));
    return Array.from(set).sort();
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedCategory !== "ALL" && r.product_category !== selectedCategory) return false;
      if (selectedPreventability !== "ALL" && r.analysed_preventability !== selectedPreventability) return false;
      if (selectedPriority !== "ALL" && r.priority_level !== selectedPriority) return false;
      if (selectedSku !== "ALL" && r.sku !== selectedSku) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = (r.return_text || "").toLowerCase().includes(q);
        const matchSku = (r.sku || "").toLowerCase().includes(q);
        const matchName = (r.product_name || "").toLowerCase().includes(q);
        const matchId = (r.return_id || "").toLowerCase().includes(q);
        const matchReason = (r.original_return_reason || "").toLowerCase().includes(q);
        if (!matchText && !matchSku && !matchName && !matchId && !matchReason) return false;
      }
      return true;
    });
  }, [records, selectedCategory, selectedPreventability, selectedPriority, selectedSku, searchQuery]);

  // Metrics computation
  const totalCount = filteredRecords.length;
  const preventableCount = filteredRecords.filter((r) => r.analysed_preventability === "PREVENTABLE").length;
  const preventablePct = totalCount > 0 ? Math.round((preventableCount / totalCount) * 100) : 0;
  const highRiskCount = filteredRecords.filter((r) => r.priority_level === "CRITICAL" || r.priority_level === "HIGH").length;

  const totalCost = filteredRecords.reduce((acc, r) => acc + (r.total_cost || 0), 0);
  const totalCo2e = filteredRecords.reduce((acc, r) => acc + (r.estimated_co2e_kg || 0), 0);

  const avgResolutionTime =
    totalCount > 0
      ? (filteredRecords.reduce((acc, r) => acc + (r.resolution_time_hours || 48), 0) / totalCount / 24).toFixed(1)
      : "0";

  const avgConfidence =
    totalCount > 0
      ? Math.round(filteredRecords.reduce((acc, r) => acc + (r.confidence_score || 0), 0) / totalCount)
      : 0;

  const validatedCount = filteredRecords.filter((r) => r.validation_status === "VALIDATED").length;
  const validationPct = totalCount > 0 ? Math.round((validatedCount / totalCount) * 100) : 0;

  // Chart Data 1: Return Categories
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      const cat = r.analysed_category || "UNKNOWN";
      const label = RETURN_CATEGORIES[cat]?.label || cat;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredRecords]);

  // Chart Data 2: Preventability Breakdown
  const preventabilityChartData = useMemo(() => {
    const counts: Record<string, number> = {
      PREVENTABLE: 0,
      PARTIALLY_PREVENTABLE: 0,
      NOT_PREVENTABLE: 0,
      INSUFFICIENT_EVIDENCE: 0,
    };
    filteredRecords.forEach((r) => {
      const p = r.analysed_preventability || "INSUFFICIENT_EVIDENCE";
      counts[p] = (counts[p] || 0) + 1;
    });
    return [
      { name: "PREVENTABLE", value: counts.PREVENTABLE, color: "#00ff66" },
      { name: "PARTIALLY", value: counts.PARTIALLY_PREVENTABLE, color: "#ffb700" },
      { name: "NOT_PREVENTABLE", value: counts.NOT_PREVENTABLE, color: "#666666" },
      { name: "INSUFFICIENT_EVD", value: counts.INSUFFICIENT_EVIDENCE, color: "#00f0ff" },
    ].filter((item) => item.value > 0);
  }, [filteredRecords]);

  // Chart Data 3: Root Causes by Frequency & Cost
  const rootCausesChartData = useMemo(() => {
    const data: Record<string, { count: number; cost: number; co2e: number }> = {};
    filteredRecords.forEach((r) => {
      const rc = r.analysed_root_cause || "unknown_root_cause";
      const label = ROOT_CAUSES[rc]?.label || rc;
      if (!data[label]) data[label] = { count: 0, cost: 0, co2e: 0 };
      data[label].count += 1;
      data[label].cost += Math.round(r.total_cost || 0);
      data[label].co2e += Math.round(r.estimated_co2e_kg || 0);
    });
    return Object.entries(data)
      .map(([name, d]) => ({
        name: name.length > 18 ? name.substring(0, 16) + ".." : name,
        fullName: name,
        returns: d.count,
        cost: Math.round(d.cost / 1000), // in k INR
        co2e: d.co2e,
      }))
      .sort((a, b) => b.returns - a.returns)
      .slice(0, 8);
  }, [filteredRecords]);

  // Chart Data 4: Cost vs Emissions Scatter Plot
  const scatterData = useMemo(() => {
    return filteredRecords.slice(0, 80).map((r) => ({
      id: r.return_id,
      cost: r.total_cost || 0,
      co2e: r.estimated_co2e_kg || 0,
      confidence: r.confidence_score || 50,
      rootCause: ROOT_CAUSES[r.analysed_root_cause || "unknown_root_cause"]?.label || r.analysed_root_cause,
      preventability: r.analysed_preventability,
    }));
  }, [filteredRecords]);

  // Top High-Priority Root Causes
  const topPriorityCauses = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        label: string;
        count: number;
        cost: number;
        co2e: number;
        preventability: string;
        avgConfidence: number;
        suggestedAction: string;
      }
    > = {};

    filteredRecords.forEach((r) => {
      const rc = r.analysed_root_cause || "unknown_root_cause";
      if (!map[rc]) {
        const meta = ROOT_CAUSES[rc];
        map[rc] = {
          id: rc,
          label: meta?.label || rc,
          count: 0,
          cost: 0,
          co2e: 0,
          preventability: r.analysed_preventability || meta?.preventability || "UNKNOWN",
          avgConfidence: 0,
          suggestedAction: meta?.suggestedAction || "Review return policy and inspection evidence.",
        };
      }
      map[rc].count += 1;
      map[rc].cost += r.total_cost || 0;
      map[rc].co2e += r.estimated_co2e_kg || 0;
      map[rc].avgConfidence += r.confidence_score || 50;
    });

    return Object.values(map)
      .map((c) => ({
        ...c,
        avgConfidence: c.count > 0 ? Math.round(c.avgConfidence / c.count) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredRecords]);

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* High Density Status Header */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-[#00f0ff] uppercase">
              // TELEMETRY_SUMMARY // FORENSIC_DASHBOARD
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 rounded-[2px]">
              ENGINE ACTIVE
            </span>
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5">
            SAMPLE_SIZE: {totalCount} UNITS &bull; ROOT_CAUSE_TRIAGE &bull; CO2e MODEL: DEFRA_2026
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <button
            onClick={() => navigate("explorer")}
            className="px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] text-[#00f0ff] border border-[#1f1f1f] hover:border-[#00f0ff]/50 rounded-[2px] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>[OPEN_RETURNS_EXPLORER]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 8 High Density KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Total Returns */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#666666] uppercase flex justify-between">
            <span>TOTAL_RETURNS</span>
            <span>(100%)</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e0e0] mt-0.5">{totalCount}</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#00f0ff]" style={{ width: "100%" }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Bulky freight dispatches</div>
        </div>

        {/* Preventable Returns */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#00ff66] uppercase flex justify-between font-semibold">
            <span>PREVENTABLE_RATE</span>
            <span>+{preventablePct}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00ff66] mt-0.5">
            {preventablePct}% <span className="text-[10px] text-[#666666]">({preventableCount}u)</span>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#00ff66]" style={{ width: `${preventablePct}%` }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Avoidable engineering flaws</div>
        </div>

        {/* High-Risk Returns */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#ff0055] uppercase flex justify-between font-semibold">
            <span>CRITICAL_ALERT</span>
            <span>SEV-1</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#ff0055] mt-0.5">{highRiskCount}</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#ff0055]" style={{ width: `${Math.min(100, (highRiskCount / (totalCount || 1)) * 100)}%` }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Severe structural/drops</div>
        </div>

        {/* Average Resolution Time */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#666666] uppercase flex justify-between">
            <span>RESOLUTION_SLA</span>
            <span>AVG</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e0e0] mt-0.5">{avgResolutionTime}d</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#00f0ff]" style={{ width: "65%" }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Pickup + teardown cycle</div>
        </div>

        {/* Total Return Cost */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#666666] uppercase flex justify-between">
            <span>FINANCIAL_IMPACT</span>
            <span>INR</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#e0e0e0] mt-0.5">₹{(totalCost / 100000).toFixed(1)}L</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#ffb700]" style={{ width: "72%" }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Freight, scrap & replacement</div>
        </div>

        {/* Estimated CO2e */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#00f0ff] uppercase flex justify-between font-semibold">
            <span>CARBON_BURDEN</span>
            <span>CO2e</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00f0ff] mt-0.5">{(totalCo2e / 1000).toFixed(1)} T</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#00f0ff]" style={{ width: "48%" }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Heavy vehicle tailpipe GHG</div>
        </div>

        {/* Classification Reliability */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#666666] uppercase flex justify-between">
            <span>CONFIDENCE_IDX</span>
            <span>MODEL</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00ff66] mt-0.5">{avgConfidence}%</div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#00ff66]" style={{ width: `${avgConfidence}%` }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Multi-signal corroboration</div>
        </div>

        {/* Product-Team Validation Rate */}
        <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] relative">
          <div className="text-[10px] text-[#ffb700] uppercase flex justify-between font-semibold">
            <span>AUDIT_SIGNOFF</span>
            <span>QA</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#ffb700] mt-0.5">
            {validationPct}% <span className="text-[10px] text-[#666666]">({validatedCount})</span>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-[1px] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#ffb700]" style={{ width: `${validationPct}%` }}></div>
          </div>
          <div className="text-[9px] text-[#555555] mt-1">Human engineer agreement</div>
        </div>
      </div>

      {/* High Density Filter Toolbar */}
      <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[10px] text-[#888888] font-mono uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>DATA_FILTERS:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 flex-1 max-w-4xl">
            {/* Category Filter */}
            <select
              aria-label="Filter by Furniture Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-[10px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">ALL_CATEGORIES ({categoryOptions.length})</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Preventability Filter */}
            <select
              aria-label="Filter by Preventability"
              value={selectedPreventability}
              onChange={(e) => setSelectedPreventability(e.target.value)}
              className="text-[10px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">ALL_PREVENTABILITY</option>
              <option value="PREVENTABLE">PREVENTABLE</option>
              <option value="PARTIALLY_PREVENTABLE">PARTIALLY_PREVENTABLE</option>
              <option value="NOT_PREVENTABLE">NOT_PREVENTABLE</option>
              <option value="INSUFFICIENT_EVIDENCE">INSUFFICIENT_EVIDENCE</option>
            </select>

            {/* Priority Filter */}
            <select
              aria-label="Filter by Priority Level"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-[10px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">ALL_PRIORITIES</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>

            {/* SKU Filter */}
            <select
              aria-label="Filter by Product SKU"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="text-[10px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="ALL">ALL_SKUS ({skuOptions.length})</option>
              {skuOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Quick Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH // SKU / TEXT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-[10px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] pl-6 pr-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
              />
              <Search className="w-3 h-3 text-[#555555] absolute left-1.5 top-1.5" />
            </div>
          </div>

          {(selectedCategory !== "ALL" ||
            selectedPreventability !== "ALL" ||
            selectedPriority !== "ALL" ||
            selectedSku !== "ALL" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedPreventability("ALL");
                setSelectedPriority("ALL");
                setSelectedSku("ALL");
                setSearchQuery("");
              }}
              className="text-[10px] text-[#00f0ff] hover:underline font-mono cursor-pointer"
            >
              [RESET_FILTERS]
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Charts (Categorization & Preventability) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Return Reasons Classification */}
        <div className="lg:col-span-8 bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                CLASSIFICATION_DISTRIBUTION // REASONS
              </span>
              <span className="text-xs font-bold text-[#e0e0e0]">Canonical Return Reason Taxonomy</span>
            </div>
            <span className="text-[10px] font-mono text-[#00f0ff]">N={totalCount}</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData.slice(0, 7)} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "2px", color: "#e0e0e0", fontSize: "10px", fontFamily: "monospace" }}
                />
                <Bar dataKey="value" fill="#00f0ff" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preventability Pie Chart */}
        <div className="lg:col-span-4 bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                PREVENTABILITY_SPLIT
              </span>
              <span className="text-xs font-bold text-[#e0e0e0]">Engineering Triage Ratio</span>
            </div>
          </div>
          <div className="h-56 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={preventabilityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {preventabilityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "2px", color: "#e0e0e0", fontSize: "10px", fontFamily: "monospace" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 text-[9px] font-mono text-[#888888]">
              {preventabilityChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-[1px]" style={{ backgroundColor: item.color }} />
                  <span>
                    {item.name}: <strong className="text-[#e0e0e0]">{item.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Root Causes Frequency vs Cost Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7 bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                VOLUME_VS_COST_BURDEN
              </span>
              <span className="text-xs font-bold text-[#e0e0e0]">Top Root Causes (₹ in Thousands)</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rootCausesChartData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} angle={-20} textAnchor="end" />
                <YAxis yAxisId="left" tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "2px", color: "#e0e0e0", fontSize: "10px", fontFamily: "monospace" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "4px" }} />
                <Bar yAxisId="left" dataKey="returns" fill="#00ff66" name="Returns Count" radius={[1, 1, 0, 0]} />
                <Bar yAxisId="right" dataKey="cost" fill="#ffb700" name="Total Cost (₹k)" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost vs Emissions Trade-off Scatter Plot */}
        <div className="lg:col-span-5 bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                CORRELATION // COST_VS_CO2e
              </span>
              <span className="text-xs font-bold text-[#e0e0e0]">Reverse Freight Cost vs kg CO2e</span>
            </div>
            <button
              onClick={() => navigate("trade_offs")}
              className="text-[10px] text-[#00f0ff] hover:underline font-mono flex items-center gap-1 cursor-pointer"
            >
              [MATRIX] <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1a1a1a" />
                <XAxis
                  type="number"
                  dataKey="cost"
                  name="Cost"
                  unit="₹"
                  tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }}
                />
                <YAxis
                  type="number"
                  dataKey="co2e"
                  name="CO2e"
                  unit="kg"
                  tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "2 2", stroke: "#00f0ff" }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#050505] border border-[#00f0ff] text-[#e0e0e0] p-2 text-[10px] font-mono space-y-0.5 rounded-[2px]">
                          <p className="font-bold text-[#00f0ff]">{data.id}</p>
                          <p>CAUSE: {data.rootCause}</p>
                          <p>COST: ₹{data.cost.toLocaleString()}</p>
                          <p>GHG: {data.co2e} kg CO2e</p>
                          <p>CONF: {data.confidence}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Returns" data={scatterData} fill="#ff0055" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Root Causes Table */}
      <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
        <div className="p-3 border-b border-[#1f1f1f] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
              RANKED_PRIORITY_BACKLOG
            </span>
            <h3 className="text-xs font-bold text-[#e0e0e0]">High-Priority Root Causes (Action Trigger Queue)</h3>
          </div>
          <button
            onClick={() => navigate("root_causes")}
            className="text-[10px] font-mono text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            [EXPLORE_ALL_ROOT_CAUSES] <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                <th className="py-2 px-3">RANK</th>
                <th className="py-2 px-3">ROOT_CAUSE</th>
                <th className="py-2 px-3">RETURNS</th>
                <th className="py-2 px-3">PREVENTABILITY</th>
                <th className="py-2 px-3">TOTAL_COST</th>
                <th className="py-2 px-3">EMISSIONS</th>
                <th className="py-2 px-3">CONFIDENCE</th>
                <th className="py-2 px-3">RECOMMENDED_ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] text-[#cccccc]">
              {topPriorityCauses.map((cause, idx) => (
                <tr key={cause.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-2 px-3 font-bold text-[#00f0ff]">#{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-[#ffffff]">{cause.label}</td>
                  <td className="py-2 px-3 text-[#aaaaaa]">{cause.count} units</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-mono border ${
                        cause.preventability === "PREVENTABLE"
                          ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                          : "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                      }`}
                    >
                      {cause.preventability}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#e0e0e0]">₹{cause.cost.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[#00f0ff]">{cause.co2e.toFixed(1)} kg</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 bg-[#1f1f1f] rounded-[1px] h-1 overflow-hidden">
                        <div className="bg-[#00ff66] h-1" style={{ width: `${cause.avgConfidence}%` }} />
                      </div>
                      <span className="text-[10px] text-[#aaaaaa]">{cause.avgConfidence}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[#888888] max-w-xs truncate" title={cause.suggestedAction}>
                    {cause.suggestedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
