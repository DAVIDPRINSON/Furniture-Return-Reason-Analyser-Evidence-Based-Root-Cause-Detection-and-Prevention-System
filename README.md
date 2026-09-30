# Furniture Return Reason Analyser
### Evidence-Based Root Cause Detection & Multi-Objective Reverse Logistics Optimization

[![Build Status](https://img.shields.io/badge/build-passing-00ff66?style=flat-square&logo=github)](/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-00f0ff?style=flat-square&logo=typescript)](/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat-square&logo=vite)](/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4_High_Density-38bdf8?style=flat-square&logo=tailwindcss)](/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-Hybrid_Intelligence-8e75ff?style=flat-square&logo=google)](/)
[![Dataset Benchmark](https://img.shields.io/badge/Benchmark-650_Bulky_Units-ffb700?style=flat-square)](/)

A high-density, forensic intelligence platform engineered to transform ambiguous, unstructured bulky furniture returns into actionable engineering, packaging, and supply-chain proof.

---

## 📑 Table of Contents

1. [Executive Problem Statement](#-executive-problem-statement)
2. [System Architecture & Data Flow](#-system-architecture--data-flow)
3. [Multi-Source Evidence Fusion Formula](#-multi-source-evidence-fusion-formula)
4. [Multi-Objective Reverse Logistics Trade-Off Model](#-multi-objective-reverse-logistics-trade-off-model)
5. [Complete Module & View Directory](#-complete-module--view-directory)
   - [1. Operations Command Dashboard](#1-operations-command-dashboard-dashboardtsx)
   - [2. Returns Explorer & Ingestion Grid](#2-returns-explorer--ingestion-grid-returnsexplorertsx)
   - [3. Forensic Root Cause Explorer](#3-forensic-root-cause-explorer-rootcauseexplorertsx)
   - [4. Multi-Objective Trade-Off Optimizer](#4-multi-objective-trade-off-optimizer-tradeoffanalysistsx)
   - [5. Human-in-the-Loop Validation Station](#5-human-in-the-loop-validation-station-validationworkflowtsx)
   - [6. A/B Simulation Studio](#6-ab-simulation-studio-experimentviewtsx)
   - [7. Error & Disagreement Analysis](#7-error--disagreement-analysis-erroranalysisviewtsx)
   - [8. Automated Test Harness Suite](#8-automated-test-harness-suite-testharnessviewtsx)
   - [9. Data Ingestion Hygiene Auditor](#9-data-ingestion-hygiene-auditor-dataqualityviewtsx)
   - [10. Executive Strategy Brief & Enterprise Registers](#10-executive-strategy-brief--enterprise-registers-executivebrieftsx)
   - [11. Engine Calibration Settings & DEFRA Factors](#11-engine-calibration-settings--defra-factors-settingsmodaltsx)
   - [12. Architecture & Methodology Reference](#12-architecture--methodology-reference-methodologyviewtsx)
6. [Multi-Stakeholder Persona Workspaces](#-multi-stakeholder-persona-workspaces)
7. [Canonical Taxonomy & Failure Archetypes](#-canonical-taxonomy--failure-archetypes)
8. [CSV Data Schema & Enterprise Ingestion](#-csv-data-schema--enterprise-ingestion)
9. [API Specification & Server Endpoints](#-api-specification--server-endpoints)
10. [Technology Stack](#-technology-stack)
11. [Installation & Setup Guide](#-installation--setup-guide)
12. [Production Build & Deployment](#-production-build--deployment)
13. [Enterprise Risk Register & Mitigations](#-enterprise-risk-register--mitigations)
14. [Frequently Asked Questions & Troubleshooting](#-frequently-asked-questions--troubleshooting)
15. [License & Governance](#-license--governance)

---

## 🎯 Executive Problem Statement

Bulky furniture returns represent one of the most expensive and carbon-intensive segments in modern retail logistics:
- **Average Return Cost:** ₹8,500 – ₹18,000 per unit (2-man freight truck roll, specialized reverse packaging, warehouse inspection, negative salvage discounting).
- **Carbon Intensity:** 25 – 45 kg $\text{CO}_2\text{e}$ per round-trip long-haul freight transit.
- **The "Bucket Code" Trap:** When customers initiate returns via call centers or web portals, agents frequently select generic reason codes such as `"Defective"`, `"Damaged"`, or `"Customer Remorse"`.

This superficial classification masks the true root causes:
1. **Structural Engineering vs Transit Shock:** Was a cracked dining table joint caused by insufficient dowel shear strength (supplier manufacturing flaw) or a rough courier drop from a tailgate?
2. **Packaging Failure vs Inadequate Cushioning:** Did a bookshelf corner shatter because the factory used single-wall 32 ECT corrugated boxes with 15mm low-density EPS foam instead of double-wall 48 ECT with 50mm molded EPE corner caps?
3. **Assembly Guidance Ambiguity vs True Defect:** Did the customer return a wardrobe because cam-lock pins were reversed during Step 4 of DIY assembly rather than manufactured incorrectly?

The **Furniture Return Reason Analyser** solves this by performing **multi-source evidence fusion**—correlating raw customer feedback text, certified warehouse physical teardowns, CAD dimensional tolerances, DEFRA emission factors, and historical SKU defect patterns into an auditable ground-truth diagnostic engine.

---

## 🏛️ System Architecture & Data Flow

```
                      +------------------------------------------+
                      |         ENTERPRISE DATA SOURCES          |
                      |  ERP / WMS / Return Portal / Courier API |
                      +------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                          INGESTION & DATA QUALITY HYGIENE                        |
|   - Primary Key Collision Check        - Malformed Dimension Parser (LxWxH)      |
|   - Negative Cost Anomaly Detection    - Missing Inspection Log Penalizer        |
+----------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                       MULTI-SOURCE EVIDENCE FUSION ENGINE                        |
|                                                                                  |
|   [Customer Text]      [Warehouse Teardown]     [Product Spec & CAD]             |
|   NLP Keyphrases       Puncture / Dowel Audit   Mass, Materials, Load Limits     |
|   Weight: 25%          Weight: 35%              Weight: 15%                      |
|                                                                                  |
|   [Listing & CAD]      [Customer Action]        [Historical Defect Batch]        |
|   Dimension Tolerances Portal vs Phone vs Tech  SKU Prior Defect Rate            |
|   Weight: 10%          Weight: 5%               Weight: 10%                      |
+----------------------------------------------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                   HYBRID CLASSIFICATION & DECISION ENGINE                        |
|   - Deterministic Expert Rule Base (High-Speed / Zero Network Dependency)       |
|   - Server-Side Gemini 2.5 Flash API (Deep Semantic Forensics / Optional)        |
|   - Ambiguity & Insufficient Evidence Guardrails (<40% score fallback)           |
+----------------------------------------------------------------------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                                                   |
                 v                                                   v
+----------------------------------+               +----------------------------------+
|   MULTI-OBJECTIVE OPTIMIZER      |               |   HUMAN-IN-THE-LOOP VALIDATION   |
|   - Financial Cost Minimization  |               |   - Quality Engineer Sign-Off    |
|   - Turnaround SLA Acceleration  |               |   - Supplier Chargeback Claims   |
|   - DEFRA Carbon Reduction       |               |   - Continuous Model Calibration |
|   - Resolution Reliability Score |               +----------------------------------+
+----------------------------------+                                 |
                 |                                                   |
                 +-------------------------+-------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                      HIGH-DENSITY OPERATIONAL INTERFACE                          |
|  Command Dashboard | Returns Explorer | Root Causes | Trade-Offs | Risk Register |
+----------------------------------------------------------------------------------+
```

---

## 📐 Multi-Source Evidence Fusion Formula

The core classification confidence score is calculated using a normalized weighted fusion model across 7 distinct operational evidence vectors:

$$\text{Confidence Score} = \sum_{i=1}^{7} \left( W_i \times E_i \right)$$

Where:
- $W_{text} = 0.25$ : Customer feedback text NLP signal
- $W_{insp} = 0.35$ : Certified physical warehouse inspection teardown report
- $W_{prod} = 0.15$ : Product physical attributes (materials, weight, joint stress ratings)
- $W_{list} = 0.10$ : Catalog listing description and 3D CAD dimensional envelope
- $W_{act} = 0.05$ : Customer portal interaction pattern (immediate cancel vs assembly call)
- $W_{hist} = 0.10$ : Historical SKU failure rate across identical factory production batches
- $W_{val} = 0.00 - 0.15$ : Human quality engineer validation ground-truth adjustment

### Decision Confidence Tiers

| Confidence Tier | Score Range | Operational Classification | Action Workflow |
| :--- | :--- | :--- | :--- |
| **Very High** | $\ge 85\%$ | Deterministic Preventable / Non-Preventable | Automated supplier SLA chargeback & ECO routing |
| **High** | $70\% - 84\%$ | High-Confidence Preventable Root Cause | Flagged for automated intervention roadmap |
| **Review Queue** | $40\% - 69\%$ | Borderline Ambiguity / Conflicting Evidence | Routed to Sr. Quality Engineer Validation Station |
| **Insufficient** | $< 40\%$ | `UNKNOWN / INSUFFICIENT_EVIDENCE` | Customer photo prompt required before truck dispatch |

---

## ⚖️ Multi-Objective Reverse Logistics Trade-Off Model

Traditional reverse logistics defaults to costly full-unit replacements. Our multi-objective trade-off optimizer calculates a composite score for each resolution strategy across four competing organizational objectives:

$$\text{Strategy Score} = w_c \cdot (100 - C) + w_t \cdot (100 - T) + w_e \cdot (100 - E) + w_r \cdot R$$

Where:
- $C \in [0, 100]$: Cost Index (normalized relative to item replacement value)
- $T \in [0, 100]$: Turnaround Time Index (hours to resolution)
- $E \in [0, 100]$: DEFRA Carbon Footprint Index ($\text{kg CO}_2\text{e}$ emitted)
- $R \in [0, 100]$: Reliability & Customer Satisfaction Score
- $w_c, w_t, w_e, w_r$: Dynamic stakeholder weights (sum to $100\%$)

### Resolution Channels Evaluated:
1. **Immediate Replacement:** Rapid customer resolution, high cost (avg ₹18,500), high carbon (38.5 kg). Recommended for VIP customers and catastrophic structural failures.
2. **On-Site / Local Carpenter Repair:** Technician dispatched with spare dowels/hardware. Low cost (avg ₹3,200), minimal carbon (8.2 kg), 72-hour turnaround. Recommended for loose joints and veneer scratches.
3. **Warehouse Refurbishment & Re-boxing:** Unit collected, returned to hub, repaired, and re-sold in outlet channel. Medium cost (avg ₹6,400), 19.4 kg carbon. Recommended for unblemished sofas/beds.
4. **Immediate Refund & Customer Retain:** No return freight incurred. Eliminates 100% of reverse transport carbon. Recommended for low-value SKUs ($<\text{₹}4,000$) with unrepairable damage.
5. **Express Spare Parts Drop-Ship:** Courier envelope with replacement hardware or assembly pack. Lowest cost (avg ₹850), lowest carbon (1.8 kg). Recommended for missing hardware and reversed cam-locks.

---

## 🖥️ Complete Module & View Directory

### 1. Operations Command Dashboard (`Dashboard.tsx`)
- **Key Telemetry:** Financial Loss (`₹ Lakhs`), Preventable Return Percentage (`%`), Total Return Volume, and Reverse Logistics Carbon Emissions (`MT CO2e`).
- **Interactive Visualizations:**
  - Bar charts of returns by Category and Financial Loss.
  - Pie/Donut distributions of Preventability (Preventable vs Partially Preventable vs Not Preventable).
  - High-risk SKU defect concentration matrix.
  - Resolution turnaround lead time telemetry.
- **Dynamic Cross-Filtering:** Filter by Category, Preventability, Priority Level, SKU, and freeform text query.

### 2. Returns Explorer & Ingestion Grid (`ReturnsExplorer.tsx`)
- **Tabular Telemetry Grid:** High-density virtualized table indexing 650+ bulky furniture return records.
- **Filter Controls:** Category, Preventability, Priority, Human Audit Status, Edge-Case flag, and search bar.
- **Enterprise Ingestion:**
  - **CSV Ingestion Engine:** Parses client CSV files, mapping raw customer feedback and inspection findings directly through the forensic analyzer.
  - **Export Dataset:** One-click export of entire enriched benchmark dataset to CSV.

### 3. Forensic Root Cause Explorer (`RootCauseExplorer.tsx`)
- Diagnostic exploration across all canonical furniture failure causes.
- Direct root cause attribution:
  - Joinery shear failure vs courier tailgate drop.
  - Inadequate corner protection vs edge-crush corrugated collapse.
  - DIY cam-lock confusion vs missing pre-drilled pilot holes.
- Displays recommended Engineering Change Orders (ECO) and estimated preventable cost recovery.

### 4. Multi-Objective Trade-Off Optimizer (`TradeOffAnalysis.tsx`)
- Four interactive weight sliders (Cost, Turnaround Time, Emissions, Reliability) summing to 100%.
- Real-time recalculation of the 5 resolution strategies.
- Visual ranking badge showing the mathematically optimal channel for current business priorities.

### 5. Human-in-the-Loop Validation Station (`ValidationWorkflow.tsx`)
- Reviewer workstation for Quality Assurance Engineers.
- Compares AI/Rule predicted root cause against physical inspection ground truth.
- Record audit decisions: `VALIDATED`, `PARTIALLY_VALIDATED`, `REJECTED`, `NEEDS_MORE_EVIDENCE`.
- Log reviewer comments and calibrate downstream model weights.

### 6. A/B Simulation Studio (`ExperimentView.tsx`)
- A/B benchmark comparing Legacy ERP Rule Baselines against the High-Density Forensic Engine.
- Metric tracking across Reason Consistency, Root Cause Precision, Evidence Completeness, QA Agreement, and GHG Tracking.
- Projected delta scorecard showing financial and carbon savings.

### 7. Error & Disagreement Analysis (`ErrorAnalysisView.tsx`)
- Full confusion matrix ($TP, FP, FN, TN$) for preventable defect classification.
- Evaluates trade-offs: prioritizes **Recall over Precision** (missing an avoidable supplier flaw costs ₹15,000+ in repeat haulage).
- In-depth case studies of False Positives and False Negatives with root cause of error and corrective calibration logic.

### 8. Automated Test Harness Suite (`TestHarnessView.tsx`)
- 20 automated regression test vectors validating classification against tough real-world edge cases.
- Validates handling of vague customer text, conflicting claims vs physical inspection, missing inspection logs, and extreme dimensions.
- Real-time test execution button with pass/fail telemetry and diff drill-down.

### 9. Data Ingestion Hygiene Auditor (`DataQualityView.tsx`)
- Automated schema audit scoring overall dataset health.
- Monitors key collisions, negative costs, zero-mass anomalies, malformed dimensions, and missing inspection percentages.
- Recommends actionable ETL cleaning rules for enterprise data pipelines.

### 10. Executive Strategy Brief & Enterprise Registers (`ExecutiveBrief.tsx`)
- **Executive Memorandum:** C-suite briefing on total financial loss, preventable percentage, and 30-60-90 day execution roadmap.
- **Stakeholder Hypotheses Matrix:** Requirements and empirical validation milestones for Operations, Product, Content, Logistics, Sustainability, Support, and Management.
- **Enterprise Risk Register:** Risk audit covering false positives, missing telemetry, packaging ambiguity, and data bias with owner assignments.
- **Preventive Engineering Action Registry:** Action tracker across Product Engineering, Packaging ECT, 3D Listing Specs, and Courier SLAs with interactive status progression (`OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED`).
- One-click print-ready memorandum and text summary export.

### 11. Engine Calibration Settings & DEFRA Factors (`SettingsModal.tsx`)
- Accessible via the gear icon in the navigation bar or persona ribbon.
- Adjust evidence scoring weights with automatic 100% normalization.
- Configure confidence thresholds and review queue cutoffs.
- Configure DEFRA/EPA vehicle emission factors (default `0.28 kg CO2e / km`) with presets for light vans, freight trucks, and EV fleets.
- **Apply & Recalibrate Button:** Re-indexes all 650 records in application state dynamically with live updates.

### 12. Architecture & Methodology Reference (`MethodologyView.tsx`)
- Technical documentation detailing mathematical scoring formulas, canonical taxonomy matrices, and evidence weighting hierarchies.

---

## 👥 Multi-Stakeholder Persona Workspaces

The platform adapts its contextual telemetry based on the active stakeholder persona selected in the top bar:

| Persona Role | Title / Department | Core Focus Metrics | Primary Views |
| :--- | :--- | :--- | :--- |
| **`ops_analyst`** | Operations Analyst (Reverse Logistics & Triage Lead) | Avoidable Pickup Rate, Pickup & Freight Cost, Resolution Lead Time, Transit Damage Rate | Dashboard, Returns Explorer, Trade-Offs |
| **`product_team`** | Product & Engineering Team (Quality & Packaging Engineer) | Preventable Return %, Root Cause Validation Rate, SKU Defect Concentration, Packaging Puncture Rate | Root Causes, Validation Station, Error Analysis |
| **`exec_sustainability`** | Operations & Sustainability Director (Executive Leadership) | Total Reverse Logistics Cost, Transport $\text{CO}_2\text{e}$ Footprint, Multi-Objective Strategy Score, Avoided Loss | Executive Brief, Trade-Off Optimizer, Risk Register |

---

## 🏷️ Canonical Taxonomy & Failure Archetypes

The engine categorizes returns into 12 mutually exclusive, unambiguous categories:

| Category Code | Description | Canonical Root Causes Covered |
| :--- | :--- | :--- |
| `PRODUCT_DEFECT` | Manufacturing flaws or structural component failure | `weak_joint`, `cracked_panel`, `missing_hardware` |
| `PRODUCT_DAMAGE` | Structural damage occurring post-manufacturing | `weak_joint`, `delivery_handling` |
| `PACKAGING_FAILURE` | Inadequate protective packaging causing impact | `poor_packaging`, `insufficient_corner_protection` |
| `DELIVERY_DAMAGE` | Courier mishandling, drop shock, forklift puncture | `delivery_handling`, `poor_packaging` |
| `MISSING_PART` | Omitted fasteners, assembly hardware, or legs | `missing_hardware` |
| `ASSEMBLY_DIFFICULTY` | Customer inability to complete DIY assembly | `assembly_instruction_gap`, `assembly_complexity` |
| `SIZE_OR_DIMENSION_MISMATCH`| Product does not fit room, doorway, or stairwell | `incorrect_dimensions_in_listing`, `customer_measurement_error` |
| `LISTING_CONTENT_MISMATCH` | Inaccurate product description, swatch, or specs | `misleading_material_description`, `incorrect_dimensions_in_listing` |
| `QUALITY_EXPECTATION` | Perceived quality divergence from expectations | `customer_preference`, `misleading_material_description` |
| `CUSTOMER_CHANGED_MIND` | Unprompted customer remorse or decor change | `customer_preference` |
| `CUSTOMER_ERROR` | Customer mismeasured room or ordered wrong finish | `customer_measurement_error` |
| `UNKNOWN` | Ambiguous feedback with no inspection findings | `conflicting_evidence`, `unknown_root_cause` |

---

## 📊 CSV Data Schema & Enterprise Ingestion

When importing custom CSV files into the **Returns Explorer**, use the following column structure:

```csv
return_id,sku,product_name,product_category,item_price,product_weight,product_dimensions,original_return_reason,customer_action,return_text,inspection_finding,packaging_condition,delivery_condition
RET-1001,FUR-DIN-101,"Nordic Solid Oak Dining Table",LIVING_ROOM,18500,45,"180x90x75 cm","Defective","Return Portal","Table leg cracked immediately upon installation","Single dowel joint fractured under shear load. No corner gusset.","Intact","Normal"
RET-1002,FUR-BKS-505,"Industrial 5-Tier Bookshelf",STORAGE,8900,32,"80x35x190 cm","Damaged","Phone Call","Corner of top shelf was crushed and laminate peeled","Single-wall 32 ECT box punctured on vertical corner. Foam cracked.","Crushed","Rough Transit"
```

### Supported CSV Column Specification:
- `return_id` *(string, required)*: Unique return tracking identifier.
- `sku` *(string, required)*: Stock keeping unit.
- `product_name` *(string, required)*: Full catalog item title.
- `product_category` *(string, required)*: `LIVING_ROOM`, `BEDROOM`, `OFFICE`, `STORAGE`, `DINING`.
- `item_price` *(number, optional)*: Product retail price in ₹.
- `product_weight` *(number, optional)*: Mass in kg.
- `product_dimensions` *(string, optional)*: Dimensional envelope (e.g. `180x90x75 cm`).
- `original_return_reason` *(string, required)*: Legacy reason code recorded by call center.
- `customer_action` *(string, optional)*: Portal touchpoint.
- `return_text` *(string, required)*: Verbatim customer explanation.
- `inspection_finding` *(string, required)*: Certified physical teardown notes from warehouse.
- `packaging_condition` *(string, optional)*: `Intact`, `Crushed`, `Torn Corner`, `Missing Padding`.
- `delivery_condition` *(string, optional)*: `Normal`, `Rough Transit`, `Damaged Carton`.

---

## 🔌 API Specification & Server Endpoints

The full-stack server exposes the following REST endpoints for enterprise ERP integration:

### 1. Health & Mode Check
- **Endpoint:** `GET /api/health`
- **Response:**
```json
{
  "status": "ok",
  "hasGeminiKey": true,
  "mode": "AI_ASSISTED_READY"
}
```

### 2. Deep Forensic AI Audit
- **Endpoint:** `POST /api/ai-analyze`
- **Request Payload:**
```json
{
  "returnRecord": {
    "product_name": "Nordic Solid Oak 6-Seater Dining Table",
    "product_category": "LIVING_ROOM",
    "return_text": "The table leg split right at the screw joint during our first dinner.",
    "original_return_reason": "Defective",
    "inspection_finding": "Split along grain at rear mortise. Single wooden dowel sheared off.",
    "packaging_condition": "Intact",
    "delivery_condition": "Normal",
    "listing_title": "Nordic Dining Table Solid Oak",
    "product_dimensions": "180x90x75 cm"
  }
}
```
- **Response Payload:**
```json
{
  "status": "success",
  "analysis": {
    "category": "PRODUCT_DEFECT",
    "root_cause": "weak_joint",
    "preventability": "PREVENTABLE",
    "confidence": 92,
    "explanation": "Intact carton and normal delivery condition rule out transit drop shock. Sheared dowel joint under initial loading confirms manufacturing specification weakness.",
    "recommended_action": "Issue ECO to supplier to replace single dowel with steel angle corner bracket."
  }
}
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.0.0 | High-performance reactive UI |
| **Language** | TypeScript | 5.8.0 | Strict type safety and schema validation |
| **Bundler & Dev Server**| Vite | 6.0.0 | Near-instant HMR and production bundling |
| **Styling Engine** | Tailwind CSS | 4.0.0 | High-density monospace engineering theme |
| **Icons & Typography** | Lucide React / JetBrains Mono | Latest | Terminal-grade forensic aesthetics |
| **Data Visualization** | Recharts | 2.15.0 | Cartesian, Bar, Scatter, Pie telemetry |
| **Backend Server** | Node.js / Express | 4.21.0 | Full-stack proxy, CSV processing, REST API |
| **TypeScript Runtime** | tsx | 4.19.0 | Direct execution of TypeScript server |
| **Server Bundler** | esbuild | 0.25.0 | Standalone CJS production server bundle |
| **AI Intelligence** | `@google/genai` | 0.1.2 | Optional Gemini 2.5 Flash semantic audit |

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js 18.0.0 or higher
- npm or bun

### 1. Clone the Repository
```bash
git clone <repository-url>
cd furniture-return-analyser
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```

*(Optional)* Add your Google Gemini API key to enable AI-assisted semantic teardowns. The platform operates 100% autonomously using its deterministic expert rule engine even without an API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000` with live API proxying and Vite middleware.

---

## 📦 Production Build & Deployment

To compile client assets and create a production-ready server bundle:

```bash
npm run build
```

This script:
1. Validates TypeScript types across the entire project (`tsc`).
2. Bundles the React SPA into static assets in `dist/`.
3. Compiles `server.ts` into a standalone Node.js production server in `dist/server.cjs`.

### Running in Production
```bash
npm start
```
The server will bind to port `3000` (or `process.env.PORT`) serving both static client assets and `/api/*` endpoints.

---

## 🛡️ Enterprise Risk Register & Mitigations

| Risk ID | Identified Risk | Impact | Pre-Engineered Fail-Safe |
| :--- | :--- | :--- | :--- |
| **RISK-01** | False Positive Defect (wrongly charging supplier) | High | Multi-source evidence threshold ($\ge 80\%$) + human QA engineer sign-off required for supplier chargebacks. |
| **RISK-02** | Missing Warehouse Inspection Findings | High | Automatically penalizes confidence score into `UNKNOWN / INSUFFICIENT_EVIDENCE` instead of guessing. |
| **RISK-03** | Data Bias Toward High-Volume SKUs | Medium | Normalizes priority ranking by SKU unit sales volume and isolates unit return rate. |
| **RISK-04** | Inaccurate Logistics Emission Estimates | Medium | Exposes configurable DEFRA / EPA standards in the engine calibration panel (`SettingsModal`). |
| **RISK-05** | Ambiguous Customer Descriptions | Medium | Fallback state prompts customer for mandatory photos before 2-man truck roll dispatch. |

---

## ❓ Frequently Asked Questions & Troubleshooting

#### Q: Does the system require an active internet connection or Gemini API key to operate?
**A:** No. The platform features an autonomous, deterministic multi-source rule engine. The Gemini API integration is an optional enhancement for deep natural language extraction on ambiguous descriptions.

#### Q: How can we customize the emissions calculation for our local delivery fleet?
**A:** Click the **Gear icon** in the navigation header or the **CALIBRATE** link in the persona ribbon. Navigate to the `[EMISSIONS_&_COST_FACTORS]` tab and select your standard (DEFRA 2026, EPA Class 4, or custom kg $\text{CO}_2\text{e}$ per km). Click *"Apply & Recalibrate"* to re-index all loaded records.

#### Q: Can we import our own company return records?
**A:** Yes. Navigate to the **Returns Explorer** tab, click **`[IMPORT_CSV]`**, and select your CSV file. The system validates the columns, executes real-time multi-source classification on each record, and updates all analytical views immediately.

---

## 📜 License & Governance

Private Enterprise Release &bull; Reverse Logistics & Sustainability Engineering Division &bull; Built with Google AI Studio.
