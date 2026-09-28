const { readDb, writeDb } = require('../data/db');

const defaultAboutData = {
  hero: {
    title: "Engineering Packaging With",
    titleHighlight: "Precision",
    description: "Since 2009, Parth Printtech has been delivering high-quality packaging and labeling solutions. We specialize in PVC Shrink Sleeves, PETG Shrink Sleeves, BOPP Wrap-Around Labels, Heat Transfer Labels (HTL), and Plain PVC Shrink Film, with a focus on quality, precision, and reliable performance.",
    videoSrc: "/videos/video-3.mp4",
    ctaText: "Get a Quote",
    ctaLink: "/contact",
    image1: "/images/Who_We_Are.jpg",
    image2: "/images/products/bopp_label.png",
    image3: "/images/products/pvc_shrink_sleeves.png"
  },
  whoWeAre: {
    subtitle: "WHO WE ARE",
    title: "Pioneers in",
    titleHighlight: "Precision Packaging",
    titleRest: "& Modern Labeling",
    leadText: "At Parth Printtech, we combine technical excellence with state-of-the-art manufacturing to produce world-class shrink sleeve packaging and high-precision labeling solutions.",
    bodyText: "Since 2009, we have partnered with leading brands across FMCG, cosmetics, pharmaceuticals, food & beverage, and industrial sectors. Our specialized facility operates high-speed gravure and flexographic presses engineered to meet demanding commercial volume while maintaining strict micron tolerances.",
    image: "/images/Who_We_Are.jpg",
    metrics: [
      { id: "1", value: "17+", label: "Years of Experience" },
      { id: "2", value: "50+", label: "Sectors Served" },
      { id: "3", value: "100%", label: "Quality Guarantee" }
    ]
  },
  founders: {
    subtitle: "LEADERSHIP & VISION",
    title: "Meet Our",
    titleHighlight: "Founders",
    description: "Driven by technical innovation and an unwavering commitment to packaging excellence.",
    image: "/images/clients/world_map_blueprint.png",
    badgeText: "FOUNDERS & DIRECTORS",
    foundersList: [
      {
        id: "1",
        index: "01",
        name: "Parth Patel",
        description: "Leading strategic vision and technology adoption in high-precision shrink sleeves and printing innovation."
      },
      {
        id: "2",
        index: "02",
        name: "Shailesh Patel",
        description: "Pioneering industrial print engineering, rotogravure calibrations, and operational excellence across commercial markets."
      }
    ]
  },
  visionMission: {
    title: "Driven By Purpose,",
    titleHighlight: "Built For Quality",
    description: "We are committed to redefining packaging standards through precision, consistent quality, and innovative printing solutions. Every product we create reflects our dedication to durability, vibrant color, and superior craftsmanship.",
    cards: [
      {
        id: "vision",
        title: "Our Vision",
        description: "To become a trusted leader in the printing and packaging industry by delivering innovative, sustainable, and high-quality labeling solutions."
      },
      {
        id: "mission",
        title: "Our Mission",
        description: "To provide reliable printing and packaging solutions with advanced technology, consistent quality, and a strong commitment to customer satisfaction."
      },
      {
        id: "philosophy",
        title: "Our Philosophy",
        description: "We believe quality starts with the process. Every product is made with precision, attention to detail, and a commitment to delivering packaging solutions that add value to every brand."
      }
    ]
  },
  history: {
    badgeLabel: "2009 – 2026 EVOLUTION",
    title: "Our Journey of",
    titleHighlight: "Evolution",
    centerBadge: "17 YEARS",
    inception: {
      year: "2009",
      tag: "INCEPTION",
      title: "Founding Printing Setup",
      description: "Established core B2B label & packaging operations."
    },
    current: {
      year: "2026",
      tag: "GLOBAL LEADER",
      title: "Global Packaging Reach",
      description: "Supplying 50+ industries with automated precision."
    }
  }
};

function getAboutDataFromDb(db) {
  if (db.about && typeof db.about === 'object') {
    return {
      hero: { ...defaultAboutData.hero, ...(db.about.hero || {}) },
      whoWeAre: { ...defaultAboutData.whoWeAre, ...(db.about.whoWeAre || {}) },
      founders: { ...defaultAboutData.founders, ...(db.about.founders || {}) },
      visionMission: { ...defaultAboutData.visionMission, ...(db.about.visionMission || {}) },
      history: { ...defaultAboutData.history, ...(db.about.history || {}) }
    };
  }
  return defaultAboutData;
}

// Get complete about data
exports.getAboutData = async (req, res) => {
  try {
    const db = readDb();
    const aboutData = getAboutDataFromDb(db);
    res.json({ success: true, data: aboutData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch about data', error: err.message });
  }
};

// Update full about data
exports.updateAboutData = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      ...req.body
    };
    writeDb(db);
    res.json({ success: true, message: 'About page data updated successfully', data: db.about });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update about data', error: err.message });
  }
};

// Update Hero
exports.updateAboutHero = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      hero: { ...existing.hero, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Hero section updated successfully', data: db.about.hero });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero', error: err.message });
  }
};

// Update Who We Are
exports.updateAboutWhoWeAre = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      whoWeAre: { ...existing.whoWeAre, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Who We Are section updated successfully', data: db.about.whoWeAre });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update Who We Are', error: err.message });
  }
};

// Update Founders
exports.updateAboutFounders = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      founders: { ...existing.founders, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Founders section updated successfully', data: db.about.founders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update Founders', error: err.message });
  }
};

// Update Vision & Mission
exports.updateAboutVisionMission = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      visionMission: { ...existing.visionMission, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Vision & Mission updated successfully', data: db.about.visionMission });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update Vision & Mission', error: err.message });
  }
};

// Update History
exports.updateAboutHistory = async (req, res) => {
  try {
    const db = readDb();
    const existing = getAboutDataFromDb(db);
    db.about = {
      ...existing,
      history: { ...existing.history, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Evolution history updated successfully', data: db.about.history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update history', error: err.message });
  }
};
