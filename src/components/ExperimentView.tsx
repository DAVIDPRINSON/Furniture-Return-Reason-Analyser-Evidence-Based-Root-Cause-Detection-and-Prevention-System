import React from "react";
import {
  Activity,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const ExperimentView: React.FC = () => {
  const comparisonData = [
    { metric: "REASON_CONSISTENCY", baseline: 55, target: 85, measured: 88 },
    { metric: "ROOT_CAUSE_PRECISION", baseline: 50, target: 80, measured: 82 },
    { metric: "EVIDENCE_COMPLETENESS", baseline: 30, target: 90, measured: 91 },
    { metric: "QA_ENGINEER_AGREEMENT", baseline: 60, target: 85, measured: 86 },
    { metric: "PREVENTABLE_DETECTION", baseline: 45, target: 75, measured: 78 },
    { metric: "COST_TRANSPARENCY", baseline: 25, target: 90, measured: 92 },
    { metric: "GHG_EMISSION_TRACKING", baseline: 0, target: 85, measured: 89 },
  ];

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Disclaimer Banner */}
      <div className="bg-[#ffb700]/10 border-l-2 border-[#ffb700] p-2.5 rounded-[2px] flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#ffb700] shrink-0" />
        <p className="text-[10px] text-[#ffb700]">
          NOTICE: Illustrative benchmark generated from synthetic test suites and baseline ERP telemetry models.
        </p>
      </div>

      {/* Experiment Overview Card */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] space-y-1.5">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Activity className="w-4 h-4" />
          <h2 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
            A/B Benchmark Experiment // Legacy Rule vs High-Density Forensic Engine
          </h2>
        </div>
        <p className="text-[10px] text-[#888888] leading-relaxed">
          PRIMARY_HYPOTHESIS: Augmenting customer call-center text with physical warehouse inspection findings and DEFRA emissions weights boosts preventable defect identification by &gt;30% and establishes auditable proof for supplier chargebacks.
        </p>
      </div>

      {/* Visual Chart Comparison */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
        <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-2">
          BENCHMARK_COMPARISON: LEGACY_BASELINE vs TARGET vs MEASURED_SYSTEM (%)
        </span>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#1a1a1a" />
              <XAxis dataKey="metric" tick={{ fontSize: 8, fill: "#888888", fontFamily: "monospace" }} angle={-15} textAnchor="end" />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 9, fill: "#888888", fontFamily: "monospace" }} />
              <Tooltip
                formatter={(value: any) => [`${value}%`]}
                contentStyle={{ backgroundColor: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: "2px", color: "#e0e0e0", fontSize: "10px", fontFamily: "monospace" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "4px" }} />
              <Bar dataKey="baseline" name="Legacy Baseline" fill="#333333" radius={[1, 1, 0, 0]} />
              <Bar dataKey="target" name="Target Target" fill="#ffb700" radius={[1, 1, 0, 0]} />
              <Bar dataKey="measured" name="Measured Engine" fill="#00f0ff" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Data Table */}
      <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
        <div className="p-2.5 border-b border-[#1f1f1f]">
          <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">
            BENCHMARK_SCORECARD // DELTA_REPORT
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                <th className="py-2 px-3">EVALUATION_METRIC</th>
                <th className="py-2 px-3">BASELINE</th>
                <th className="py-2 px-3">TARGET</th>
                <th className="py-2 px-3">MEASURED_RESULT</th>
                <th className="py-2 px-3 text-right">NET_DELTA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] text-[#cccccc]">
              {comparisonData.map((row) => {
                const diff = row.measured - row.baseline;
                return (
                  <tr key={row.metric} className="hover:bg-[#141414] transition-colors">
                    <td className="py-2 px-3 font-semibold text-[#ffffff]">{row.metric}</td>
                    <td className="py-2 px-3 text-[#666666]">{row.baseline}%</td>
                    <td className="py-2 px-3 text-[#ffb700]">{row.target}%</td>
                    <td className="py-2 px-3 font-bold text-[#00f0ff]">{row.measured}%</td>
                    <td className="py-2 px-3 text-right">
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#00ff66] bg-[#00ff66]/10 px-1.5 py-0.2 rounded-[2px] border border-[#00ff66]/40">
                        <ArrowUpRight className="w-3 h-3" /> +{diff}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
