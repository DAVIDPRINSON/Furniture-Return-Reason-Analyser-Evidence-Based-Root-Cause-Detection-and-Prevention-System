# Furniture Return Reason Analyser
### Evidence-Based Root Cause Detection & Multi-Objective Reverse Logistics Optimization

A high-density, forensic intelligence platform engineered to transform ambiguous, unstructured bulky furniture returns into actionable engineering, packaging, and supply-chain proof.

---

## 🎯 Executive Problem Statement

Bulky furniture returns represent one of the most expensive and carbon-intensive segments in modern retail logistics. When customers initiate a return, care agents frequently assign generic bucket codes such as `"Defective"` or `"Customer Remorse"`. 

This superficial classification obscures critical root causes:
- **Structural Engineering vs Transit Shock:** Was a fractured dining table joint caused by insufficient dowel shear strength or a drop impact during carrier transit?
- **Packaging Failure vs Inadequate Cushioning:** Did a bookshelf corner shatter because the supplier used 15mm low-density EPS foam instead of 50mm high-density molded EPE caps?
- **Assembly Confusion vs Defective Parts:** Did the customer return a wardrobe because cam-lock pins were reversed during DIY assembly rather than manufactured incorrectly?

The **Furniture Return Reason Analyser** solves this by performing multi-source evidence fusion—correlating raw customer feedback text, certified warehouse physical teardowns, CAD dimensional tolerances, DEFRA emission factors, and historical SKU defect patterns.

---

## ⚡ Key Platform Capabilities

### 1. Forensic Command Dashboard (`Dashboard.tsx`)
- High-density KPI telemetry displaying Total Loss (`₹ Lakhs`), Preventability Rate (`%`), Return Volume, and Reverse Logistics Emissions (`MT CO2e`).
- Multi-dimensional distribution charts (by Category, Resolution Cost, Preventability Status, and Product Families).
- Real-time detection of high-risk SKUs and packaging failure hot-spots.

### 2. Multi-Source Evidence Returns Explorer (`ReturnsExplorer.tsx`)
- Tabular telemetry grid indexing 650+ synthetic bulky furniture return records.
- Advanced filtering across Return Reason, Certified Inspection Findings, Preventability Status, and SKU families.
- Instant CSV export and custom bulk CSV data ingestion supporting real enterprise ERP schemas.

### 3. Forensic Root Cause Explorer (`RootCauseExplorer.tsx`)
- Granular diagnostic engine evaluating canonical furniture failure archetypes:
  - Dowel joint tear-out under eccentric load
  - Single-wall corrugated carton puncture
  - Cam-lock reversed alignment during DIY assembly
  - Transit drop damage and edge-crush failure
  - Fabric dye-lot mismatch under home lighting
- Direct correlation between root cause and recommended Engineering Change Orders (ECO).

### 4. Multi-Objective Trade-Off Optimizer (`TradeOffAnalysis.tsx`)
Balances four competing operational objectives across every return:
$$\text{Objective} = \min(\text{Financial Cost}) \times \min(\text{Turnaround SLA}) \times \min(\text{Carbon Emissions}) \times \max(\text{Customer Reliability})$$
- Dynamically compares 4 resolution channels:
  1. **Local Certified Technician Dispatch** (On-site repair / hardware replacement)
  2. **Express Hardware / Component Drop-Ship** (Missing screws, drawer slides)
  3. **Mandatory Pre-Dispatch Photo Triage** (Prevents negative salvage freight rolls)
  4. **Full 2-Man Freight Truck Roll & Replacement** (Severe structural defects)

### 5. Product-Team Validation Station (`ValidationWorkflow.tsx`)
- Human-in-the-loop review station for Senior Quality & Reliability Engineers.
- Validate, calibrate, or dispute automated machine classifications.
- Direct feedback loop recording reviewer notes and enforcing supplier chargeback penalties.

### 6. Simulation Studio & A/B Experimentation (`ExperimentView.tsx`)
- Run predictive "what-if" simulations on operational interventions:
  - Upgrading cartons from 32 ECT single-wall to 200# burst test double-wall corrugated
  - Inserting 45-second 3D interactive assembly QR guides
  - Implementing mandatory doorway/room AR fitment checkers before checkout
- Calculate projected ROI, capital expenditure break-even periods, and net avoided CO2e.

### 7. Disagreement & Error Analysis (`ErrorAnalysisView.tsx`)
- Confusion matrix identifying discrepancies between customer-reported claims and physical warehouse teardown inspections.
- Uncovers "hidden preventability" where customer claims of remorse conceal packaging or hardware defects.

### 8. Automated Test Harness (`TestHarnessView.tsx`)
- Interactive test suite validating deterministic classification against challenging edge cases:
  - Ambiguous / multi-clause customer feedback
  - Conflicting customer claims vs warehouse evidence
  - Missing inspection telemetry
  - Out-of-bounds dimensions and extreme weights

### 9. Data Ingestion Hygiene Auditor (`DataQualityView.tsx`)
- Automated schema audit scoring dataset health:
  - Primary key duplicate collision checks
  - Negative cost and zero-mass anomaly flags
  - Malformed dimension strings (`LxWxH`)
  - Missing warehouse teardown audit percentages

### 10. Executive Strategy Brief (`ExecutiveBrief.tsx`)
- Executive memorandum formatted for Steering Committees and VP-level reviews.
- Formulates a concrete 30-60-90 day execution roadmap.
- One-click text export and print-ready executive memo.

### 11. Methodology & Taxonomy Register (`MethodologyView.tsx`)
- Transparent documentation of multi-source evidence scoring formulas:
  - Customer NLP feedback weight (25%)
  - Physical inspection weight (35%)
  - Product specs & CAD tolerances (15%)
  - Listing & swatch attributes (10%)
  - SKU historical defect rate (10%)
  - Human validation weight (5%)
- Full risk mitigation register and 12-category canonical taxonomy reference.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.8, Vite 6 |
| **Styling & Design System** | Tailwind CSS v4 (High-Density Monospace Aesthetic) |
| **Icons & Visuals** | Lucide React, JetBrains Mono typography |
| **Data Visualization** | Recharts (Cartesian Charts, Bar, Area, Pie, Radar) |
| **Backend & API Server** | Node.js with Express 4, `tsx` for development |
| **Build & Bundler** | Vite (Client) + `esbuild` (Server CJS bundle) |
| **AI Intelligence** | Server-side `@google/genai` (Gemini API) with deterministic fallback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or bun

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd furniture-return-analyser
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from the example template:
```bash
cp .env.example .env
```

Set your optional Gemini API key (the application functions seamlessly using rule-based classification even without an API key):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Start Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000` with full hot-module reload for client assets and live Express API endpoints.

---

## 📦 Production Build & Deployment

To compile client assets and bundle the standalone Express server:

```bash
npm run build
```

This compiles:
1. Static client bundle into `dist/`
2. Standalone server bundle into `dist/server.cjs`

Launch the production server:
```bash
npm start
```

---

## 📊 Canonical Return Categories

The system standardizes all furniture returns into 12 canonical categories:
1. `PRODUCT_DEFECT` (Manufacturing flaws, material weaknesses)
2. `PRODUCT_DAMAGE` (Physical damage requiring structural vs transit triage)
3. `PACKAGING_FAILURE` (Crushed cartons, punctured corners, burst strapping)
4. `DELIVERY_DAMAGE` (Carrier drop impact, transit mishandling)
5. `MISSING_PART` (Absent hardware, screws, brackets, cushions)
6. `ASSEMBLY_DIFFICULTY` (Ambiguous manual, reversed fasteners)
7. `SIZE_OR_DIMENSION_MISMATCH` (Doorway or floor clearance mismatch)
8. `COLOR_OR_FINISH_MISMATCH` (Monitor calibration vs actual stain)
9. `COMFORT_OR_ERGONOMICS` (Cushion firmness, lumbar curvature)
10. `BUYER_REMORSE` (Unprompted change of mind)
11. `LATE_DELIVERY` (Shipment delayed beyond acceptable SLA)
12. `INCORRECT_ITEM_SENT` (Fulfillment picker SKU mismatch)

---

## 🛡️ License

Private enterprise release &bull; Built with Google AI Studio &bull; Reverse Logistics Operations Division.
