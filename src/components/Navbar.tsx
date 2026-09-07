import React from "react";
import {
  Layers,
  Sparkles,
  Sliders,
  UserCheck,
  FileCheck,
  Activity,
  AlertTriangle,
  Beaker,
  Database,
  HelpCircle,
  BarChart3,
  ListFilter,
  CheckCircle2,
  Settings,
  Cpu,
} from "lucide-react";
import { UserPersona } from "../types";
import { USER_PERSONAS } from "../data/assumptions";

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  onSelectTab: (tab: string) => void;
  currentPersona?: UserPersona;
  onSelectPersona?: (persona: UserPersona) => void;
  onOpenSettings?: () => void;
  isAiModeAvailable?: boolean;
  useAiMode?: boolean;
  onToggleAiMode?: (enabled: boolean) => void;
  recordCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  currentPersona = USER_PERSONAS[0],
  onSelectPersona,
  onOpenSettings,
  isAiModeAvailable = true,
  useAiMode = false,
  onToggleAiMode,
  recordCount = 650,
}) => {
  const selectedTab = activeTab || currentTab || "dashboard";
  const navItems = [
    { id: "dashboard", label: "DASHBOARD", icon: BarChart3 },
    { id: "explorer", label: "RETURNS_EXPLORER", icon: ListFilter },
    { id: "root_causes", label: "ROOT_CAUSES", icon: Layers },
    { id: "trade_offs", label: "TRADE_OFFS", icon: Sliders },
    { id: "validation", label: "VALIDATION", icon: UserCheck },
    { id: "errors", label: "ERROR_ANALYSIS", icon: AlertTriangle },
    { id: "experiment", label: "EXPERIMENT", icon: Activity },
    { id: "test_harness", label: "TEST_HARNESS", icon: Beaker },
    { id: "data_quality", label: "DATA_QUALITY", icon: FileCheck },
    { id: "schema_arch", label: "ARCH_METHODOLOGY", icon: Database },
    { id: "actions_risks", label: "ACTIONS_RISKS", icon: CheckCircle2 },
    { id: "guide", label: "USER_GUIDE", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d] border-b border-[#1f1f1f] text-[#e0e0e0]">
      {/* Top Telemetry & Control Bar */}
      <div className="px-4 py-2 border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab("dashboard")}>
            <div className="px-2 py-1 bg-[#141414] border border-[#00f0ff]/40 text-[#00f0ff] font-mono font-bold text-xs tracking-widest rounded-[2px] shadow-[0_0_10px_rgba(0,240,255,0.15)]">
              FR//SYS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm tracking-[0.15em] text-[#00f0ff] uppercase">
                  FURNITURE-RETURNS // FORENSIC-ANALYSER
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 rounded-[2px] tracking-wider">
                  LINK STABLE
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#666666] hidden sm:block tracking-wide">
                MULTI-OBJECTIVE ROOT CAUSE TRIAGE &bull; CO2e &bull; COST &bull; SLA RELIABILITY
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Record Count Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#050505] border border-[#1f1f1f] rounded-[2px] text-[10px] font-mono text-[#888888]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]"></span>
              <span>INDEXED: <strong className="text-[#e0e0e0]">{recordCount.toLocaleString()}</strong> UNITS</span>
            </div>

            {/* AI vs Rule-Based Mode Toggle */}
            <div className="flex items-center bg-[#050505] border border-[#1f1f1f] rounded-[2px] p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => onToggleAiMode(false)}
                className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-mono transition-all ${
                  !useAiMode
                    ? "bg-[#1f1f1f] text-[#00f0ff] font-bold border border-[#00f0ff]/40"
                    : "text-[#666666] hover:text-[#e0e0e0]"
                }`}
                title="Deterministic rule engine with multi-source evidence scoring"
              >
                <Cpu className="w-3 h-3 text-[#00f0ff]" />
                <span>RULES</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleAiMode(true)}
                className={`flex items-center gap-1 px-2 py-1 rounded-[2px] font-mono transition-all ${
                  useAiMode
                    ? "bg-[#00f0ff]/10 text-[#00f0ff] font-bold border border-[#00f0ff]"
                    : "text-[#666666] hover:text-[#e0e0e0]"
                }`}
                title={isAiModeAvailable ? "Gemini-assisted natural language evidence extraction" : "Gemini API key optional"}
              >
                <Sparkles className="w-3 h-3 text-[#00f0ff]" />
                <span>GEMINI_AI</span>
              </button>
            </div>

            {/* Persona Switcher */}
            <div className="relative">
              <select
                aria-label="Active Workspace Persona"
                value={currentPersona.id}
                onChange={(e) => {
                  const p = USER_PERSONAS.find((item) => item.id === e.target.value);
                  if (p && onSelectPersona) onSelectPersona(p);
                }}
                className="bg-[#050505] border border-[#1f1f1f] text-[10px] font-mono text-[#e0e0e0] rounded-[2px] px-2 py-1 focus:outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                {USER_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0d0d0d] text-[#e0e0e0]">
                    [{p.id.toUpperCase()}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-1 text-[#666666] hover:text-[#00f0ff] hover:bg-[#141414] border border-[#1f1f1f] rounded-[2px] transition-colors"
              title="Scoring Weights & Model Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* High Density Sub-Navigation Tabs Bar */}
      <nav className="flex space-x-1 overflow-x-auto px-4 py-1 no-scrollbar bg-[#080808]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider whitespace-nowrap transition-all rounded-[2px] border ${
                isActive
                  ? "bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/70 font-bold shadow-[0_0_8px_rgba(0,240,255,0.15)]"
                  : "bg-transparent text-[#777777] border-transparent hover:text-[#e0e0e0] hover:bg-[#141414] hover:border-[#1f1f1f]"
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? "text-[#00f0ff]" : "text-[#555555]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
