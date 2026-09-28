const { readDb, writeDb } = require('../data/db');

const defaultMarketsPageData = {
  hero: {
    badge: "MARKETS & APPLICATIONS",
    title: "Packaging & Label Solutions",
    titleHighlight: "For Every Industry",
    description: "Precision-engineered labels and shrink sleeves designed for durability, visual impact, and seamless application across high-speed commercial production lines.",
    image1: "/images/products/bopp_label.png",
    image2: "/images/products/pvc_shrink_sleeves.png",
    image3: "/images/products/htl_paint_pails.png",
    mockups: [
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
    ]
  },
  catalogHeader: {
    subtitle: "MARKETS WE SERVE CATALOG",
    title: "Browse Printing Categories",
    description: "Explore our custom layout and structural label profiles engineered to wrap beautifully on any packaging geometry."
  },
  categories: [
    {
      id: "pvc-shrink-sleeves",
      num: "01",
      regMark: "REG-PVC-01",
      dim: "Custom Diameter & Height",
      title: "PVC Shrink Sleeves",
      desc: "High-grade PVC shrink sleeve labels offering 360-degree graphics contouring for food, beverage, cosmetics, and household containers.",
      badge: "360° Graphics",
      accentColor: "#009fe3",
      photo: "/images/products/pvc_shrink_sleeves.png",
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
      badge: "Eco Clarity",
      accentColor: "#e3007b",
      photo: "/images/products/petg_shrink_sleeves.png",
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
      badge: "Waterproof",
      accentColor: "#ffd400",
      photo: "/images/products/bopp_label.png",
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
      badge: "Dry Fusion",
      accentColor: "#111111",
      photo: "/images/products/htl_label_rolls.png",
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
      badge: "Plain Film",
      accentColor: "#4f46e5",
      photo: "/images/products/plain_pvc_shrink_film.png",
      specs: [
        { label: "Substrate", value: "Premium Grade Plain PVC" },
        { label: "Shrinkage Rate", value: "Up to 40% - 45%" },
        { label: "Format", value: "Roll Form & Cut Pieces (As per Requirement)" },
        { label: "Layflat Range", value: "30mm to 600mm" }
      ]
    }
  ],
  industryHeader: {
    subtitle: "Industry Vertical Solutions",
    title: "Engineered for Every Segment",
    description: "From regulatory compliance markings to premium retail aesthetics, we supply calibrated labels matched to your industry specifications."
  },
  industries: [
    {
      id: "food-bev",
      name: "Food & Beverage",
      desc: "Eco-kraft squeeze bottles, wet-strength labels, and direct moisture resistant stickers."
    },
    {
      id: "cosmetics",
      name: "Cosmetics & Beauty",
      desc: "Chic matte clear laminations, metallic foil seals, and soft-touch textures."
    },
    {
      id: "healthcare",
      name: "Healthcare",
      desc: "Vial syringes, pharmaceutical batch codes, and tamper-evident vaccine security tags."
    },
    {
      id: "retail",
      name: "Retail",
      desc: "Luxury hang tags, barcode pricing stickers, and adhesive gift seals."
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      desc: "High-temperature components, warning plates, and product asset tracking codes."
    },
    {
      id: "logistics",
      name: "Logistics",
      desc: "Logistical shipping boxes, pallets, inventory stickers, and heavy load transit markers."
    }
  ],
  productUsesHeader: {
    title: "Product Uses & Packaging Applications",
    description: "Discover how Parth Printtech's custom shrink sleeves, BOPP wraps, and dry-fusion labels are calibrated to perform across container materials, automated bottling lines, and tough environments."
  },
  productUses: [
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
      photo: "/images/products/bopp_label.png",
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
      photo: "/images/products/htl_label_rolls.png",
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
      photo: "/images/products/petg_shrink_sleeves.png",
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
      photo: "/images/products/plain_pvc_shrink_film.png",
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
      photo: "/images/products/petg_shrink_sleeves.png",
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
  ],
  featuredHeader: {
    subtitle: "Bespoke Formats",
    title: "Featured Printing Solutions"
  },
  featuredSolutions: [
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
      title: "Eco-Friendly PETG Clarity",
      desc: "Ultra-clear polyester films offering extreme shrinkage profiles and minimal carbon footprint for sustainability.",
      metric: "100% Recyclable Polyester",
      accent: "#e3007b",
      photo: "/images/products/petg_shrink_sleeves.png"
    },
    {
      id: "bopp-wrap-around-labels",
      title: "High-Speed Hot-Melt Dispensing",
      desc: "Tensile-strength biaxially-oriented polypropylene roll-fed labels designed for seamless high-speed Hot-Melt labeling lines.",
      metric: "Zero-tear rotary speed",
      accent: "#ffd400",
      photo: "/images/products/bopp_label.png"
    },
    {
      id: "heat-transfer-labels",
      title: "Permanent Dry-Fusion Finish",
      desc: "Direct decoration fused into plastic packaging with heat and pressure, leaving no sticky residue or label edges.",
      metric: "Chemical & scratch-proof",
      accent: "#111111",
      photo: "/images/products/htl_label_rolls.png"
    },
    {
      id: "plain-pvc-shrink-film",
      title: "Plain PVC Shrink Film Rolls",
      desc: "Super-clear unprinted PVC shrink films offering high dust/humidity protection and low-temperature uniform shrinkage.",
      metric: "High-speed wrap stability",
      accent: "#4f46e5",
      photo: "/images/products/plain_pvc_shrink_film.png"
    }
  ],
  whyChooseHeader: {
    subtitle: "Our Commitments",
    title: "Precision Printing Standards",
    description: "We combine structural packaging engineering with high-capacity digital output to deliver industry-leading label quality."
  },
  whyChooseUs: [
    {
      title: "High-Quality Printing",
      desc: "Every order undergoes micro-dot registration validation to match color calibration points."
    },
    {
      title: "Fast Turnaround",
      desc: "Pre-flight digital approvals processed in hours, with standard orders dispatching in 3–5 business days."
    },
    {
      title: "Custom Sizes & Shapes",
      desc: "Digital laser die-cut technology creates complex, custom silhouettes without expensive die setups."
    },
    {
      title: "Premium Materials",
      desc: "Direct access to textured cotton linen, transparent vinyls, kraft sheets, and protective laminations."
    },
    {
      title: "Bulk Order Support",
      desc: "Structured B2B scaling parameters providing significant cost efficiencies for millions of labels."
    },
    {
      title: "Nationwide Delivery",
      desc: "Logistics configurations synchronized with primary shipping routes to ensure punctual site delivery."
    }
  ],
  processHeader: {
    subtitle: "Seamless Integration",
    title: "How We Print Your Labels",
    description: "A streamlined design-to-delivery workflow ensuring zero calibration mistakes and rapid B2B dispatch."
  },
  workflowSteps: [
    { step: "01", title: "Choose Product", desc: "Select catalog templates, structural styles, roll setups, or customize labels." },
    { step: "02", title: "Upload Artwork", desc: "Drag and drop your vector design assets (PDF, AI, or EPS) directly to our server." },
    { step: "03", title: "Customize Options", desc: "Select specific substrate materials, grades, size contours, and specialty finishes." },
    { step: "04", title: "Approve Design", desc: "Receive high-fidelity digital proofs calibrated by our pre-flight engineering teams." },
    { step: "05", title: "Print Production", desc: "Your order goes to flexographic or high-capacity digital printing presses." },
    { step: "06", title: "Delivery", desc: "Securely packed rolls or die-cut label sheets ship directly to your site location." }
  ],
  metrics: [
    { id: "orders", target: 10000, suffix: "+", label: "Orders Completed" },
    { id: "clients", target: 2500, suffix: "+", label: "Happy Clients" },
    { id: "sat", target: 99, suffix: "%", label: "Customer Satisfaction" },
    { id: "ind", target: 50, suffix: "+", label: "Industries Served" }
  ],
  seoHeader: {
    subtitle: "Professional Label Printing & Packaging",
    title: "Custom Label Printing Solutions"
  },
  seoBlocks: [
    {
      heading: "Why Quality Labels Matter",
      content: "First impressions are critical. Whether your products sit on retail shelves or navigate complex shipping networks, the quality of your label represents the standard of your brand. As a leading label manufacturer and label supplier, Parth Printtech provides professional label printing that ensures high-contrast barcodes, rich colors, and durable adhesion."
    },
    {
      heading: "Label Types We Offer",
      content: "We manufacture a comprehensive array of custom labels calibrated for diverse applications: high-speed roll labels, barcode labels, thermal labels, and waterproof packaging labels tailored to your exact container dimensions."
    },
    {
      heading: "Customization Options",
      content: "Every brand is unique. Choose from waterproof BOPP vinyl, eco-friendly kraft papers, metallic foils, or clear transparent sheets with permanent, removable, or freezer-grade adhesives."
    },
    {
      heading: "Why Choose Our Label Printing Services",
      content: "At Parth Printtech, we integrate state-of-the-art machinery with strict quality checks to ensure your designs are printed with absolute registration and color accuracy."
    }
  ],
  popularSearches: [
    "Waterproof Labels",
    "Food Labels",
    "Bottle Stickers",
    "Barcode Labels",
    "QR Labels",
    "Custom Packaging Labels"
  ],
  cta: {
    title: "Ready to Create Your Custom Labels?",
    description: "Whether you need high-capacity roll labels for automation, transparent luxury seals, or compliance barcode layouts, our engineering team is here to check your vector dimensions and print.",
    buttonText: "Browse Products",
    buttonLink: "/contact"
  }
};

function getMarketsPageFromDb(db) {
  if (db.marketsPage && typeof db.marketsPage === 'object') {
    return {
      hero: { ...defaultMarketsPageData.hero, ...(db.marketsPage.hero || {}) },
      catalogHeader: { ...defaultMarketsPageData.catalogHeader, ...(db.marketsPage.catalogHeader || {}) },
      categories: Array.isArray(db.marketsPage.categories) ? db.marketsPage.categories : defaultMarketsPageData.categories,
      industryHeader: { ...defaultMarketsPageData.industryHeader, ...(db.marketsPage.industryHeader || {}) },
      industries: Array.isArray(db.marketsPage.industries) ? db.marketsPage.industries : defaultMarketsPageData.industries,
      productUsesHeader: { ...defaultMarketsPageData.productUsesHeader, ...(db.marketsPage.productUsesHeader || {}) },
      productUses: Array.isArray(db.marketsPage.productUses) ? db.marketsPage.productUses : defaultMarketsPageData.productUses,
      featuredHeader: { ...defaultMarketsPageData.featuredHeader, ...(db.marketsPage.featuredHeader || {}) },
      featuredSolutions: Array.isArray(db.marketsPage.featuredSolutions) ? db.marketsPage.featuredSolutions : defaultMarketsPageData.featuredSolutions,
      whyChooseHeader: { ...defaultMarketsPageData.whyChooseHeader, ...(db.marketsPage.whyChooseHeader || {}) },
      whyChooseUs: Array.isArray(db.marketsPage.whyChooseUs) ? db.marketsPage.whyChooseUs : defaultMarketsPageData.whyChooseUs,
      processHeader: { ...defaultMarketsPageData.processHeader, ...(db.marketsPage.processHeader || {}) },
      workflowSteps: Array.isArray(db.marketsPage.workflowSteps) ? db.marketsPage.workflowSteps : defaultMarketsPageData.workflowSteps,
      metrics: Array.isArray(db.marketsPage.metrics) ? db.marketsPage.metrics : defaultMarketsPageData.metrics,
      seoHeader: { ...defaultMarketsPageData.seoHeader, ...(db.marketsPage.seoHeader || {}) },
      seoBlocks: Array.isArray(db.marketsPage.seoBlocks) ? db.marketsPage.seoBlocks : defaultMarketsPageData.seoBlocks,
      popularSearches: Array.isArray(db.marketsPage.popularSearches) ? db.marketsPage.popularSearches : defaultMarketsPageData.popularSearches,
      cta: { ...defaultMarketsPageData.cta, ...(db.marketsPage.cta || {}) }
    };
  }
  return defaultMarketsPageData;
}

// Get all markets page data
exports.getMarketsPageData = async (req, res) => {
  try {
    const db = readDb();
    const data = getMarketsPageFromDb(db);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch markets page data', error: err.message });
  }
};

// Update full markets page data
exports.updateMarketsPageData = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      ...req.body
    };
    writeDb(db);
    res.json({ success: true, message: 'Markets page updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update markets page data', error: err.message });
  }
};

// Update Hero
exports.updateHero = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      hero: { ...existing.hero, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Hero section updated successfully', data: db.marketsPage.hero });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero', error: err.message });
  }
};

// Update Catalog Header & Categories
exports.updateCategories = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      catalogHeader: req.body.catalogHeader ? { ...existing.catalogHeader, ...req.body.catalogHeader } : existing.catalogHeader,
      categories: req.body.categories || existing.categories
    };
    writeDb(db);
    res.json({ success: true, message: 'Categories catalog updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update categories', error: err.message });
  }
};

// Update Industries
exports.updateIndustries = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      industryHeader: req.body.industryHeader ? { ...existing.industryHeader, ...req.body.industryHeader } : existing.industryHeader,
      industries: req.body.industries || existing.industries
    };
    writeDb(db);
    res.json({ success: true, message: 'Industry sectors updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update industries', error: err.message });
  }
};

// Update Product Uses
exports.updateProductUses = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      productUsesHeader: req.body.productUsesHeader ? { ...existing.productUsesHeader, ...req.body.productUsesHeader } : existing.productUsesHeader,
      productUses: req.body.productUses || existing.productUses
    };
    writeDb(db);
    res.json({ success: true, message: 'Product uses updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product uses', error: err.message });
  }
};

// Update Featured Solutions Slider
exports.updateFeaturedSolutions = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      featuredHeader: req.body.featuredHeader ? { ...existing.featuredHeader, ...req.body.featuredHeader } : existing.featuredHeader,
      featuredSolutions: req.body.featuredSolutions || existing.featuredSolutions
    };
    writeDb(db);
    res.json({ success: true, message: 'Featured solutions slider updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update featured solutions', error: err.message });
  }
};

// Update Why Choose Us Commitments
exports.updateWhyChooseUs = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      whyChooseHeader: req.body.whyChooseHeader ? { ...existing.whyChooseHeader, ...req.body.whyChooseHeader } : existing.whyChooseHeader,
      whyChooseUs: req.body.whyChooseUs || existing.whyChooseUs
    };
    writeDb(db);
    res.json({ success: true, message: 'Why Choose Us commitments updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update why choose us', error: err.message });
  }
};

// Update Process Workflow & Metrics
exports.updateProcessMetrics = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      processHeader: req.body.processHeader ? { ...existing.processHeader, ...req.body.processHeader } : existing.processHeader,
      workflowSteps: req.body.workflowSteps || existing.workflowSteps,
      metrics: req.body.metrics || existing.metrics
    };
    writeDb(db);
    res.json({ success: true, message: 'Process workflow and metrics updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update process and metrics', error: err.message });
  }
};

// Update SEO, Popular Searches & CTA
exports.updateSeoCta = async (req, res) => {
  try {
    const db = readDb();
    const existing = getMarketsPageFromDb(db);
    db.marketsPage = {
      ...existing,
      seoHeader: req.body.seoHeader ? { ...existing.seoHeader, ...req.body.seoHeader } : existing.seoHeader,
      seoBlocks: req.body.seoBlocks || existing.seoBlocks,
      popularSearches: req.body.popularSearches || existing.popularSearches,
      cta: req.body.cta ? { ...existing.cta, ...req.body.cta } : existing.cta
    };
    writeDb(db);
    res.json({ success: true, message: 'SEO and CTA banner updated successfully', data: db.marketsPage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update SEO and CTA', error: err.message });
  }
};
