const { readDb, writeDb } = require('../data/db');

const defaultProductsHeader = {
  title: "Our Print &",
  titleHighlight: "Packaging Solutions",
  description: "Inspect the engineering details, sizes, and print calibrations of our premium commercial packaging solutions."
};

// Default initial products catalog fallback
const defaultCatalogProducts = [
  {
    id: "pvc-shrink-sleeves",
    num: "01",
    category: "Shrink Sleeves",
    title: "PVC Shrink Sleeves",
    description: "High-grade PVC shrink sleeve labels offering 360-degree graphics contouring for food, beverage, cosmetics, and household containers.",
    image: "/images/products/pvc_shrink_sleeves.png",
    accentColor: "#009fe3",
    dim: "Custom Diameter & Height",
    regMark: "REG-PVC-01",
    detailedDescription: "Conform your packaging graphics seamlessly to complex container contours. Our high-precision PVC (Polyvinyl Chloride) shrink sleeve labels offer 360-degree design coverage from cap to base. Manufactured using premium high-grade PVC films with shrinkage ratings up to 58%, they are perfect for beverage bottles, visual promotional twin-packs, and tamper-evident sealing caps. Highly resistant to moisture, scuffs, and humidity.",
    specs: [
      { label: "Substrate", value: "High-Grade PVC Film" },
      { label: "Shrinkage Rate", value: "Up to 50% - 58%" },
      { label: "Print Process", value: "Rotogravure / High-Def Flexo" },
      { label: "Finishing Option", value: "Gloss / Matte / Metallic Ink" },
      { label: "Material Thickness", value: "35 to 50 Microns" },
      { label: "Layflat Range", value: "20mm to 350mm" }
    ]
  },
  {
    id: "petg-shrink-sleeves",
    num: "02",
    category: "Shrink Sleeves",
    title: "PETG Shrink Sleeves",
    description: "Premium eco-friendly polyester shrink sleeves with maximum shrinkage percentage for highly contoured beverage and aerosol bottles.",
    image: "/images/products/petg_shrink_sleeves.png",
    accentColor: "#e3007b",
    dim: "Custom Contour Fit",
    regMark: "REG-PETG-02",
    detailedDescription: "For products requiring extreme shrinkage profiles and absolute clarity, our PETG (Polyethylene Terephthalate Glycol) sleeve labels represent the pinnacle of industrial label engineering. Made from 100% recyclable, heat-stable film, they support shrinkage up to 78% without smiling, frowning, or graphic distortion. Perfect for contoured health juices, premium dairy beverages, cosmetic bottles, and trigger sprays.",
    specs: [
      { label: "Substrate", value: "Recyclable PET G Film" },
      { label: "Shrinkage Rate", value: "Up to 70% - 78% Max" },
      { label: "Print Process", value: "Narrow-Web Gravure / UV Flexo" },
      { label: "Sustainability", value: "100% Recyclable / Low Carbon" },
      { label: "Thickness Options", value: "40 to 50 Microns" },
      { label: "Print Finishes", value: "Soft-touch Matte / Spot Holographic" }
    ]
  },
  {
    id: "bopp-wrap-around-labels",
    num: "03",
    category: "Wrap-Around Labels",
    title: "BOPP Wrap-Around Labels",
    description: "High-speed roll-fed BOPP wrap-around labels with superior water/scuff resistance, ideal for mineral water and carbonated drinks.",
    image: "/images/products/bopp_label.png",
    accentColor: "#ffd400",
    dim: "Roll Format / Cut-and-Stack",
    regMark: "REG-BOPP-03",
    detailedDescription: "Engineered for high-volume, high-speed rotary labeling lines. Our BOPP (Biaxially Oriented Polypropylene) wrap-around labels are available in clear, solid opaque white, and metallized finishes. Featuring high tensile strength, outstanding moisture resistance, and scuff protection, these roll-fed labels run smoothly through Hot-Melt labeling lines. Widely preferred for mineral water, soda bottles, and industrial aerosols.",
    specs: [
      { label: "Substrate", value: "BOPP (Natural & Pearlised)" },
      { label: "Film Thickness", value: "35 to 50 Microns" },
      { label: "Print Process", value: "Gravure" },
      { label: "Elongation Strength", value: "High Tensile MD/TD" },
      { label: "Adhesive Match", value: "Hot-Melt Glue System Compatible" },
      { label: "Reel Diameter", value: "Up to 600mm / 3-inch core" }
    ]
  },
  {
    id: "heat-transfer-labels",
    num: "04",
    category: "Heat Transfer Labels",
    title: "Heat Transfer Labels (HTL)",
    description: "Dry-fusion decoration labels that permanently bond graphics to plastic containers, creating a seamless, scratch-proof 'no-label' look.",
    image: "/images/products/htl_label_rolls.png",
    accentColor: "#111111",
    dim: "Custom Fusion Profile",
    regMark: "REG-HTL-04",
    detailedDescription: "Ditch the traditional adhesive line and fuse your brand directly into your container. Our premium Heat Transfer Labels (HTL) utilize heat and pressure to permanently transfer and bond gravure or digital graphics directly onto plastic (PE, PP, PET, PS) or glass containers. The result is a seamless 'no-label' look with absolute chemical resistance, water immunity, and scratch-proof durability. Ideal for premium cosmetic jars, paint buckets, lube oil cans, and consumer electronics.",
    specs: [
      { label: "Carrier Film", value: "Specially Coated PET Carrier" },
      { label: "Ink System", value: "Fully UV Cured / Scratch-Proof" },
      { label: "Fusion Temp", value: "130°C to 180°C" },
      { label: "Application Tech", value: "Heat & Press Fusion Roller" },
      { label: "Container Types", value: "PE, PP, PET, PS, Glass" },
      { label: "Graphic Options", value: "Photo-Realistic CMYK + Metallic" }
    ]
  },
  {
    id: "plain-pvc-shrink-film",
    num: "05",
    category: "Shrink Film",
    title: "Plain PVC Shrink Film",
    description: "Premium unprinted PVC shrink film rolls for manual or automated wrapping, offering superior clarity, uniform shrinkage, and strong seals.",
    image: "/images/products/plain_pvc_shrink_film.png",
    accentColor: "#4f46e5",
    dim: "Custom Roll Width & Length",
    regMark: "REG-PVC-05",
    detailedDescription: "Our plain PVC shrink film is engineered for versatile packaging applications. Available in both layflat and centerfold rolls, it provides high clarity, excellent dust protection, and high shrinkage rates at lower temperatures. Ideal for bulk packaging, multi-pack promotional bundles, retail boxes, and tamper-evident wrapping.",
    specs: [
      { label: "Substrate", value: "Premium Grade Plain PVC" },
      { label: "Shrinkage Rate", value: "Up to 40% - 45%" },
      { label: "Format", value: "Roll Form & Cut Pieces (As per Requirement)" },
      { label: "Layflat Range", value: "30mm to 600mm" },
      { label: "Material Thickness", value: "25 to 75 Microns" },
      { label: "Appearance", value: "Super Clear / High Gloss" }
    ]
  }
];

function getProductsList(db) {
  if (db.products && Array.isArray(db.products) && db.products.length > 0) {
    return db.products;
  }
  return defaultCatalogProducts;
}

function getHeaderData(db) {
  if (db.productsPageHeader && typeof db.productsPageHeader === 'object') {
    return { ...defaultProductsHeader, ...db.productsPageHeader };
  }
  return defaultProductsHeader;
}

// Get Page Header
exports.getProductsHeader = async (req, res) => {
  try {
    const db = readDb();
    const header = getHeaderData(db);
    res.json({ success: true, data: header });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch header', error: err.message });
  }
};

// Update Page Header
exports.updateProductsHeader = async (req, res) => {
  try {
    const db = readDb();
    db.productsPageHeader = {
      ...getHeaderData(db),
      ...req.body
    };
    writeDb(db);
    res.json({
      success: true,
      message: 'Products page header updated successfully',
      data: db.productsPageHeader
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update header', error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const db = readDb();
    const products = getProductsList(db);
    const header = getHeaderData(db);
    res.json({ success: true, count: products.length, header, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: err.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const products = getProductsList(db);
    const product = products.find((p) => p.id === id || String(p.id) === String(id));

    if (!product) {
      return res.status(404).json({ success: false, message: `Product with ID '${id}' not found` });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const db = readDb();
    const products = getProductsList(db);
    const newProduct = req.body;

    if (!newProduct.title) {
      return res.status(400).json({ success: false, message: 'Product title is required' });
    }

    // Generate unique ID slug if not provided
    if (!newProduct.id) {
      newProduct.id = newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
    }

    // Check duplicate ID
    const exists = products.some((p) => p.id === newProduct.id);
    if (exists) {
      newProduct.id = `${newProduct.id}-${Date.now()}`;
    }

    // Auto-calculate num index if missing
    if (!newProduct.num) {
      const nextIndex = products.length + 1;
      newProduct.num = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
    }

    const updatedProducts = [...products, newProduct];
    db.products = updatedProducts;
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const products = getProductsList(db);
    const index = products.findIndex((p) => p.id === id || String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Product with ID '${id}' not found` });
    }

    const updatedProduct = {
      ...products[index],
      ...req.body,
      id: req.body.id || products[index].id
    };

    products[index] = updatedProduct;
    db.products = products;
    writeDb(db);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product', error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const products = getProductsList(db);

    if (products.length <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot delete the only remaining product' });
    }

    const filtered = products.filter((p) => p.id !== id && String(p.id) !== String(id));

    if (filtered.length === products.length) {
      return res.status(404).json({ success: false, message: `Product with ID '${id}' not found` });
    }

    db.products = filtered;
    writeDb(db);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: filtered
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
};

// Reorder all products
exports.reorderProducts = async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ success: false, message: 'Products array is required' });
    }

    const db = readDb();
    db.products = products;
    writeDb(db);

    res.json({
      success: true,
      message: 'Products reordered successfully',
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reorder products', error: err.message });
  }
};
