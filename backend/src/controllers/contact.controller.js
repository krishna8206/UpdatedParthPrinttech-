const { readDb, writeDb } = require('../data/db');

const defaultContactData = {
  header: {
    title: "Let's craft",
    titleHighlight: "something remarkable",
    titleRest: "together",
    description: "Have a custom packaging design in mind or require gravure printing specs? Our packaging specialists are ready to calibrate your next project."
  },
  cards: {
    email: "info@parthprinttech.com",
    emailHint: "Click to open mail client",
    phone: "+91 99788 88056",
    phoneHint: "Mon - Sat, 9am - 7pm IST",
    responseTime: "Under 24 Hours",
    responseTimeHint: "Our engineering team will review your specs within 1 business day."
  },
  map: {
    city: "KALOL",
    state: "Gandhinagar, Gujarat",
    address: "47/8, G.I.D.C., Kalol - 382725 (N.G.), Dist. Gandhinagar, Gujarat, India.",
    mapLink: "https://maps.google.com/?q=GIDC+Kalol+Gandhinagar+Gujarat+India"
  },
  socials: {
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    dribbble: "https://dribbble.com",
    github: "https://github.com"
  },
  trustBadges: [
    "Private & secure",
    "24hr reply",
    "No spam ever"
  ]
};

function getContactFromDb(db) {
  if (db.contactPage && typeof db.contactPage === 'object') {
    return {
      header: { ...defaultContactData.header, ...(db.contactPage.header || {}) },
      cards: { ...defaultContactData.cards, ...(db.contactPage.cards || {}) },
      map: { ...defaultContactData.map, ...(db.contactPage.map || {}) },
      socials: { ...defaultContactData.socials, ...(db.contactPage.socials || {}) },
      trustBadges: Array.isArray(db.contactPage.trustBadges) ? db.contactPage.trustBadges : defaultContactData.trustBadges
    };
  }
  return defaultContactData;
}

function getInquiriesFromDb(db) {
  return Array.isArray(db.contactInquiries) ? db.contactInquiries : [];
}

// 1. Get Public Contact Page Content
exports.getContactData = async (req, res) => {
  try {
    const db = readDb();
    const contactData = getContactFromDb(db);
    res.json({ success: true, data: contactData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact page data', error: err.message });
  }
};

// 2. Submit Public Customer Inquiry
exports.submitInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ success: false, message: 'Email and message are required' });
    }

    const db = readDb();
    const inquiries = getInquiriesFromDb(db);

    const newInquiry = {
      id: `inq-${Date.now()}`,
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Client',
      email,
      subject: subject || 'Custom Packaging',
      message,
      status: 'New', // New, In Progress, Contacted, Resolved
      submittedAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    db.contactInquiries = inquiries;
    writeDb(db);

    res.json({
      success: true,
      message: 'Thank you for reaching out! Our team will get back to you shortly.',
      data: newInquiry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry', error: err.message });
  }
};

// 3. Get Admin Contact Page & Inquiries
exports.getContactAdminData = async (req, res) => {
  try {
    const db = readDb();
    const contactData = getContactFromDb(db);
    const inquiries = getInquiriesFromDb(db);

    res.json({
      success: true,
      data: {
        ...contactData,
        inquiries
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin contact data', error: err.message });
  }
};

// 4. Update Contact Page Content
exports.updateContactContent = async (req, res) => {
  try {
    const db = readDb();
    const current = getContactFromDb(db);

    const updated = {
      ...current,
      ...req.body
    };

    db.contactPage = updated;
    writeDb(db);

    res.json({
      success: true,
      message: 'Contact page content updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update contact content', error: err.message });
  }
};

// 5. Update Inquiry Status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = readDb();
    const inquiries = getInquiriesFromDb(db);
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inquiries[index].status = status;
    inquiries[index].updatedAt = new Date().toISOString();
    db.contactInquiries = inquiries;
    writeDb(db);

    res.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      data: inquiries[index]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry status', error: err.message });
  }
};

// 6. Delete Customer Inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    let inquiries = getInquiriesFromDb(db);
    const initialLen = inquiries.length;

    inquiries = inquiries.filter(i => i.id !== id);
    if (inquiries.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    db.contactInquiries = inquiries;
    writeDb(db);

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry', error: err.message });
  }
};
