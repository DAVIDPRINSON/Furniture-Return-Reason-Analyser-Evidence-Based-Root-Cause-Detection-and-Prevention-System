import React, { useState, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import { ReturnRecord } from "../types";
import { ROOT_CAUSES } from "../data/taxonomy";
import { exportToCSV, downloadSummaryReport } from "../services/export";

interface ReturnsExplorerProps {
  records: ReturnRecord[];
  onSelectReturn: (record: ReturnRecord) => void;
  onUploadCSV: (file: File) => void;
  onDownloadDemoCSV: () => void;
}

export const ReturnsExplorer: React.FC<ReturnsExplorerProps> = ({
  records,
  onSelectReturn,
  onUploadCSV,
  onDownloadDemoCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedPreventability, setSelectedPreventability] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [onlyEdgeCases, setOnlyEdgeCases] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered List
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (selectedCategory !== "ALL" && r.product_category !== selectedCategory) return false;
      if (selectedPreventability !== "ALL" && r.analysed_preventability !== selectedPreventability) return false;
      if (selectedPriority !== "ALL" && r.priority_level !== selectedPriority) return false;
      if (selectedStatus !== "ALL" && r.validation_status !== selectedStatus) return false;
      if (onlyEdgeCases && !r.is_edge_case) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const idMatch = r.return_id.toLowerCase().includes(q);
        const skuMatch = r.sku.toLowerCase().includes(q);
        const nameMatch = r.product_name.toLowerCase().includes(q);
        const textMatch = r.return_text.toLowerCase().includes(q);
        const rootMatch = (r.analysed_root_cause || "").toLowerCase().includes(q);
        const originalMatch = r.original_return_reason.toLowerCase().includes(q);
        if (!idMatch && !skuMatch && !nameMatch && !textMatch && !rootMatch && !originalMatch) return false;
      }
      return true;
    });
  }, [records, searchTerm, selectedCategory, selectedPreventability, selectedPriority, selectedStatus, onlyEdgeCases]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.product_category));
    return Array.from(set).sort();
  }, [records]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCSV(file);
    }
  };

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header with Search and Actions */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="SEARCH_QUERY // RETURN_ID, SKU, TEXT, CAUSE..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-7 pr-3 py-1.5 text-[11px] font-mono bg-[#050505] border border-[#1f1f1f] rounded-[2px] text-[#e0e0e0] placeholder-[#555555] focus:outline-none focus:border-[#00f0ff]"
          />
          <Search className="w-3.5 h-3.5 text-[#555555] absolute left-2 top-2" />
        </div>

        {/* Buttons: Upload CSV, Download Demo, Export */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] text-[#00f0ff] border border-[#1f1f1f] rounded-[2px] transition-colors cursor-pointer"
            title="Upload CSV of bulky furniture returns"
          >
            <Upload className="w-3 h-3" />
            <span>[UPLOAD_CSV]</span>
          </button>

          <button
            onClick={onDownloadDemoCSV}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-[2px] transition-colors cursor-pointer"
            title="Download synthetic demo dataset CSV"
          >
            <Database className="w-3 h-3" />
            <span>[DEMO_DATASET.CSV]</span>
          </button>

          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] text-[#cccccc] border border-[#1f1f1f] rounded-[2px] transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <FileText className="w-3 h-3" />
            <span>[EXPORT_CSV]</span>
          </button>

          <button
            onClick={() => downloadSummaryReport(filtered)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] text-[#cccccc] border border-[#1f1f1f] rounded-[2px] transition-colors cursor-pointer"
            title="Export Root Cause Executive Summary"
          >
            <Download className="w-3 h-3" />
            <span>[REPORT.MD]</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f] flex flex-wrap items-center justify-between gap-2.5 text-[10px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#666666] flex items-center gap-1 uppercase tracking-wider">
            <Filter className="w-3 h-3 text-[#00f0ff]" /> FILTERS:
          </span>

          {/* Category */}
          <select
            aria-label="Filter returns by category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">ALL_CATEGORIES</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Preventability */}
          <select
            aria-label="Filter returns by preventability"
            value={selectedPreventability}
            onChange={(e) => {
              setSelectedPreventability(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">ALL_PREVENTABILITY</option>
            <option value="PREVENTABLE">PREVENTABLE</option>
            <option value="PARTIALLY_PREVENTABLE">PARTIALLY_PREVENTABLE</option>
            <option value="NOT_PREVENTABLE">NOT_PREVENTABLE</option>
            <option value="INSUFFICIENT_EVIDENCE">INSUFFICIENT_EVIDENCE</option>
          </select>

          {/* Priority */}
          <select
            aria-label="Filter returns by priority level"
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">ALL_PRIORITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Validation Status */}
          <select
            aria-label="Filter returns by validation status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#050505] border border-[#1f1f1f] rounded-[2px] px-2 py-1 text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="ALL">ALL_VALIDATION_STATUSES</option>
            <option value="VALIDATED">VALIDATED</option>
            <option value="PENDING_REVIEW">PENDING_REVIEW</option>
            <option value="NEEDS_MORE_EVIDENCE">NEEDS_MORE_EVIDENCE</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          {/* Edge Cases Toggle */}
          <label className="flex items-center gap-1.5 text-[#aaaaaa] cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={onlyEdgeCases}
              onChange={(e) => {
                setOnlyEdgeCases(e.target.checked);
                setCurrentPage(1);
              }}
              className="accent-[#00f0ff] rounded-[1px]"
            />
            <span className="text-[#ffb700]">[EDGE_CASES_ONLY]</span>
          </label>
        </div>

        <div className="text-[#666666] text-[10px]">
          MATCHED: <strong className="text-[#00f0ff]">{filtered.length}</strong> / {records.length} RECORDS
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#080808] text-[#666666] border-b border-[#1f1f1f] text-[10px] uppercase">
                <th className="py-2 px-3">RETURN_ID</th>
                <th className="py-2 px-3">DATE</th>
                <th className="py-2 px-3">SKU // ITEM</th>
                <th className="py-2 px-3 max-w-xs">CUSTOMER_FEEDBACK</th>
                <th className="py-2 px-3">ROOT_CAUSE</th>
                <th className="py-2 px-3">PREVENTABILITY</th>
                <th className="py-2 px-3">SEV</th>
                <th className="py-2 px-3">CONF</th>
                <th className="py-2 px-3">STATUS</th>
                <th className="py-2 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] text-[#cccccc]">
              {paginated.map((r) => {
                const rootMeta = ROOT_CAUSES[r.analysed_root_cause || "unknown_root_cause"];
                const isCritical = r.priority_level === "CRITICAL";

                return (
                  <tr
                    key={r.return_id}
                    className={`hover:bg-[#141414] transition-colors ${
                      r.is_edge_case ? "bg-[#ffb700]/5" : ""
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-[#00f0ff] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {r.return_id}
                        {r.is_edge_case && (
                          <span
                            className="w-1.5 h-1.5 rounded-[1px] bg-[#ffb700]"
                            title={r.edge_case_type || "Edge Case"}
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#666666] whitespace-nowrap">{r.return_date}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#ffffff] truncate max-w-[140px]">{r.product_name}</div>
                      <div className="text-[10px] text-[#777777]">{r.sku}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="text-[#dddddd] truncate" title={r.return_text}>
                        "{r.return_text}"
                      </div>
                      <div className="text-[9px] text-[#555555]">RAW: {r.original_return_reason}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#e0e0e0]">{rootMeta?.label || r.analysed_root_cause}</div>
                      <div className="text-[9px] text-[#666666]">
                        DEPT: <span className="text-[#00f0ff]">{rootMeta?.department || "PRODUCT"}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-mono border ${
                          r.analysed_preventability === "PREVENTABLE"
                            ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                            : r.analysed_preventability === "PARTIALLY_PREVENTABLE"
                            ? "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                            : r.analysed_preventability === "NOT_PREVENTABLE"
                            ? "bg-[#222222] text-[#888888] border-[#333333]"
                            : "bg-[#222222] text-[#00f0ff] border-[#00f0ff]/40"
                        }`}
                      >
                        {r.analysed_preventability}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.2 rounded-[2px] text-[9px] font-bold border ${
                          isCritical
                            ? "bg-[#ff0055]/15 text-[#ff0055] border-[#ff0055]/50"
                            : r.priority_level === "HIGH"
                            ? "bg-[#ff6600]/15 text-[#ff6600] border-[#ff6600]/50"
                            : r.priority_level === "MEDIUM"
                            ? "bg-[#ffb700]/15 text-[#ffb700] border-[#ffb700]/50"
                            : "bg-[#222222] text-[#888888] border-[#333333]"
                        }`}
                      >
                        {r.priority_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[#aaaaaa]">{r.confidence_score}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.2 rounded-[2px] text-[9px] border ${
                          r.validation_status === "VALIDATED"
                            ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40"
                            : r.validation_status === "REJECTED"
                            ? "bg-[#ff0055]/10 text-[#ff0055] border-[#ff0055]/40"
                            : r.validation_status === "NEEDS_MORE_EVIDENCE"
                            ? "bg-[#ffb700]/10 text-[#ffb700] border-[#ffb700]/40"
                            : "bg-[#222222] text-[#777777] border-[#333333]"
                        }`}
                      >
                        {r.validation_status || "PENDING"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectReturn(r)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-[2px] text-[10px] transition-colors cursor-pointer"
                      >
                        <Eye className="w-2.5 h-2.5" />
                        <span>[INSPECT]</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-[#555555]">
                    NO_MATCHING_RECORDS_FOUND_IN_WORKSPACE
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-2.5 bg-[#080808] border-t border-[#1f1f1f] flex items-center justify-between text-[10px] text-[#666666]">
          <div>
            PAGE <strong className="text-[#e0e0e0]">{currentPage}</strong> OF{" "}
            <strong className="text-[#e0e0e0]">{totalPages}</strong> ({filtered.length} TOTAL)
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-[2px] border border-[#1f1f1f] bg-[#0d0d0d] text-[#e0e0e0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1f1f1f]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-[2px] border border-[#1f1f1f] bg-[#0d0d0d] text-[#e0e0e0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1f1f1f]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
