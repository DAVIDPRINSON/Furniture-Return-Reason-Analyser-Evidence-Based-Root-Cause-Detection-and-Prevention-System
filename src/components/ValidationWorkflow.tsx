import React, { useState, useMemo } from "react";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Send,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ReturnRecord, ValidationStatus } from "../types";
import { ROOT_CAUSES } from "../data/taxonomy";

interface ValidationWorkflowProps {
  records: ReturnRecord[];
  onValidateRecord: (
    recordId: string,
    status: ValidationStatus,
    comment: string,
    correctedCause?: string
  ) => void;
  onSelectReturn: (record: ReturnRecord) => void;
}

export const ValidationWorkflow: React.FC<ValidationWorkflowProps> = ({
  records,
  onValidateRecord,
  onSelectReturn,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>("");
  const [reviewerName, setReviewerName] = useState<string>("David Vance [SR_ENG]");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("VALIDATED");
  const [comment, setComment] = useState<string>("");
  const [correctedCause, setCorrectedCause] = useState<string>("");

  const pendingRecords = useMemo(() => {
    return records.filter((r) => !r.validation_status || r.validation_status === "PENDING_REVIEW");
  }, [records]);

  const validatedRecords = useMemo(() => {
    return records.filter(
      (r) =>
        r.validation_status === "VALIDATED" ||
        r.validation_status === "REJECTED" ||
        r.validation_status === "NEEDS_MORE_EVIDENCE"
    );
  }, [records]);

  const activeRecord = useMemo(() => {
    if (selectedRecordId) {
      return records.find((r) => r.return_id === selectedRecordId);
    }
    return pendingRecords[0] || records[0];
  }, [selectedRecordId, records, pendingRecords]);

  const agreementPct = useMemo(() => {
    const reviewed = validatedRecords.length;
    if (reviewed === 0) return 0;
    const agreed = validatedRecords.filter((r) => r.validation_status === "VALIDATED").length;
    return Math.round((agreed / reviewed) * 100);
  }, [validatedRecords]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord) return;
    onValidateRecord(activeRecord.return_id, validationStatus, comment, correctedCause || undefined);
    setComment("");
    setCorrectedCause("");
    const next = pendingRecords.find((r) => r.return_id !== activeRecord.return_id);
    if (next) setSelectedRecordId(next.return_id);
  };

  const activeMeta = ROOT_CAUSES[activeRecord?.analysed_root_cause || "unknown_root_cause"];

  return (
    <div className="space-y-3 font-mono text-[#e0e0e0]">
      {/* Header & Synthetic Disclaimer */}
      <div className="bg-[#0d0d0d] p-3 rounded-[2px] border border-[#1f1f1f]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#00f0ff]" />
              <h2 className="text-xs font-bold text-[#e0e0e0]">Human-In-The-Loop Validation Station</h2>
            </div>
            <p className="text-[10px] text-[#666666] mt-0.5">
              Engineering audit feedback station for calibrating AI predictions against physical inspection ground truth.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#050505] p-2 rounded-[2px] border border-[#1f1f1f] text-[10px]">
            <div>
              <span className="text-[#666666] block text-[9px] uppercase">AGREEMENT_RATE</span>
              <span className="font-bold text-[#00ff66] text-xs">{agreementPct}%</span>
            </div>
            <div className="border-l border-[#1f1f1f] pl-3">
              <span className="text-[#666666] block text-[9px] uppercase">AUDITED / TOTAL</span>
              <span className="font-bold text-[#e0e0e0] text-xs">
                {validatedRecords.length} / {records.length}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-[9px] text-[#ffb700] bg-[#ffb700]/10 p-1.5 rounded-[2px] border border-[#ffb700]/30">
          NOTICE: Human ground-truth feedback is fed into the error analysis pipeline and classifier confidence model.
        </div>
      </div>

      {/* Validation Pipeline Architecture Graphic */}
      <div className="bg-[#0d0d0d] p-2.5 rounded-[2px] border border-[#1f1f1f]">
        <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block mb-1.5">
          CONTINUOUS_CALIBRATION_PIPELINE:
        </span>
        <div className="flex flex-wrap items-center justify-between text-[10px] text-[#aaaaaa] gap-1.5">
          <span className="px-2 py-1 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">1. AI_PREDICTION</span>
          <ArrowRight className="w-3 h-3 text-[#555555]" />
          <span className="px-2 py-1 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">2. QA_AUDIT</span>
          <ArrowRight className="w-3 h-3 text-[#555555]" />
          <span className="px-2 py-1 bg-[#00f0ff]/10 text-[#00f0ff] rounded-[2px] border border-[#00f0ff]/40 font-bold">
            3. DISPUTE_OR_CONFIRM
          </span>
          <ArrowRight className="w-3 h-3 text-[#555555]" />
          <span className="px-2 py-1 bg-[#050505] rounded-[2px] border border-[#1f1f1f]">4. ROOT_CORRECTION</span>
          <ArrowRight className="w-3 h-3 text-[#555555]" />
          <span className="px-2 py-1 bg-[#00ff66]/10 text-[#00ff66] rounded-[2px] border border-[#00ff66]/40 font-bold">
            5. WEIGHT_RE-CALIBRATION
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Pending Validation Queue */}
        <div className="lg:col-span-5 bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1.5">
            <h3 className="font-bold text-[10px] text-[#00f0ff] uppercase tracking-wider">
              PENDING_VALIDATION_QUEUE ({pendingRecords.length})
            </h3>
            <span className="text-[9px] text-[#666666]">SELECT_TO_REVIEW</span>
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {pendingRecords.slice(0, 8).map((r) => {
              const isSelected = r.return_id === activeRecord?.return_id;
              const meta = ROOT_CAUSES[r.analysed_root_cause || "unknown_root_cause"];
              return (
                <div
                  key={r.return_id}
                  onClick={() => setSelectedRecordId(r.return_id)}
                  className={`p-2 rounded-[2px] border transition-all cursor-pointer text-[10px] ${
                    isSelected
                      ? "border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                      : "border-[#1f1f1f] hover:border-[#333333] bg-[#080808]"
                  }`}
                >
                  <div className="flex justify-between font-bold text-[#ffffff] mb-0.5">
                    <span className="text-[#00f0ff]">{r.return_id}</span>
                    <span className="text-[#ffb700]">{r.confidence_score}% CONF</span>
                  </div>
                  <div className="text-[#cccccc] truncate mb-0.5">{r.product_name}</div>
                  <div className="text-[#777777] truncate">"{r.return_text}"</div>
                  <div className="mt-1 flex items-center justify-between text-[9px]">
                    <span className="px-1 py-0.2 rounded-[2px] bg-[#141414] text-[#aaaaaa] border border-[#222222]">
                      PREDICTED: {meta?.label}
                    </span>
                    <span className="text-[#555555]">{r.sku}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Validation Review & Feedback Form */}
        <div className="lg:col-span-7 bg-[#0d0d0d] rounded-[2px] border border-[#1f1f1f] p-3 space-y-3">
          {activeRecord ? (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="border-b border-[#1f1f1f] pb-2 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#ffffff] text-xs">REVIEWING: {activeRecord.return_id}</h3>
                    <span className="text-[10px] text-[#666666]">({activeRecord.sku})</span>
                  </div>
                  <p className="text-[10px] text-[#aaaaaa] mt-0.5">{activeRecord.product_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectReturn(activeRecord)}
                  className="text-[10px] text-[#00f0ff] hover:underline cursor-pointer"
                >
                  [INSPECT_FULL_RECORD]
                </button>
              </div>

              {/* Evidence Snippets */}
              <div className="bg-[#050505] p-2.5 rounded-[2px] border border-[#1f1f1f] space-y-1.5 text-[10px]">
                <div>
                  <span className="text-[#666666] block text-[9px] uppercase font-bold">CUSTOMER_REASON:</span>
                  <p className="text-[#cccccc]">"{activeRecord.return_text}"</p>
                </div>
                <div>
                  <span className="text-[#666666] block text-[9px] uppercase font-bold">INSPECTION_NOTE:</span>
                  <p className="text-[#00ff66]">{activeRecord.inspection_finding}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1f1f1f] text-[9px]">
                  <div>
                    <span className="text-[#666666]">PACKAGING:</span>{" "}
                    <strong className="text-[#e0e0e0]">{activeRecord.packaging_condition}</strong>
                  </div>
                  <div>
                    <span className="text-[#666666]">TRANSIT_CONDITION:</span>{" "}
                    <strong className="text-[#e0e0e0]">{activeRecord.delivery_condition}</strong>
                  </div>
                </div>
              </div>

              {/* System Prediction Summary */}
              <div className="p-2 rounded-[2px] bg-[#00f0ff]/5 border border-[#00f0ff]/30 flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-[#00f0ff] text-[9px] uppercase font-bold block">
                    MODEL_PREDICTED_ROOT_CAUSE:
                  </span>
                  <span className="font-bold text-[#ffffff] text-xs">{activeMeta?.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#666666] block">CONFIDENCE</span>
                  <span className="font-bold text-[#00ff66] text-xs">{activeRecord.confidence_score}%</span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px]">
                <div>
                  <label className="block text-[#888888] mb-1 uppercase text-[9px]">REVIEWER_TAG</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="w-full border border-[#1f1f1f] rounded-[2px] px-2 py-1 bg-[#050505] text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] mb-1 uppercase text-[9px]">VALIDATION_DECISION</label>
                  <select
                    value={validationStatus}
                    onChange={(e) => setValidationStatus(e.target.value as ValidationStatus)}
                    className="w-full border border-[#1f1f1f] rounded-[2px] px-2 py-1 bg-[#050505] text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="VALIDATED">VALIDATED (CONFIRM)</option>
                    <option value="PARTIALLY_VALIDATED">PARTIALLY VALIDATED</option>
                    <option value="REJECTED">REJECTED (DISAGREE)</option>
                    <option value="NEEDS_MORE_EVIDENCE">NEEDS MORE EVIDENCE</option>
                  </select>
                </div>
              </div>

              {/* If Rejected, Allow Selecting Correct Root Cause */}
              {validationStatus === "REJECTED" && (
                <div className="text-[10px]">
                  <label className="block text-[#ff0055] mb-1 uppercase text-[9px] font-bold">
                    GROUND_TRUTH_OVERRIDE (CORRECT CAUSE)
                  </label>
                  <select
                    value={correctedCause}
                    onChange={(e) => setCorrectedCause(e.target.value)}
                    className="w-full border border-[#ff0055]/50 rounded-[2px] px-2 py-1 bg-[#ff0055]/10 text-[#ff0055] focus:outline-none"
                  >
                    <option value="">Select Correct Root Cause...</option>
                    {Object.values(ROOT_CAUSES).map((rc) => (
                      <option key={rc.id} value={rc.id} className="bg-[#0d0d0d] text-[#e0e0e0]">
                        {rc.label} ({rc.department})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reviewer Comment */}
              <div className="text-[10px]">
                <label className="block text-[#888888] mb-1 uppercase text-[9px]">
                  ENGINEERING_RATIONALE // REMARKS
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter physical tear-down evidence, supplier CAD discrepancy, or packaging flaw note..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-[#1f1f1f] rounded-[2px] p-2 bg-[#050505] text-[#e0e0e0] focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 rounded-[2px] text-[10px] font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>[RECORD_VALIDATION_EVENT]</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center text-[#666666] text-xs">ALL_RETURNS_AUDITED</div>
          )}
        </div>
      </div>
    </div>
  );
};
