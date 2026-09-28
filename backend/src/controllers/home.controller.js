const { readDb, writeDb } = require('../data/db');

// Get all home sections
exports.getHomeData = (req, res) => {
  try {
    const db = readDb();
    res.json({
      success: true,
      data: {
        ...(db.home || {}),
        heroVideo: db.home?.heroVideo || '/videos/0918(2) (1).mp4',
      }
    });
  } catch (err) {
    console.error('[Home] Error fetching home data:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve home data' });
  }
};

// Hero Slides
exports.getHeroSlides = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.heroSlides || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve hero slides' });
  }
};

exports.updateHeroSlides = (req, res) => {
  try {
    const db = readDb();
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: 'Request body must be an array of slides' });
    }
    db.home.heroSlides = req.body;
    writeDb(db);
    res.json({ success: true, message: 'Hero slides updated successfully', data: db.home.heroSlides });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero slides' });
  }
};

// Hero Background Video
exports.getHeroVideo = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: { heroVideo: db.home?.heroVideo || '/videos/0918(2) (1).mp4' } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve hero video' });
  }
};

exports.updateHeroVideo = (req, res) => {
  try {
    const db = readDb();
    const { heroVideo } = req.body;
    if (!heroVideo) {
      return res.status(400).json({ success: false, message: 'heroVideo URL is required' });
    }
    db.home.heroVideo = heroVideo;
    writeDb(db);
    res.json({ success: true, message: 'Hero background video updated successfully', data: { heroVideo: db.home.heroVideo } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero video' });
  }
};

// Who We Are
exports.getWhoWeAre = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.whoWeAre || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve Who We Are data' });
  }
};

exports.updateWhoWeAre = (req, res) => {
  try {
    const db = readDb();
    db.home.whoWeAre = { ...db.home.whoWeAre, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Who We Are section updated successfully', data: db.home.whoWeAre });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update Who We Are section' });
  }
};

// Markets We Serve
exports.getMarkets = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.markets || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve markets data' });
  }
};

exports.updateMarkets = (req, res) => {
  try {
    const db = readDb();
    db.home.markets = { ...db.home.markets, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Markets section updated successfully', data: db.home.markets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update markets section' });
  }
};

// Featured Products
exports.getFeaturedProducts = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.featuredProducts || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve featured products' });
  }
};

exports.updateFeaturedProducts = (req, res) => {
  try {
    const db = readDb();
    db.home.featuredProducts = { ...db.home.featuredProducts, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Featured products updated successfully', data: db.home.featuredProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update featured products' });
  }
};

// Clients
exports.getClients = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.clients || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve clients' });
  }
};

exports.updateClients = (req, res) => {
  try {
    const db = readDb();
    db.home.clients = { ...db.home.clients, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Clients section updated successfully', data: db.home.clients });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update clients section' });
  }
};

// Testimonials
exports.getTestimonials = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.testimonials || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve testimonials' });
  }
};

exports.updateTestimonials = (req, res) => {
  try {
    const db = readDb();
    db.home.testimonials = { ...db.home.testimonials, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Testimonials updated successfully', data: db.home.testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update testimonials' });
  }
};

// Values
exports.getValues = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.home?.values || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve values' });
  }
};

exports.updateValues = (req, res) => {
  try {
    const db = readDb();
    db.home.values = { ...db.home.values, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Values updated successfully', data: db.home.values });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update values' });
  }
};

// Global Settings
exports.getSettings = (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, data: db.settings || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve settings' });
  }
};

exports.updateSettings = (req, res) => {
  try {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json({ success: true, message: 'Settings updated successfully', data: db.settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};
