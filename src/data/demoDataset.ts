import { ReturnRecord } from "../types";
import { analyzeReturnRecord } from "../services/analyzer";

interface ProductTemplate {
  sku: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  dimensions: string;
  listingTitle: string;
  listingDesc: string;
}

const PRODUCT_CATALOG: ProductTemplate[] = [
  {
    sku: "FUR-DIN-101",
    name: "Nordic Solid Oak 6-Seater Dining Table",
    category: "Dining Table",
    price: 34999,
    weight: 48,
    dimensions: "180x90x76 cm",
    listingTitle: "Nordic Solid Oak 6-Seater Dining Table",
    listingDesc: "Crafted from 100% natural European oak with polyurethane lacquer. Requires 2-person assembly.",
  },
  {
    sku: "FUR-CHR-204",
    name: "ErgoPro High-Back Mesh Office Chair",
    category: "Office Chair",
    price: 14500,
    weight: 18,
    dimensions: "65x65x120 cm",
    listingTitle: "ErgoPro Lumbar Support Executive Office Chair",
    listingDesc: "Breathable Korean mesh with 3D adjustable armrests and Class 4 gas lift.",
  },
  {
    sku: "FUR-SOF-308",
    name: "Haven Deep-Seat 3-Seater Fabric Sofa",
    category: "Sofa",
    price: 46999,
    weight: 62,
    dimensions: "210x95x88 cm",
    listingTitle: "Haven Deep-Seat 3-Seater Fabric Sofa - Slate Grey",
    listingDesc: "High-resiliency foam cushions over pocket spring core with stain-resistant weave.",
  },
  {
    sku: "FUR-BED-402",
    name: "Aura King Size Sheesham Platform Bed",
    category: "Bed Frame",
    price: 38500,
    weight: 75,
    dimensions: "205x190x105 cm",
    listingTitle: "Aura Solid Sheesham Wood King Bed with Geometric Headboard",
    listingDesc: "Solid hardwood construction with steel central support girder and slat base.",
  },
  {
    sku: "FUR-BKS-505",
    name: "Moderna 5-Tier Industrial Bookshelf",
    category: "Bookshelf",
    price: 11999,
    weight: 28,
    dimensions: "80x35x180 cm",
    listingTitle: "Moderna 5-Tier Industrial Open Bookshelf with Metal Frame",
    listingDesc: "Matte black powder-coated steel uprights with rustic engineered wood shelves.",
  },
  {
    sku: "FUR-WRD-610",
    name: "Grand Walnut 3-Door Hinged Wardrobe",
    category: "Wardrobe",
    price: 54000,
    weight: 95,
    dimensions: "150x60x210 cm",
    listingTitle: "Grand Walnut 3-Door Hinged Wardrobe with Internal Drawers",
    listingDesc: "Spacious multi-compartment wardrobe with mirror panel and soft-close German hinges.",
  },
  {
    sku: "FUR-TVU-707",
    name: "Sleekline Fluted Wood TV Unit",
    category: "TV Unit",
    price: 18999,
    weight: 34,
    dimensions: "160x42x50 cm",
    listingTitle: "Sleekline Fluted Wood Low-Profile TV Credenza (Up to 70-inch TVs)",
    listingDesc: "Cable-management grommets with fluted tambour door sliders and solid wooden tapered legs.",
  },
  {
    sku: "FUR-CFT-812",
    name: "Zenith Oval Glass Coffee Table",
    category: "Coffee Table",
    price: 12500,
    weight: 22,
    dimensions: "110x60x45 cm",
    listingTitle: "Zenith Oval Tempered Glass Coffee Table with Solid Teak Base",
    listingDesc: "10mm beveled tempered glass top supported by an intertwined sculptural teak tripod.",
  },
  {
    sku: "FUR-CAB-915",
    name: "Heritage 2-Door Bar & Crockery Cabinet",
    category: "Cabinet",
    price: 26999,
    weight: 44,
    dimensions: "90x45x140 cm",
    listingTitle: "Heritage Solid Wood Bar Cabinet with Wine Glass Racks",
    listingDesc: "Handcrafted brass pull hardware with dual tier adjustable shelves and wine bottle matrix.",
  },
  {
    sku: "FUR-MAT-020",
    name: "CloudRest Orthopedic Memory Foam Mattress (King)",
    category: "Mattress",
    price: 24999,
    weight: 32,
    dimensions: "198x183x25 cm",
    listingTitle: "CloudRest 10-Inch Triple Layer Orthopedic Memory Foam Mattress",
    listingDesc: "Cooling gel memory foam transition layer with zero partner motion disturbance.",
  },
];

interface ReturnScenario {
  prob: number;
  returnText: string[];
  originalReason: string;
  customerAction: string;
  inspectionFinding: string;
  damageType: string;
  damageLocation: string;
  packagingCondition: string;
  deliveryCondition: string;
  pickupRequired: boolean;
  replacementRequired: boolean;
}

const SCENARIOS: ReturnScenario[] = [
  {
    prob: 0.20,
    returnText: [
      "The front corner is chipped and cracked right out of the box. The cardboard corner had a hole in it.",
      "Table arrived with a broken corner, foam corner pad was completely squashed.",
      "Corner dented and veneer chipped during shipping.",
      "The top corner of the unit was smashed in, box was torn at the edge.",
    ],
    originalReason: "Damaged during delivery",
    customerAction: "Uploaded 3 photos of dented corner",
    inspectionFinding: "Crushed front-left corner. EPS corner cap was 15mm thick, fully collapsed.",
    damageType: "Corner Compression",
    damageLocation: "Front Left Corner",
    packagingCondition: "Torn Corner",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: true,
  },
  {
    prob: 0.18,
    returnText: [
      "One of the legs snapped at the joint when we tightened the bolts. Very weak connection.",
      "The joint between the side rail and leg split along the wood seam.",
      "Tenon joint collapsed under mild weight. Wooden dowel snapped in two.",
      "Mortise joint separated with dry brittle glue residue visible.",
    ],
    originalReason: "Defective item",
    customerAction: "Requested replacement part initially then requested full return",
    inspectionFinding: "Tenon joint fractured along adhesive line. Under-specification dowel pin diameter.",
    damageType: "Joint Separation",
    damageLocation: "Leg Mounting Joint",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: true,
  },
  {
    prob: 0.15,
    returnText: [
      "Hardware pack was missing the M8 bolts and hex key. Cannot assemble.",
      "Missing all the connector screws for the bed frame slats.",
      "Blister pack was torn inside the box, three critical brackets were absent.",
      "Hardware bag was completely omitted from box 1 of 2.",
    ],
    originalReason: "Missing parts",
    customerAction: "Contacted customer service requesting hardware pack",
    inspectionFinding: "Hardware blister pouch incomplete. 6 of 18 connection bolts absent.",
    damageType: "Missing Fasteners",
    damageLocation: "Hardware Pack",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: false,
    replacementRequired: false,
  },
  {
    prob: 0.12,
    returnText: [
      "Heavy forklift puncture through the shipping crate that gouged the front panel.",
      "Delivery carrier dropped the crate onto driveway. Big dent and cracked frame.",
      "Box was crushed from pallet over-stacking by freight company.",
      "Deep transit impact damage, external cardboard carton split open.",
    ],
    originalReason: "Damaged by carrier",
    customerAction: "Noted damage on driver bill of lading upon delivery",
    inspectionFinding: "Forklift blade puncture penetrating through double-wall outer carton into side panel.",
    damageType: "Transit Impact Puncture",
    damageLocation: "Side Exterior Panel",
    packagingCondition: "Crushed",
    deliveryCondition: "Rough Transit",
    pickupRequired: true,
    replacementRequired: true,
  },
  {
    prob: 0.10,
    returnText: [
      "The pre-drilled holes are off by half an inch. Impossible to insert the cam bolts.",
      "Assembly instructions are contradictory between step 3 and step 5.",
      "Steps unclear, manual diagrams are inverted for the left and right slides.",
      "Holes do not align, tried for three hours to assemble the drawer slides.",
    ],
    originalReason: "Cannot assemble",
    customerAction: "Called helpline for assembly assistance then requested return",
    inspectionFinding: "CNC pilot hole offset 7mm out of engineering tolerance. Slat bracket misaligned.",
    damageType: "Tolerance Alignment Defect",
    damageLocation: "Pre-drilled Mounting Holes",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: false,
  },
  {
    prob: 0.08,
    returnText: [
      "Listing description claimed solid hardwood, but it is thin paper veneer over chipboard.",
      "Height listed as 75cm on website but product measures 85cm, does not fit chairs.",
      "Color on website looks warm honey oak, in reality it is dark yellowish walnut.",
      "Listing stated soft-close drawers, but standard friction glides are installed.",
    ],
    originalReason: "Not as described",
    customerAction: "Uploaded side-by-side screenshot of PDP specs vs tape measure",
    inspectionFinding: "Physical dimensions or materials diverge from current published PDP copy.",
    damageType: "Listing Divergence",
    damageLocation: "Overall Specification",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: false,
  },
  {
    prob: 0.07,
    returnText: [
      "Changed my mind. The sofa does not fit our current room aesthetic.",
      "Ordered two colors (Blue and Beige) to see which looks better. Keeping Beige, returning Blue.",
      "No longer need this table, family decided to move to a smaller apartment.",
      "Style preference changed after seeing it in the room.",
    ],
    originalReason: "Changed mind",
    customerAction: "Initiated return within 48 hours of delivery",
    inspectionFinding: "Unopened original factory packaging with seals fully intact.",
    damageType: "None",
    damageLocation: "None",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: false,
  },
  {
    prob: 0.05,
    returnText: [
      "The sofa is way too big for our hallway corner, we couldn't get it inside the door.",
      "Table is too wide for our dining nook, my husband measured the doorway wrong.",
      "Customer mistakenly drilled through top face of table with own high-torque drill.",
      "Customer attempted to modify legs with a hand saw.",
    ],
    originalReason: "Does not fit / Customer issue",
    customerAction: "Requested urgent return after failed entryway passage",
    inspectionFinding: "Dimensions match published spec 100%. Customer entryway clearance was insufficient.",
    damageType: "Customer Sizing / Tool Damage",
    damageLocation: "Exterior Clearance / Top Face",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: false,
  },
  {
    prob: 0.05,
    returnText: [
      "Not happy with the table.",
      "Unhappy with order.",
      "Returning.",
      "Just not satisfied with this product.",
    ],
    originalReason: "Other / Unspecified",
    customerAction: "Selected generic reason code without comment",
    inspectionFinding: "Pending inspection / no technician notes yet recorded.",
    damageType: "Unverified",
    damageLocation: "Unverified",
    packagingCondition: "Intact",
    deliveryCondition: "Normal",
    pickupRequired: true,
    replacementRequired: false,
  },
];

export function generateDemoReturns(count: number = 650): ReturnRecord[] {
  const records: ReturnRecord[] = [];
  const baseDate = new Date(2026, 7, 1); // Aug 2026

  for (let i = 1; i <= count; i++) {
    const returnId = `RET-${String(2026000 + i)}`;
    const product = PRODUCT_CATALOG[i % PRODUCT_CATALOG.length];

    // Pick a pseudo-random scenario based on probabilities
    const rand = ((i * 17 + 73) % 100) / 100;
    let accumulated = 0;
    let selectedScenario = SCENARIOS[0];
    for (const sc of SCENARIOS) {
      accumulated += sc.prob;
      if (rand <= accumulated) {
        selectedScenario = sc;
        break;
      }
    }

    const textChoice = selectedScenario.returnText[i % selectedScenario.returnText.length];
    const daysOffset = (i * 3) % 35;
    const returnDateObj = new Date(baseDate.getTime() - daysOffset * 24 * 60 * 60 * 1000);
    const returnDate = returnDateObj.toISOString().split("T")[0];

    const distanceKm = 15 + ((i * 13) % 140);
    const pickupCost = 1200 + Math.round((distanceKm * 8.5) + (product.weight * 12));
    const replacementCost = Math.round(product.price * 0.72);
    const refundAmount = selectedScenario.replacementRequired ? 0 : product.price;

    const baseRecord: Partial<ReturnRecord> = {
      return_id: returnId,
      return_date: returnDate,
      product_id: `PRD-${product.sku}`,
      sku: product.sku,
      product_category: product.category,
      product_name: product.name,
      product_price: product.price,
      product_weight: product.weight,
      product_dimensions: product.dimensions,
      return_text: textChoice,
      original_return_reason: selectedScenario.originalReason,
      customer_action: selectedScenario.customerAction,
      listing_title: product.listingTitle,
      listing_description: product.listingDesc,
      assembly_instructions: (i % 7 === 0) ? "Text Only (No Diagrams)" : (i % 11 === 0) ? "Missing Step 4" : "Complete Illustrated Manual",
      product_images_available: (i % 5 === 0) ? 2 : 7,
      inspection_finding: selectedScenario.inspectionFinding,
      damage_type: selectedScenario.damageType,
      damage_location: selectedScenario.damageLocation,
      packaging_condition: selectedScenario.packagingCondition,
      delivery_condition: selectedScenario.deliveryCondition,
      pickup_required: selectedScenario.pickupRequired,
      replacement_required: selectedScenario.replacementRequired,
      refund_amount: refundAmount,
      pickup_cost: pickupCost,
      replacement_cost: replacementCost,
      pickup_time_hours: 12 + ((i * 7) % 48),
      resolution_time_hours: 24 + ((i * 11) % 96),
      estimated_distance_km: distanceKm,
    };

    // Analyze record with rule & scoring engine
    const analysis = analyzeReturnRecord(baseRecord);

    // Add validation history if sample is validated
    const isValidated = i % 4 === 0;
    const isRejected = i % 23 === 0;
    const isNeedsReview = i % 9 === 0;

    let validationStatus: ReturnRecord["validation_status"] = "PENDING_REVIEW";
    if (isValidated) validationStatus = "VALIDATED";
    else if (isRejected) validationStatus = "REJECTED";
    else if (isNeedsReview) validationStatus = "NEEDS_MORE_EVIDENCE";

    const fullRecord: ReturnRecord = {
      ...baseRecord as ReturnRecord,
      analysed_category: analysis.category,
      analysed_root_cause: analysis.root_cause,
      analysed_preventability: analysis.preventability,
      confidence_score: analysis.confidence_score,
      priority_score: analysis.priority_score,
      priority_level: analysis.priority_level,
      evidence_breakdown: analysis.evidence_breakdown,
      evidence_points: analysis.evidence_points,
      recommended_action: analysis.recommended_action,
      is_edge_case: analysis.is_edge_case,
      edge_case_type: analysis.edge_case_type,
      total_cost: analysis.total_cost,
      estimated_co2e_kg: analysis.estimated_co2e_kg,
      validation_status: validationStatus,
      validated_root_cause: isValidated ? analysis.root_cause : undefined,
      product_team_feedback: isValidated
        ? "Engineering team confirmed root cause from physical inspection report."
        : isRejected
        ? "Transit audit suggests carrier dropped crate rather than packaging fault."
        : undefined,
      validation_history: isValidated
        ? [
            {
              id: `VAL-${i}`,
              timestamp: returnDate,
              reviewer: "Elena Vance (Lead Packaging QA)",
              status: "VALIDATED",
              comment: "Confirmed with supplier packaging audit.",
            },
          ]
        : [],
    };

    records.push(fullRecord);
  }

  // Prepend the 4 dedicated edge cases to guarantee they exist with fixed IDs
  records[0] = {
    ...records[0],
    return_id: "RET-EDGE-01",
    return_text: "Not happy with the table.",
    original_return_reason: "Unhappy",
    inspection_finding: "Pending inspection / no technician notes yet.",
    packaging_condition: "Intact",
    delivery_condition: "Normal",
    analysed_category: "UNKNOWN",
    analysed_root_cause: "unknown_root_cause",
    analysed_preventability: "INSUFFICIENT_EVIDENCE",
    confidence_score: 25,
    is_edge_case: true,
    edge_case_type: "Ambiguous Return Text: Insufficient context to infer root cause",
  };

  records[1] = {
    ...records[1],
    return_id: "RET-EDGE-02",
    return_text: "Table arrived completely broken into two pieces, unuseable!",
    original_return_reason: "Broken on arrival",
    inspection_finding: "No structural damage found. Unit assembled perfectly in test bay with no cracks or flaws.",
    packaging_condition: "Intact",
    delivery_condition: "Normal",
    analysed_category: "UNKNOWN",
    analysed_root_cause: "conflicting_evidence",
    analysed_preventability: "INSUFFICIENT_EVIDENCE",
    confidence_score: 42,
    is_edge_case: true,
    edge_case_type: "Conflicting Evidence: Customer claim contradicts warehouse inspection",
  };

  records[2] = {
    ...records[2],
    return_id: "RET-EDGE-03",
    return_text: "The sofa is much larger than expected, does not fit my room at all.",
    original_return_reason: "Too large",
    inspection_finding: "Physical width measured at warehouse is 180cm. Matches listing specification 180cm exactly.",
    packaging_condition: "Intact",
    delivery_condition: "Normal",
    analysed_category: "CUSTOMER_ERROR",
    analysed_root_cause: "customer_measurement_error",
    analysed_preventability: "NOT_PREVENTABLE",
    confidence_score: 84,
    is_edge_case: true,
    edge_case_type: "Customer Fit Error: Listing dimensions verified accurate by inspection",
  };

  records[3] = {
    ...records[3],
    return_id: "RET-EDGE-04",
    return_text: "Leg cracked upon opening carton.",
    original_return_reason: "Damaged",
    inspection_finding: "", // Empty
    packaging_condition: "",
    delivery_condition: "",
    analysed_category: "PRODUCT_DAMAGE",
    analysed_root_cause: "cracked_panel",
    analysed_preventability: "PREVENTABLE",
    confidence_score: 52,
    is_edge_case: true,
    edge_case_type: "Missing Inspection Data: Downscaled confidence",
  };

  return records;
}

export const generateDemoDataset = generateDemoReturns;
