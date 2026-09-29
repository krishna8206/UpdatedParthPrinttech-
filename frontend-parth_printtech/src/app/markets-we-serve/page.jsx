"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMediaUrl } from "@/lib/media";
import styles from "./MarketsWeServe.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Categories Data (8 Items) with CAD Blueprint properties
const categories = [
  {
    id: "pvc-shrink-sleeves",
    num: "01",
    regMark: "REG-PVC-01",
    dim: "Custom Diameter & Height",
    title: "PVC Shrink Sleeves",
    desc: "High-grade PVC shrink sleeve labels offering 360-degree graphics contouring for food, beverage, cosmetics, and household containers.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 2v20M5 7h14M5 17h14" />
      </svg>
    ),
    badge: "360° Graphics",
    bgGradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    accentColor: "#009fe3",
    photo: "/images/products/pvc_shrink_sleeves.png",
    frameShape: "shapeCircle",
    specs: [
      { label: "Substrate", value: "High-Grade PVC Film" },
      { label: "Shrinkage Rate", value: "Up to 50% - 58%" },
      { label: "Print Process", value: "Rotogravure / High-Def Flexo" },
      { label: "Material Thickness", value: "35 to 50 Microns" }
    ]
  },
  {
    id: "petg-shrink-sleeves",
    num: "02",
    regMark: "REG-PETG-02",
    dim: "Custom Contour Fit",
    title: "PETG Shrink Sleeves",
    desc: "Premium eco-friendly polyester shrink sleeves with maximum shrinkage percentage for highly contoured beverage and aerosol bottles.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    badge: "Eco Clarity",
    bgGradient: "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)",
    accentColor: "#e3007b",
    photo: "/images/products/petg_shrink_sleeves.jpg",
    frameShape: "shapeWrap",
    specs: [
      { label: "Substrate", value: "Recyclable PET G Film" },
      { label: "Shrinkage Rate", value: "Up to 70% - 78% Max" },
      { label: "Print Process", value: "Narrow-Web Gravure / UV Flexo" },
      { label: "Sustainability", value: "100% Recyclable / Low Carbon" }
    ]
  },
  {
    id: "bopp-wrap-around-labels",
    num: "03",
    regMark: "REG-BOPP-03",
    dim: "Roll Format / Cut-and-Stack",
    title: "BOPP Wrap-Around Labels",
    desc: "High-speed roll-fed BOPP wrap-around labels with superior water and scuff resistance, ideal for mineral water and carbonated drinks.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 12h10M12 7v10" />
      </svg>
    ),
    badge: "Waterproof",
    bgGradient: "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)",
    accentColor: "#ffd400",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 05_07_28 PM.png",
    frameShape: "shapeHexagon",
    specs: [
      { label: "Substrate", value: "BOPP (Natural & Pearlised)" },
      { label: "Film Thickness", value: "35 to 50 Microns" },
      { label: "Print Process", value: "Gravure" },
      { label: "Adhesive Match", value: "Hot-Melt Glue System Compatible" }
    ]
  },
  {
    id: "heat-transfer-labels",
    num: "04",
    regMark: "REG-HTL-04",
    dim: "Custom Fusion Profile",
    title: "Heat Transfer Labels (HTL)",
    desc: "Dry-fusion decoration labels that permanently bond graphics to plastic containers, creating a seamless, scratch-proof 'no-label' look.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    badge: "Dry Fusion",
    bgGradient: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)",
    accentColor: "#009fe3",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 03_08_38 PM.png",
    frameShape: "shapeCad",
    specs: [
      { label: "Carrier Film", value: "Specially Coated PET Carrier" },
      { label: "Ink System", value: "Fully UV Cured / Scratch-Proof" },
      { label: "Fusion Temp", value: "130°C to 180°C" },
      { label: "Application Tech", value: "Heat & Press Fusion Roller" }
    ]
  },
  {
    id: "plain-pvc-shrink-film",
    num: "05",
    regMark: "REG-PVC-05",
    dim: "Custom Roll Width & Length",
    title: "Plain PVC Shrink Film",
    desc: "Premium unprinted PVC shrink film rolls for manual or automated wrapping, offering superior clarity, uniform shrinkage, and strong seals.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    badge: "Plain Film",
    bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    accentColor: "#4f46e5",
    photo: "/images/products/plain_pvc_shrink_film.jpg",
    frameShape: "shapeWrap",
    specs: [
      { label: "Substrate", value: "Premium Grade Plain PVC" },
      { label: "Shrinkage Rate", value: "Up to 40% - 45%" },
      { label: "Format", value: "Roll Form & Cut Pieces (As per Requirement)" },
      { label: "Layflat Range", value: "30mm to 600mm" }
    ]
  }
];

// Industries Data (6 Items)
const industries = [
  {
    id: "food-bev",
    name: "Food & Beverage",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    desc: "Eco-kraft squeeze bottles, wet-strength labels, and direct moisture resistant stickers."
  },
  {
    id: "cosmetics",
    name: "Cosmetics & Beauty",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10M2 12h20" />
      </svg>
    ),
    desc: "Chic matte clear laminations, metallic foil seals, and soft-touch textures."
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    desc: "Vial syringes, pharmaceutical batch codes, and tamper-evident vaccine security tags."
  },
  {
    id: "retail",
    name: "Retail",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    desc: "Luxury hang tags, barcode pricing stickers, and adhesive gift seals."
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    desc: "High-temperature components, warning plates, and product asset tracking codes."
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    desc: "Logistical shipping boxes, pallets, inventory stickers, and heavy load transit markers."
  }
];

// Featured Product Showcase Data
const featuredProducts = [
  {
    id: "pvc-shrink-sleeves",
    title: "360° Shrink Graphics",
    desc: "Vibrant, full-body graphics that conform perfectly to complex container geometries without distortion.",
    metric: "360-degree coverage",
    accent: "#009fe3",
    photo: "/images/products/pvc_shrink_sleeves.png"
  },
  {
    id: "petg-shrink-sleeves",
    title: "Recyclable PETG Clarity",
    desc: "Ultra-clear polyester films offering extreme shrinkage profiles and minimal carbon footprint for sustainability.",
    metric: "100% Recyclable Polyester",
    accent: "#e3007b",
    photo: "/images/products/petg_shrink_sleeves.jpg"
  },
  {
    id: "bopp-wrap-around-labels",
    title: "High-Speed Hot-Melt Dispensing",
    desc: "Tensile-strength biaxially-oriented polypropylene roll-fed labels designed for seamless high-speed Hot-Melt labeling lines.",
    metric: "Zero-tear rotary speed",
    accent: "#ffd400",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 05_07_28 PM.png"
  },
  {
    id: "heat-transfer-labels",
    title: "Permanent Dry-Fusion Finish",
    desc: "Direct decoration fused into plastic packaging with heat and pressure, leaving no sticky residue or label edges.",
    metric: "Chemical & scratch-proof",
    accent: "#009fe3",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 03_08_38 PM.png"
  },
  {
    id: "plain-pvc-shrink-film",
    title: "Plain PVC Shrink Film Rolls",
    desc: "Super-clear unprinted PVC shrink films offering high dust/humidity protection and low-temperature uniform shrinkage.",
    metric: "High-speed wrap stability",
    accent: "#4f46e5",
    photo: "/images/products/plain_pvc_shrink_film.jpg"
  }
];

// Why Choose Us Grid
const whyChooseUs = [
  {
    title: "High-Quality Printing",
    desc: "Every order undergoes micro-dot registration validation to match color calibration points.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M22 12h-4M6 12H2M12 2v4M12 18v4" />
      </svg>
    )
  },
  {
    title: "Fast Turnaround",
    desc: "Pre-flight digital approvals processed in hours, with standard orders dispatching in 3–5 business days.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    title: "Custom Sizes & Shapes",
    desc: "Digital laser die-cut technology creates complex, custom silhouettes without expensive die setups.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h18v18H3z" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    )
  },
  {
    title: "Premium Materials",
    desc: "Direct access to textured cotton linen, transparent vinyls, kraft sheets, and protective laminations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    title: "Bulk Order Support",
    desc: "Structured B2B scaling parameters providing significant cost efficiencies for millions of labels.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    title: "Nationwide Delivery",
    desc: "Logistics configurations synchronized with primary shipping routes to ensure punctual site delivery.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    )
  }
];

// Workflow Steps
const workflowSteps = [
  { step: "01", title: "Choose Product", desc: "Select catalog templates, structural styles, roll setups, or customize labels." },
  { step: "02", title: "Upload Artwork", desc: "Drag and drop your vector design assets (PDF, AI, or EPS) directly to our server." },
  { step: "03", title: "Customize Options", desc: "Select specific substrate materials, grades, size contours, and specialty finishes." },
  { step: "04", title: "Approve Design", desc: "Receive high-fidelity digital proofs calibrated by our pre-flight engineering teams." },
  { step: "05", title: "Print Production", desc: "Your order goes to high-capacity rotogravure printing presses." },
  { step: "06", title: "Delivery", desc: "Securely packed rolls or die-cut label sheets ship directly to your site location." }
];

// Success Metrics
const metrics = [
  { id: "orders", target: 10000, suffix: "+", label: "Orders Completed" },
  { id: "clients", target: 2500, suffix: "+", label: "Happy Clients" },
  { id: "sat", target: 99, suffix: "%", label: "Customer Satisfaction" },
  { id: "ind", target: 50, suffix: "+", label: "Industries Served" }
];

// Popular Searches Tags
const popularSearches = [
  "Waterproof Labels",
  "Food Labels",
  "Bottle Stickers",
  "Barcode Labels",
  "QR Labels",
  "Custom Packaging Labels"
];

// Product Uses Data Array
const productUsesData = [
  {
    id: "use-beverage-bottles",
    category: "Bottles & Beverage",
    title: "360° Full-Body Contour Shrink Sleeves",
    subtitle: "Beverage Bottles & Liquid Containers",
    badge: "Full Body Branding",
    accentColor: "#009fe3",
    photo: "/images/products/pvc_shrink_sleeves.png",
    containerType: "PET, Glass & HDPE Bottles",
  
    uses: [
      "Mineral Water & Soda Bottles",
      "Fresh Fruit Juices & Energy Drinks",
      "Flavored Milk & Dairy Drinks",
      "Liquor & Craft Beer Bottles"
    ],
    hotspots: [
      { badge: "Neck Seal", detail: "Tamper-evident shrink band with easy-open perforation." },
      { badge: "Body Contour", detail: "58%-78% shrink ratio contouring complex bottle curves." },
      { badge: "Base Anchor", detail: "Clean bottom edge seal without distortion." }
    ],
    specs: [
      { label: "Shrink Ratio", value: "50% - 78% (PVC / PETG)" },
      { label: "Thickness", value: "35 - 50 Microns" },
      { label: "Print Process", value: "9-Color Rotogravure / Flexo" },
      { label: "Durability", value: "100% Waterproof & Scuff Proof" }
    ]
  },
  {
    id: "use-bopp-wrap",
    category: "Bottles & Beverage",
    title: "High-Speed BOPP Roll-Fed Wrap Labels",
    subtitle: "High-Volume Mineral Water & Soda Bottling",
    badge: "High-Speed Rotary",
    accentColor: "#ffd400",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 05_07_28 PM.png",
    containerType: "PET Cylindrical Bottles",

    uses: [
      "Packaged Mineral Water (200ml - 2L)",
      "Carbonated Soft Drink Bottles",
      "Edible Oil Cylindrical PET Bottles",
      "High-Speed Automated Bottling Lines"
    ],
    hotspots: [
      { badge: "Overlap Seam", detail: "Hot-melt adhesive seam resistant to bottle expansion." },
      { badge: "High Tension", detail: "Tensile BOPP film prevents tearing at 800 BPM speed." },
      { badge: "Barcode Zone", detail: "High-density QR & UPC barcode scanning clarity." }
    ],
    specs: [
      { label: "Substrate", value: "BOPP (Natural & Pearlised)" },
      { label: "Thickness", value: "35 - 45 Microns" },
      { label: "Print Process", value: "Gravure" },
      { label: "Cost Profile", value: "Lowest Cost Per Unit for Bulk" }
    ]
  },
  {
    id: "use-cosmetic-jars",
    category: "Jars, Tubs & Creams",
    title: "Dry-Fusion Heat Transfer Labels (HTL)",
    subtitle: "Cosmetics, Personal Care & Luxury Jars",
    badge: "Seamless Fusion",
    accentColor: "#e3007b",
    photo: "/images/products/ChatGPT Image Sep 18, 2026, 03_08_38 PM.png",
    containerType: "PP, PE, Acrylic & Glass Jars",
   
    uses: [
      "Face Cream & Skin Lotion Jars",
      "Shampoo & Body Wash Squeeze Tubes",
      "Cosmetic Compact Powder Containers",
      "Premium Wet Wipe Tubs"
    ],
    hotspots: [
      { badge: "Zero Border", detail: "No visible label edge – looks like direct screen printing." },
      { badge: "Oil Barrier", detail: "Resistant to essential oils, lotions, and chemical soaps." },
      { badge: "Satin Touch", detail: "Tactile foil and satin matte lamination finish." }
    ],
    specs: [
      { label: "Carrier Film", value: "Release Coated PET Carrier" },
      { label: "Fusion Temp", value: "140°C - 180°C Dry Heat" },
      { label: "Color Match", value: "Pantone Metallic & Soft Pastels" },
      { label: "Adhesion", value: "Permanent Molecular Bond" }
    ]
  },
  {
    id: "use-pharma-vials",
    category: "Vials & Healthcare",
    title: "Tamper-Evident Neck Seals & Code Labels",
    subtitle: "Pharma Vials, Syringes & Vaccine Bottles",
    badge: "Healthcare Grade",
    accentColor: "#10b981",
    photo: "/images/products/petg_shrink_sleeves.jpg",
    containerType: "Glass Vials, PET Syrup Bottles & Syringes",
   
    uses: [
      "Vaccine Vials & Injectable Syringes",
      "Cough Syrup & Pharmaceutical Bottles",
      "Nutraceutical Supplement Jars",
      "Diagnostic Test Tube Packaging"
    ],
    hotspots: [
      { badge: "Tamper Guard", detail: "Perforated neck band tears instantly if cap is opened." },
      { badge: "Batch Spot", detail: "Dedicated white backdrop for laser batch & EXP codes." },
      { badge: "Sterile Stable", detail: "Holds integrity during steam & gamma sterilization." }
    ],
    specs: [
      { label: "Compliance", value: "US FDA / Pharma Grade" },
      { label: "Precision", value: "Micron-Accurate Cap Mold Fit" },
      { label: "Security", value: "Holographic / Micro-Text Option" },
      { label: "Temp Rating", value: "Resistant down to -80°C" }
    ]
  },
  {
    id: "use-chemical-jugs",
    category: "Chemicals & Industrial",
    title: "Scuff-Proof Chemical & Lube Container Labels",
    subtitle: "Industrial Drums, Oil Cans & Agrochemical Jugs",
    badge: "Industrial Duty",
    accentColor: "#f59e0b",
    photo: "/images/products/plain_pvc_shrink_film.jpg",
    containerType: "HDPE Jerricans, Drums & Lubricant Cans",
    uses: [
      "Motor Oil & Engine Lubricant Cans",
      "Agrochemical & Pesticide Bottles",
      "Household Detergent & Cleaner Jugs",
      "Industrial Chemical Solvent Drums"
    ],
    hotspots: [
      { badge: "Heavy Tack", detail: "Extra permanent glue engineered for textured HDPE plastic." },
      { badge: "Chemical Guard", detail: "Over-laminated film shields against chemical spills." },
      { badge: "GHS Standard", detail: "GHS hazard warning pictograms in crisp, fade-free ink." }
    ],
    specs: [
      { label: "UV Warranty", value: "2+ Years Outdoor Fastness" },
      { label: "Substrate", value: "Vinyl / Laminated Polypropylene" },
      { label: "Adhesive", value: "Extra Permanent Solvent Acrylic" },
      { label: "Durability", value: "Acid, Solvent & Weather Proof" }
    ]
  },
  {
    id: "use-aerosol-cans",
    category: "Cans & Aerosols",
    title: "Contour PETG Sleeves for Aerosol Cans",
    subtitle: "Personal Deodorants, Sprays & Metal Cans",
    badge: "Metal Can Branding",
    accentColor: "#8b5cf6",
    photo: "/images/products/petg_shrink_sleeves.jpg",
    containerType: "Aluminum Cans & Tinplate Aerosols",

    uses: [
      "Body Sprays & Deodorant Cans",
      "Hair Spray & Shaving Cream Cans",
      "Automotive Spray Paint Canisters",
      "Insecticide & Air Freshener Sprays"
    ],
    hotspots: [
      { badge: "Dome Fit", detail: "Reaches top dome curvature smoothly without wrinkles." },
      { badge: "Metallic Shine", detail: "Vibrant metallic inks mimic direct metal printing." },
      { badge: "Seam Guard", detail: "Covers metal weld line seamlessly for premium look." }
    ],
    specs: [
      { label: "Shrink Ratio", value: "Up to 78% Max Shrinkage" },
      { label: "Substrate", value: "Recyclable PET G Film" },
      { label: "Heat Process", value: "Tunnel Shrink Optimized" },
      { label: "Visual Effect", value: "3D Holographic & Foil Finishes" }
    ]
  }
];

// SEO Educational Blocks Fallback
const defaultSeoBlocks = [
  {
    heading: "Why Quality Labels Matter",
    content: "First impressions are critical. Whether your products sit on retail shelves or navigate complex shipping networks, the quality of your label represents the standard of your brand. As a leading label manufacturer and label supplier, Parth Printtech provides professional label printing that ensures high-contrast barcodes, rich colors, and durable adhesion. High-quality sticker printing is not just an aesthetic addition—it is a core component of your product's packaging labels and logistical success."
  },
  {
    heading: "Label Types We Offer",
    content: "We manufacture a comprehensive array of custom labels calibrated for diverse applications. For automatic packaging lines, our roll labels offer high-speed compatibility and seamless dispensing. For asset tracking and inventory management, our high-contrast barcode labels and thermal labels deliver smudge-free clarity. For logistics and dispatch, our pre-cut shipping labels are compatible with all major carriers. We also offer waterproof product labels, cosmetics stickers, food-safe adhesives, and custom sticker printing options tailored to your dimensions."
  },
  {
    heading: "Industries We Serve",
    content: "Parth Printtech serves a vast range of sectors, providing bespoke labeling solutions for: Food & Beverage (damp-proof & grease-resistant), Cosmetics & Beauty (luxury soft-touch laminations and hot foil accents), Healthcare & Pharmaceuticals (tamper-evident security tags), Retail & Apparel (premium product identification), and Logistics & Warehousing (high-durability barcode labels)."
  },
  {
    heading: "Customization Options",
    content: "Every brand is unique, which is why we offer extensive material options and customization capabilities. Choose from waterproof BOPP vinyl, eco-friendly kraft papers, metallic foils, or clear transparent sheets for a 'no-label' look. Our printing technologies include high-fidelity gravure printing and precision digital printing. You can select custom shapes, sizes, adhesive strengths (permanent, removable, or freezer-grade), and matte or glossy protective laminations."
  },
  {
    heading: "Why Choose Our Label Printing Services",
    content: "At Parth Printtech, we integrate state-of-the-art machinery with strict quality checks to ensure your designs are printed with absolute registration and color accuracy. With fast turnaround times, low minimum order quantities, and custom packaging support, we scale from boutique pilot runs to millions of units. We are committed to being your trusted label supplier, delivering nationwide logistics and direct bulk pricing."
  }
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

const defaultHeroMockups = [
  {
    tag: "BEVERAGE & FMCG SOLUTIONS",
    tagColor: "#009fe3",
    tagBg: "#e0f2fe",
    code: "REG-BOPP-03",
    title: "High-Speed Roll-Fed & Shrink Packaging",
    text: "Waterproof, scuff-proof & high-tension rotary roll-fed application",
    badge: "9-Color Gravure",
    photo: "/images/products/bopp_label.png"
  },
  {
    tag: "360° SHRINK SLEEVES",
    tagColor: "#059669",
    tagBg: "#ecfdf5",
    code: "REG-PVC-01",
    title: "PVC & PETG Sleeves",
    text: "58% to 78% high-contour heat shrink fit for bottles and jars",
    badge: "360° Fit",
    photo: "/images/products/pvc_shrink_sleeves.png"
  },
  {
    tag: "HEAT TRANSFER (HTL)",
    tagColor: "#e3007b",
    tagBg: "#fdf2f8",
    code: "REG-HTL-04",
    title: "Heat Transfer Labels",
    text: "Permanent molecular bond & scratch-proof finish",
    badge: "Dry Fusion",
    photo: "/images/products/htl_paint_pails.png"
  }
];

const resolvePhoto = (src, fallback = "/images/products/pvc_shrink_sleeves.png") => {
  return getMediaUrl(src, fallback);
};

const PremiumMarketsWeServe = () => {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  // Active chip category
  const [activeChip, setActiveChip] = useState("All");

  // Pro-Level Product Uses State
  const [activeUseTab, setActiveUseTab] = useState("All");

  // Counter states
  const [counts, setCounts] = useState({
    orders: 0,
    clients: 0,
    sat: 0,
    ind: 0
  });

  const [marketsData, setMarketsData] = useState({
    hero: {
      badge: "MARKETS & APPLICATIONS",
      title: "Packaging & Label Solutions",
      titleHighlight: "For Every Industry",
      description: "Precision-engineered labels and shrink sleeves designed for durability, visual impact, and seamless application across high-speed commercial production lines.",
      image1: "/images/products/bopp_label.png",
      image2: "/images/products/pvc_shrink_sleeves.png",
      image3: "/images/products/htl_paint_pails.png",
      mockups: defaultHeroMockups
    },
    catalogHeader: {
      subtitle: "MARKETS WE SERVE CATALOG",
      title: "Browse Printing Categories",
      description: "Explore our custom layout and structural label profiles engineered to wrap beautifully on any packaging geometry."
    },
    categories: categories,
    industryHeader: {
      subtitle: "Industry Vertical Solutions",
      title: "Engineered for Every Segment",
      description: "From regulatory compliance markings to premium retail aesthetics, we supply calibrated labels matched to your industry specifications."
    },
    industries: industries,
    productUsesHeader: {
      title: "Product Uses",
      description: "Discover how Parth Printtech's custom shrink sleeves, BOPP wraps, and dry-fusion labels are calibrated to perform across container materials, automated bottling lines, and tough environments."
    },
    productUses: productUsesData,
    featuredHeader: {
      subtitle: "Bespoke Formats",
      title: "Featured Printing Solutions"
    },
    featuredSolutions: featuredProducts,
    whyChooseHeader: {
      subtitle: "Our Commitments",
      title: "Precision Printing Standards",
      description: "We combine structural packaging engineering with high-capacity digital output to deliver industry-leading label quality."
    },
    whyChooseUs: whyChooseUs,
    processHeader: {
      subtitle: "Seamless Integration",
      title: "How We Print Your Labels",
      description: "A streamlined design-to-delivery workflow ensuring zero calibration mistakes and rapid B2B dispatch."
    },
    workflowSteps: workflowSteps,
    metrics: metrics,
    seoHeader: {
      subtitle: "Professional Label Printing & Packaging",
      title: "Custom Label Printing Solutions"
    },
    seoBlocks: defaultSeoBlocks,
    popularSearches: popularSearches,
    cta: {
      title: "Ready to Create Your Custom Labels?",
      description: "Whether you need high-capacity roll labels for automation, transparent luxury seals, or compliance barcode layouts, our engineering team is here to check your vector dimensions and print.",
      buttonText: "Browse Products",
      buttonLink: "/contact"
    }
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/markets-page`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setMarketsData((prev) => ({
              ...prev,
              hero: { ...prev.hero, ...(json.data.hero || {}) },
              catalogHeader: { ...prev.catalogHeader, ...(json.data.catalogHeader || {}) },
              categories: Array.isArray(json.data.categories) && json.data.categories.length > 0 ? json.data.categories : prev.categories,
              industryHeader: { ...prev.industryHeader, ...(json.data.industryHeader || {}) },
              industries: Array.isArray(json.data.industries) && json.data.industries.length > 0 ? json.data.industries : prev.industries,
              productUsesHeader: { ...prev.productUsesHeader, ...(json.data.productUsesHeader || {}) },
              productUses: Array.isArray(json.data.productUses) && json.data.productUses.length > 0 ? json.data.productUses : prev.productUses,
              featuredHeader: { ...prev.featuredHeader, ...(json.data.featuredHeader || {}) },
              featuredSolutions: Array.isArray(json.data.featuredSolutions) && json.data.featuredSolutions.length > 0 ? json.data.featuredSolutions : prev.featuredSolutions,
              whyChooseHeader: { ...prev.whyChooseHeader, ...(json.data.whyChooseHeader || {}) },
              whyChooseUs: Array.isArray(json.data.whyChooseUs) && json.data.whyChooseUs.length > 0 ? json.data.whyChooseUs : prev.whyChooseUs,
              processHeader: { ...prev.processHeader, ...(json.data.processHeader || {}) },
              workflowSteps: Array.isArray(json.data.workflowSteps) && json.data.workflowSteps.length > 0 ? json.data.workflowSteps : prev.workflowSteps,
              metrics: Array.isArray(json.data.metrics) && json.data.metrics.length > 0 ? json.data.metrics : prev.metrics,
              seoHeader: { ...prev.seoHeader, ...(json.data.seoHeader || {}) },
              seoBlocks: Array.isArray(json.data.seoBlocks) && json.data.seoBlocks.length > 0 ? json.data.seoBlocks : prev.seoBlocks,
              popularSearches: Array.isArray(json.data.popularSearches) && json.data.popularSearches.length > 0 ? json.data.popularSearches : prev.popularSearches,
              cta: { ...prev.cta, ...(json.data.cta || {}) }
            }));
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadData();
  }, []);

  const handleChipClick = (categoryName) => {
    setActiveChip(categoryName);
    if (categoryName === "All") {
      setSearchTerm("");
    } else {
      setSearchTerm(categoryName);
    }
  };

  const handleTagClick = (tagName) => {
    setSearchTerm(tagName);
    setActiveChip("All");
  };

  // Entrance reveals and stats count-up trigger using GSAP ScrollTrigger
  useEffect(() => {
    document.title = "Markets We Serve | Parth Printing Technology";

    let ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.fromTo(
        `.heroReveal`,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" }
      );

      // Card grids scroll reveals
      gsap.fromTo(
        `.cardReveal`,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.categoriesSection}`,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Industry grids scroll reveals
      gsap.fromTo(
        `.industryReveal`,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.industrySection}`,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Timeline scroll reveal
      gsap.fromTo(
        `.timelineStep`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.processSection}`,
            start: "top 75%"
          }
        }
      );

      // Active connection lines reveal
      gsap.fromTo(
        `.lineFill`,
        { width: "0%" },
        {
          width: "100%",
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.2,
          scrollTrigger: {
            trigger: `.${styles.processSection}`,
            start: "top 65%"
          }
        }
      );

      // Metric section count-up triggers
      const currentMetricsList = marketsData.metrics && marketsData.metrics.length > 0 ? marketsData.metrics : metrics;
      const targetOrders = Number(currentMetricsList.find(m => m.id === "orders" || m.label?.toLowerCase().includes("order"))?.target || currentMetricsList[0]?.target || 10000);
      const targetClients = Number(currentMetricsList.find(m => m.id === "clients" || m.label?.toLowerCase().includes("client"))?.target || currentMetricsList[1]?.target || 2500);
      const targetSat = Number(currentMetricsList.find(m => m.id === "sat" || m.label?.toLowerCase().includes("sat"))?.target || currentMetricsList[2]?.target || 99);
      const targetInd = Number(currentMetricsList.find(m => m.id === "ind" || m.label?.toLowerCase().includes("ind"))?.target || currentMetricsList[3]?.target || 50);

      ScrollTrigger.create({
        trigger: `.${styles.metricsSection}`,
        start: "top 85%",
        onEnter: () => {
          const duration = 2; // Duration of count-up in seconds
          const steps = 60;
          const interval = (duration * 1000) / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            setCounts({
              orders: Math.floor((targetOrders / steps) * currentStep),
              clients: Math.floor((targetClients / steps) * currentStep),
              sat: Math.floor((targetSat / steps) * currentStep),
              ind: Math.floor((targetInd / steps) * currentStep)
            });

            if (currentStep >= steps) {
              clearInterval(timer);
              setCounts({
                orders: targetOrders,
                clients: targetClients,
                sat: targetSat,
                ind: targetInd
              });
            }
          }, interval);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [marketsData]);

  // Slider navigation
  const slide = (direction) => {
    if (sliderRef.current) {
      const scrollAmt = 350;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmt : scrollAmt,
        behavior: "smooth"
      });
    }
  };

  // Filter categories grid by search query
  const currentCategories = marketsData.categories || categories;
  const filteredCategories = currentCategories.filter((cat) => {
    const query = searchTerm.toLowerCase();
    return (
      cat.title?.toLowerCase().includes(query) ||
      cat.desc?.toLowerCase().includes(query) ||
      (cat.badge && cat.badge.toLowerCase().includes(query))
    );
  });

  return (
    <div ref={containerRef} className={styles.pageWrapper}>
      <Navbar />

      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.radialGlow1}></div>
        <div className={styles.radialGlow2}></div>

        <div className={styles.container}>
          <div className={styles.heroLayout}>
            {/* Left Block: Search & Brand Pitch */}
            <div className={styles.heroContent}>
              <span className={`${styles.badgeLabel} heroReveal`}>
                <span className={styles.blueDot}></span> {marketsData.hero?.badge || "MARKETS & APPLICATIONS"}
              </span>
              <h1 className={`${styles.heroTitle} heroReveal`}>
                {marketsData.hero?.title} <br />
                <span className={styles.accentText}>{marketsData.hero?.titleHighlight}</span>
              </h1>
              <p className={`${styles.heroDesc} heroReveal`}>
                {marketsData.hero?.description}
              </p>
              <div className={`${styles.heroCtaGroup} heroReveal`}>
                <a href="#categories" className={styles.heroPrimaryBtn}>
                  <span>Explore Solutions</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17l10-10M17 7H7M17 7v10" />
                  </svg>
                </a>
                <Link href="/contact" className={styles.heroSecondaryBtn}>
                  Request A Quote
                </Link>
              </div>
            </div>

            {/* Right Block: Precision Engineering Bento Showcase */}
            <div className={`${styles.heroShowcase} heroReveal`}>
              {/* Bento Cards Container */}
              <div className={styles.bentoContainer}>
                {/* 1. Primary Featured Card (Top Wide Showcase) */}
                <div className={styles.primaryBentoCard}>
                  <div className={styles.primaryCardHeader}>
                    <span 
                      className={styles.cardBadge} 
                      style={{ 
                        backgroundColor: (marketsData.hero?.mockups?.[0]?.tagBg) || "#e0f2fe", 
                        color: (marketsData.hero?.mockups?.[0]?.tagColor) || "#009fe3" 
                      }}
                    >
                      {marketsData.hero?.mockups?.[0]?.tag || "BEVERAGE & FMCG SOLUTIONS"}
                    </span>
                  </div>

                  <div className={styles.primaryImageFrame}>
                    <img
                      src={resolvePhoto(marketsData.hero?.image1 || marketsData.hero?.mockups?.[0]?.photo, "/images/products/bopp_label.png")}
                      alt={marketsData.hero?.mockups?.[0]?.title || "High-Speed Roll-Fed & Shrink Packaging"}
                      className={styles.primaryImage}
                      onError={(e) => {
                        if (!e.currentTarget.dataset.failed) {
                          e.currentTarget.dataset.failed = "true";
                          e.currentTarget.src = "/images/products/bopp_label.png";
                        }
                      }}
                    />
                  </div>

                  <div className={styles.primaryCardFooter}>
                    <div>
                      <h4 className={styles.cardTitle}>
                        {marketsData.hero?.mockups?.[0]?.title || "High-Speed Roll-Fed & Shrink Packaging"}
                      </h4>
                      <p className={styles.cardSub}>
                        {marketsData.hero?.mockups?.[0]?.text || "Waterproof, scuff-proof & high-tension rotary roll-fed application"}
                      </p>
                    </div>
                    <span className={styles.techTag}>9-Color Gravure</span>
                  </div>
                </div>

                {/* 2. Secondary Duo Row */}
                <div className={styles.secondaryRow}>
                  {/* Card A: PVC & PETG Shrink Sleeves */}
                  <div className={styles.secondaryBentoCard}>
                    <div className={styles.secondaryCardHeader}>
                      <span 
                        className={styles.cardBadge} 
                        style={{ 
                          backgroundColor: (marketsData.hero?.mockups?.[1]?.tagBg) || "#ecfdf5", 
                          color: (marketsData.hero?.mockups?.[1]?.tagColor) || "#059669" 
                        }}
                      >
                        {marketsData.hero?.mockups?.[1]?.tag || "360° SHRINK SLEEVE"}
                      </span>
                    </div>

                    <div className={styles.secondaryImageFrame}>
                      <img
                        src={resolvePhoto(marketsData.hero?.image2 || marketsData.hero?.mockups?.[1]?.photo, "/images/products/pvc_shrink_sleeves.png")}
                        alt={marketsData.hero?.mockups?.[1]?.title || "PVC & PETG Sleeves"}
                        className={styles.secondaryImage}
                        onError={(e) => {
                          if (!e.currentTarget.dataset.failed) {
                            e.currentTarget.dataset.failed = "true";
                            e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                          }
                        }}
                      />
                    </div>

                    <div className={styles.secondaryCardFooter}>
                      <h5 className={styles.secondaryTitle}>
                        {marketsData.hero?.mockups?.[1]?.title || "PVC & PETG Sleeves"}
                      </h5>
                      <p className={styles.secondarySub}>
                        {marketsData.hero?.mockups?.[1]?.text || "58% to 78% high-contour heat shrink fit"}
                      </p>
                    </div>
                  </div>

                  {/* Card B: Dry-Fusion Heat Transfer Labels */}
                  <div className={styles.secondaryBentoCard}>
                    <div className={styles.secondaryCardHeader}>
                      <span 
                        className={styles.cardBadge} 
                        style={{ 
                          backgroundColor: (marketsData.hero?.mockups?.[2]?.tagBg) || "#fdf2f8", 
                          color: (marketsData.hero?.mockups?.[2]?.tagColor) || "#e3007b" 
                        }}
                      >
                        {marketsData.hero?.mockups?.[2]?.tag || "HEAT TRANSFER (HTL)"}
                      </span>
                    </div>

                    <div className={styles.secondaryImageFrame}>
                      <img
                        src={resolvePhoto(marketsData.hero?.image3 || marketsData.hero?.mockups?.[2]?.photo, "/images/products/htl_paint_pails.png")}
                        alt={marketsData.hero?.mockups?.[2]?.title || "Heat Transfer Labels"}
                        className={styles.secondaryImage}
                        onError={(e) => {
                          if (!e.currentTarget.dataset.failed) {
                            e.currentTarget.dataset.failed = "true";
                            e.currentTarget.src = "/images/products/htl_paint_pails.png";
                          }
                        }}
                      />
                    </div>

                    <div className={styles.secondaryCardFooter}>
                      <h5 className={styles.secondaryTitle}>
                        {marketsData.hero?.mockups?.[2]?.title || "Heat Transfer Labels"}
                      </h5>
                      <p className={styles.secondarySub}>
                        {marketsData.hero?.mockups?.[2]?.text || "Permanent molecular bond & scratch-proof"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Markets We Serve Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>
              {marketsData.catalogHeader?.subtitle || "Markets We Serve Catalog"}
            </span>
            <h2 className={styles.sectionTitle}>
              {marketsData.catalogHeader?.title || "Browse Printing Categories"}
            </h2>
            <p className={styles.sectionDesc}>
              {marketsData.catalogHeader?.description || "Explore our custom layout and structural label profiles engineered to wrap beautifully on any packaging geometry."}
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className={`${styles.filterContainer} cardReveal`}>
            {/* Large Enterprise-style Search Bar */}
            <div className={styles.filterSearchWrapper}>
              <div className={styles.searchInner}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search labels, industries, or materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className={styles.clearBtn} aria-label="Clear search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Quick Chips */}
            <div className={styles.filterChipsContainer}>
              <span className={styles.chipsLabel}>Quick Access:</span>
              <div className={styles.chipsRow}>
                {["All", "Shrink Sleeves", "Wrap-Around Labels", "Heat Transfer Labels", "Shrink Film"].map((name) => {
                  const isActive = (name === "All" && activeChip === "All" && !searchTerm) || activeChip === name;
                  return (
                    <button
                      key={name}
                      onClick={() => handleChipClick(name)}
                      className={`${styles.chipBtn} ${isActive ? styles.chipBtnActive : ""}`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.categoriesGrid}>
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.categoryCard} cardReveal`}
                style={{ "--accent-color": cat.accentColor }}
              >
                {/* Category Visualizer Frame */}
                <div
                  className={styles.imageFrame}
                  style={{ backgroundColor: "#ffffff", borderColor: (cat.accentColor || "#009fe3") + "28" }}
                >
                  {/* Accent corner tag */}
                  <div className={styles.imageAccentCorner} style={{ backgroundColor: cat.accentColor || "#009fe3" }}>
                    <span className={styles.imageAccentNum}>{cat.num}</span>
                  </div>

                  {/* Photo with object-fit contain */}
                  <div className={styles.photoCoverWrapper}>
                    <img
                      src={resolvePhoto(cat.photo)}
                      alt={cat.title || "Packaging Solution"}
                      className={styles.categoryPhoto}
                      loading="lazy"
                      onError={(e) => {
                        if (!e.currentTarget.dataset.failed) {
                          e.currentTarget.dataset.failed = "true";
                          e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                        }
                      }}
                    />
                  </div>

                  {/* Icon in corner */}
                  <div className={styles.imageIconCorner} style={{ backgroundColor: (cat.accentColor || '#009fe3') + "1a", color: cat.accentColor || '#009fe3' }}>
                    {cat.icon || (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" />
                        <path d="M12 2v20M5 7h14M5 17h14" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Info blocks */}
                <div className={styles.infoBlock}>
                  <div className={styles.titleRow}>
                    <span className={styles.categoryLabel}>{cat.badge}</span>
                    <h3 className={styles.cardTitle}>{cat.title}</h3>
                  </div>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                </div>

                {/* Explore Category Link */}
                <Link href={`/contact?subject=Inquiry for ${cat.title}`} className={styles.categoryBtn}>
                  <span>Explore Category &amp; Inquire →</span>
                </Link>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className={styles.emptyResults}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3>No matching printing solutions found</h3>
              <p>Try searching for general keywords like "BOPP", "Waterproof", "Cosmetics", or click "All" to reset filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Browse by Industry Section */}
      <section className={styles.industrySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>
              {marketsData.industryHeader?.subtitle || "Industry Vertical Solutions"}
            </span>
            <h2 className={styles.sectionTitle}>
              {marketsData.industryHeader?.title || "Engineered for Every Segment"}
            </h2>
            <p className={styles.sectionDesc}>
              {marketsData.industryHeader?.description || "From regulatory compliance markings to premium retail aesthetics, we supply calibrated labels matched to your industry specifications."}
            </p>
          </div>

          <div className={styles.industryGrid}>
            {(marketsData.industries || industries).map((ind, indIdx) => (
              <div key={ind.id || indIdx} className={`${styles.industryCard} industryReveal`}>
                <div className={styles.industryIconFrame}>
                  {ind.icon || (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  )}
                </div>
                <h3 className={styles.industryTitle}>{ind.name}</h3>
                <p className={styles.industryDesc}>{ind.desc}</p>
                <div className={styles.industryLinkBlock}>
                  <Link href={`/contact?subject=Specs for ${ind.name}`} className={styles.industryLink}>
                    View Specs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRO LEVEL PRODUCT USES & PACKAGING APPLICATION SHOWCASE */}
      <section className={styles.productUsesSection}>
        <div className={styles.usesBgGlow1}></div>
        <div className={styles.usesBgGlow2}></div>
        <div className={styles.usesGridPattern}></div>

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.usesHeader}>
            <h2 className={styles.usesTitle}>
              {marketsData.productUsesHeader?.title || "Product Uses"}
            </h2>
            <p className={styles.usesDesc}>
              {marketsData.productUsesHeader?.description || "Discover how Parth Printtech's custom shrink sleeves, BOPP wraps, and dry-fusion labels are calibrated to perform across container materials, automated bottling lines, and tough environments."}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className={styles.usesTabsRow}>
            {["All", "Bottles & Beverage", "Jars, Tubs & Creams", "Vials & Healthcare", "Chemicals & Industrial", "Cans & Aerosols"].map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveUseTab(tabName)}
                className={`${styles.usesTabBtn} ${activeUseTab === tabName ? styles.usesTabBtnActive : ""}`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Uses Cards Grid */}
          <div className={styles.usesGrid}>
            {(marketsData.productUses || productUsesData)
              .filter(item => activeUseTab === "All" || item.category === activeUseTab)
              .map((use) => (
                <div
                  key={use.id}
                  className={styles.useCard}
                  style={{ "--card-accent": use.accentColor }}
                >
                  <div>
                    {/* Card Top Header */}
                    <div className={styles.useCardTop}>
                      <span className={styles.useCategoryBadge} style={{ color: use.accentColor, borderColor: use.accentColor + "40" }}>
                        {use.badge}
                      </span>
                    </div>

                    {/* Card Main Block */}
                    <div className={styles.useCardMain}>
                      <div className={styles.usePhotoBox} style={{ borderColor: (use.accentColor || "#009fe3") + "38" }}>
                        <img
                          src={resolvePhoto(use.photo)}
                          alt={use.title || "Product Application"}
                          className={styles.usePhoto}
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.failed) {
                              e.currentTarget.dataset.failed = "true";
                              e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                            }
                          }}
                        />
                      </div>
                      <div className={styles.useTitleBox}>
                        <h3 className={styles.useCardTitle}>{use.title}</h3>
                        <p className={styles.useCardSubtitle}>{use.subtitle}</p>
                        <span className={styles.useContainerType}>
                          📦 {use.containerType}
                        </span>
                      </div>
                    </div>

                    {/* Hotspots Breakdown */}
                    <div className={styles.useHotspotsBox}>
                      <div className={styles.hotspotsBoxHeader}>
                        🎯 Key Container Application Zones:
                      </div>
                      <div className={styles.hotspotsList}>
                        {(use.hotspots || []).map((hs, hIdx) => (
                          <div key={hIdx} className={styles.hotspotItem}>
                            <span className={styles.hotspotBadge} style={{ backgroundColor: use.accentColor }}>
                              {hs.badge}
                            </span>
                            <span className={styles.hotspotText}>{hs.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Specs 2x2 Grid */}
                    <div className={styles.useSpecsGrid}>
                      {(use.specs || []).map((sp, sIdx) => (
                        <div key={sIdx} className={styles.useSpecItem}>
                          <span className={styles.useSpecLabel}>{sp.label}</span>
                          <span className={styles.useSpecVal}>{sp.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Common Product Uses Tags */}
                    <div className={styles.useTagsRow}>
                      {(use.uses || []).map((uTag, utIdx) => (
                        <span key={utIdx} className={styles.useTag}>
                          ✓ {uTag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className={styles.useCardFooter}>
                    <Link href={`/contact?subject=Inquiry for ${use.title}`} className={styles.useInquireBtn} style={{ color: use.accentColor }}>
                      <span>Inquire Application Specs</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
          </div>


        </div>
      </section>

      {/* 5. Featured Printing Solutions Slider */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sliderHeaderRow}>
            <div className={styles.sliderHeaderLeft}>
              <span className={styles.sectionSubtitle}>
                {marketsData.featuredHeader?.subtitle || "Bespoke Formats"}
              </span>
              <h2 className={styles.sectionTitle}>
                {marketsData.featuredHeader?.title || "Featured Printing Solutions"}
              </h2>
            </div>
            
            {/* Slider Navigation Buttons */}
            <div className={styles.sliderArrows}>
              <button onClick={() => slide("left")} className={styles.arrowBtn} aria-label="Slide Left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button onClick={() => slide("right")} className={styles.arrowBtn} aria-label="Slide Right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Horizontal scroll container */}
          <div ref={sliderRef} className={styles.featuredSlider}>
            {(marketsData.featuredSolutions || featuredProducts).map((fp, fpIdx) => (
              <div key={fp.id || fpIdx} className={styles.sliderCard} style={{ "--solution-accent": fp.accent }}>
                <div className={styles.sliderVisualArea}>
                  {/* Real product photo */}
                  <div className={styles.sliderPhotoFrame}>
                    <img
                      src={resolvePhoto(fp.photo)}
                      alt={fp.title || "Featured Printing Solution"}
                      className={styles.sliderPhoto}
                      loading="lazy"
                      onError={(e) => {
                        if (!e.currentTarget.dataset.failed) {
                          e.currentTarget.dataset.failed = "true";
                          e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                        }
                      }}
                    />
                  </div>
                  {/* Accent bar at bottom */}
                  <div className={styles.sliderAccentBar} style={{ backgroundColor: fp.accent }}></div>
                  {/* Metric badge on top */}
                  {fp.metric && <span className={styles.sliderMetric}>{fp.metric}</span>}
                </div>
                <div className={styles.sliderCardInfo}>
                  <h3 className={styles.sliderCardTitle}>{fp.title}</h3>
                  <p className={styles.sliderCardDesc}>{fp.desc}</p>
                  <Link href={`/contact?subject=Quote for ${fp.title}`} className={styles.sliderCardBtn}>
                    <span>Inquire Now</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Our Printing Solutions */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>
              {marketsData.whyChooseHeader?.subtitle || "Our Commitments"}
            </span>
            <h2 className={styles.sectionTitle}>
              {marketsData.whyChooseHeader?.title || "Precision Printing Standards"}
            </h2>
            <p className={styles.sectionDesc}>
              {marketsData.whyChooseHeader?.description || "We combine structural packaging engineering with high-capacity digital output to deliver industry-leading label quality."}
            </p>
          </div>

          <div className={styles.whyGrid}>
            {(marketsData.whyChooseUs || whyChooseUs).map((wcu, idx) => (
              <div key={idx} className={styles.whyCard}>
                <div className={styles.whyIconWrapper}>
                  {wcu.icon || (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    </svg>
                  )}
                </div>
                <h3 className={styles.whyCardTitle}>{wcu.title}</h3>
                <p className={styles.whyCardDesc}>{wcu.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Apple-style Printing Process Timeline */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>
              {marketsData.processHeader?.subtitle || "Seamless Integration"}
            </span>
            <h2 className={styles.sectionTitle}>
              {marketsData.processHeader?.title || "How We Print Your Labels"}
            </h2>
            <p className={styles.sectionDesc}>
              {marketsData.processHeader?.description || "A streamlined design-to-delivery workflow ensuring zero calibration mistakes and rapid B2B dispatch."}
            </p>
          </div>

          {/* Workflow Scroll Horizontal List */}
          <div className={styles.processTimelineContainer}>
            {/* Timeline connectors */}
            <div className={styles.timelineConnectors}>
              <div className={`${styles.lineFill} lineFill`}></div>
            </div>

            <div className={styles.processTimeline}>
              {(marketsData.workflowSteps || workflowSteps).map((step, sIdx) => (
                <div key={sIdx} className={`${styles.timelineStep} timelineStep`}>
                  <div className={styles.stepCircle}>
                    <span className={styles.stepNum}>{step.step || sIdx + 1}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  {sIdx < (marketsData.workflowSteps || workflowSteps).length - 1 && (
                    <span className={styles.stepArrow}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Success Metrics Section */}
      <section className={styles.metricsSection}>
        <div className={styles.container}>
          <div className={styles.metricsGrid}>
            {(marketsData.metrics || metrics).map((metric, mIdx) => {
              let val = metric.target;
              if ((metric.id === "orders" || mIdx === 0) && counts.orders > 0) val = counts.orders;
              else if ((metric.id === "clients" || mIdx === 1) && counts.clients > 0) val = counts.clients;
              else if ((metric.id === "sat" || mIdx === 2) && counts.sat > 0) val = counts.sat;
              else if ((metric.id === "ind" || mIdx === 3) && counts.ind > 0) val = counts.ind;

              return (
                <div key={metric.id || mIdx} className={styles.metricItem}>
                  <div className={styles.metricNumberBlock}>
                    <span className={styles.metricNumber}>
                      {Number(val || metric.target || 0).toLocaleString()}
                    </span>
                    <span className={styles.metricSuffix}>{metric.suffix}</span>
                  </div>
                  <span className={styles.metricLabel}>{metric.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SEO-Optimized Content Section */}
      <section className={styles.seoSection}>
        <div className={styles.container}>
          <div className={styles.seoHeader}>
            <span className={styles.sectionSubtitle}>
              {marketsData.seoHeader?.subtitle || "Professional Label Printing & Packaging"}
            </span>
            <h2 className={styles.seoTitle}>
              {marketsData.seoHeader?.title || "Custom Label Printing Solutions"}
            </h2>
          </div>
          
          <div className={styles.seoGrid}>
            {/* Column 1 */}
            <div className={styles.seoCol}>
              {(marketsData.seoBlocks || defaultSeoBlocks)
                .filter((_, idx) => idx % 2 === 0)
                .map((block, bIdx) => (
                  <div key={bIdx} className={styles.seoBlock}>
                    <h3 className={styles.seoBlockHeading}>{block.heading}</h3>
                    <p className={styles.seoBlockText} style={{ whiteSpace: "pre-line" }}>
                      {block.content}
                    </p>
                  </div>
                ))}
            </div>

            {/* Column 2 */}
            <div className={styles.seoCol}>
              {(marketsData.seoBlocks || defaultSeoBlocks)
                .filter((_, idx) => idx % 2 === 1)
                .map((block, bIdx) => (
                  <div key={bIdx} className={styles.seoBlock}>
                    <h3 className={styles.seoBlockHeading}>{block.heading}</h3>
                    <p className={styles.seoBlockText} style={{ whiteSpace: "pre-line" }}>
                      {block.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Popular Searches Section */}
      <section className={styles.searchesSection}>
        <div className={styles.container}>
          <div className={styles.searchesBox}>
            <span className={styles.searchesTitle}>Popular Searches:</span>
            <div className={styles.searchesList}>
              {(marketsData.popularSearches || popularSearches).map((tag, tagIdx) => (
                <button
                  key={tagIdx}
                  onClick={() => handleTagClick(tag)}
                  className={styles.searchTag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaCircularGlow}></div>
            <div className={styles.ctaCardBorder}></div>

            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                {marketsData.cta?.title || "Ready to Create Your Custom Labels?"}
              </h2>
              <p className={styles.ctaDesc}>
                {marketsData.cta?.description || "Whether you need high-capacity roll labels for automation, transparent luxury seals, or compliance barcode layouts, our engineering team is here to check your vector dimensions and print."}
              </p>
              
              <div className={styles.ctaButtons}>
                <button onClick={() => { setActiveChip("All"); setSearchTerm(""); }} className={styles.ctaBtnPrimary}>
                  {marketsData.cta?.buttonText || "Browse Products"}
                </button>
                <Link href={marketsData.cta?.buttonLink || "/contact"} className={styles.ctaBtnSecondary}>
                  Request Quote
                </Link>
                <Link href="/contact?subject=Design Specs" className={styles.ctaBtnOutline}>
                  Design Requirements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PremiumMarketsWeServe;
