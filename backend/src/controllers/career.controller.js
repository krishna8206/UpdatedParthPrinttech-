const { readDb, writeDb } = require('../data/db');
const path = require('path');
const fs = require('fs');

const defaultCareerData = {
  hero: {
    title: "Build Your Career,",
    titleHighlight: "Print Your Future",
    description: "At Parth Printtech, we craft more than packaging — we build careers. Join a team of passionate engineers, designers, and print technicians pushing the boundaries of precision and creativity.",
    ctaPrimaryText: "View Open Roles",
    ctaPrimaryLink: "#open-roles",
    ctaSecondaryText: "Talk to Us",
    ctaSecondaryLink: "/contact",
    stats: [
      { id: "years", value: "10+", label: "Years of Excellence" },
      { id: "team", value: "150+", label: "Team Members" },
      { id: "rating", value: "5★", label: "Work Culture" }
    ],
    visualCard: {
      openRolesTag: "Open Roles",
      activePositionsSubtitle: "Active positions",
      sampleRoles: [
        "Print Production Technician",
        "Packaging Design Engineer",
        "Quality Control Lead"
      ],
      tenureLabel: "Avg. Tenure",
      avgTenure: "4.2",
      tenureSubtitle: "years per employee",
      cultureBadge: "Diverse, Inclusive Workplace",
      refCode: "HRM-REF-2026"
    }
  },
  culture: {
    title: "Work Where",
    titleHighlight: "Precision",
    titleRest: "Meets Passion",
    description: "We don't just make packaging — we build careers with purpose. Here's what sets life at Parth Printtech apart.",
    items: [
      {
        id: "safety",
        title: "Safety First, Always",
        desc: "We maintain the highest workplace safety standards in every production zone. Our team works in certified, hazard-free environments with regular audits and training.",
        chips: ["ISO Certified", "Safety Audits"],
        iconName: "ShieldCheck"
      },
      {
        id: "collaborative",
        title: "Collaborative Culture",
        desc: "Cross-functional teams, open office layouts, and a flat hierarchy. Ideas come from everywhere — whether you're on the press floor or in the design studio.",
        chips: ["Flat Hierarchy", "Team Sprints"],
        iconName: "Smile"
      },
      {
        id: "growth",
        title: "Continuous Growth",
        desc: "Annual skill workshops, sponsored certifications, and mentorship programs. We invest in your development at every stage of your career.",
        chips: ["L&D Budget", "Mentorship"],
        iconName: "TrendingUp"
      },
      {
        id: "benefits",
        title: "Competitive Benefits",
        desc: "Performance bonuses, medical insurance, paid time off, and flexible shifts. We reward excellence with packages that reflect your true value.",
        chips: ["Health Insurance", "Performance Pay"],
        iconName: "CreditCard"
      },
      {
        id: "diverse",
        title: "Diverse & Inclusive",
        desc: "We celebrate every background, language, and perspective. Our workforce spans multiple states and communities with zero tolerance for discrimination.",
        chips: ["Equal Opportunity", "Multilingual Team"],
        iconName: "Users"
      },
      {
        id: "recognition",
        title: "Recognition & Impact",
        desc: "Employee spotlights, annual awards, and project ownership. Your contributions are visible, credited, and celebrated across the organization.",
        chips: ["Monthly Awards", "Impact-driven"],
        iconName: "Award"
      }
    ]
  },
  process: {
    title: "Our Hiring",
    titleHighlight: "Process",
    description: "A straightforward, transparent process designed to find the best mutual fit — for you and for us.",
    steps: [
      {
        id: "step1",
        num: "01",
        title: "Submit Application",
        desc: "Fill out our online form with your resume and a brief cover message. We accept rolling applications year-round.",
        tag: "Step 01"
      },
      {
        id: "step2",
        num: "02",
        title: "Initial Screening",
        desc: "Our HR team reviews every application carefully. Shortlisted candidates receive an email within 3–5 business days.",
        tag: "Step 02"
      },
      {
        id: "step3",
        num: "03",
        title: "Interview Rounds",
        desc: "A structured 1–2 round interview process — technical, culture-fit, and a practical assignment for senior roles.",
        tag: "Step 03"
      },
      {
        id: "step4",
        num: "04",
        title: "Offer & Onboarding",
        desc: "Selected candidates receive a competitive offer. Our onboarding program ensures you're set up for success from day one.",
        tag: "Step 04"
      }
    ]
  },
  roles: [
    {
      id: "role-1",
      title: "Senior Print Production Technician",
      dept: "Production",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "4–7 yrs",
      isNew: true,
      isActive: true,
      description: "Operate high-speed gravure and flexographic presses with micron accuracy and register consistency.",
      requirements: ["Diploma / Degree in Printing Tech", "4+ years operating rotogravure machines", "Color matching & pre-flight knowledge"]
    },
    {
      id: "role-2",
      title: "Packaging Design Engineer",
      dept: "Design",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "2–5 yrs",
      isNew: false,
      isActive: true,
      description: "Develop 3D packaging mockups, CAD contour fits, and pre-press prep for shrink sleeves and BOPP wrap labels.",
      requirements: ["Proficiency in Adobe Illustrator, Photoshop & ESKO", "Experience with shrink distortion calibration", "Knowledge of CMYK & Spot Color separations"]
    },
    {
      id: "role-3",
      title: "Quality Control & Inspection Lead",
      dept: "QC",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "3–6 yrs",
      isNew: true,
      isActive: true,
      description: "Lead comprehensive quality checks, optical scuff tests, barcode grade scans, and shrink ratio verifications.",
      requirements: ["Experience in packaging QC & ISO standards", "Knowledge of spectrophotometer & rub resistance testing", "Attention to detail & reporting skills"]
    },
    {
      id: "role-4",
      title: "Sales Executive – Print & Packaging",
      dept: "Sales",
      location: "Gujarat / Remote",
      type: "Full-time",
      experience: "2–4 yrs",
      isNew: false,
      isActive: true,
      description: "Drive B2B sales of custom shrink sleeves, BOPP labels, and flexible packaging solutions to FMCG and Pharma clients.",
      requirements: ["Proven B2B sales track record in print/packaging", "Strong communication & negotiation skills", "Ability to manage client relationship pipelines"]
    },
    {
      id: "role-5",
      title: "Gravure Press Operator",
      dept: "Production",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "3–8 yrs",
      isNew: false,
      isActive: true,
      description: "Supervise cylinder setup, ink viscosity, web tension, and solvent regulation during high-speed printing runs.",
      requirements: ["Extensive rotogravure experience", "Understanding of PVC & PETG shrink films", "Machine maintenance & troubleshooting skills"]
    },
    {
      id: "role-6",
      title: "Graphic Design Specialist (Pre-press)",
      dept: "Design",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "1–3 yrs",
      isNew: true,
      isActive: true,
      description: "Transform customer brand vectors into press-ready cylinder engravings with trapping, bleeding, and barcode checks.",
      requirements: ["Degree/Certification in Graphic Design", "Mastery in Vector Artwork & Pre-press Workflow", "Knowledge of print separations & spot lacquers"]
    },
    {
      id: "role-7",
      title: "Supply Chain & Procurement Manager",
      dept: "Operations",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "5–9 yrs",
      isNew: false,
      isActive: true,
      description: "Oversee raw material sourcing for polymer films, specialized inks, adhesives, and dispatch logistics across India.",
      requirements: ["5+ years procurement in plastics/packaging", "Vendor negotiation & contract management", "ERP and inventory tracking proficiency"]
    },
    {
      id: "role-8",
      title: "HR & Talent Acquisition Executive",
      dept: "HR",
      location: "Gujarat, India",
      type: "Full-time",
      experience: "1–3 yrs",
      isNew: true,
      isActive: true,
      description: "Manage candidate pipelines, conduct screening interviews, organize employee training, and uphold safety cultures.",
      requirements: ["MBA / BBA in Human Resources", "Strong interpersonal & recruiting skills", "Knowledge of labor regulations & HR best practices"]
    },
    {
      id: "role-9",
      title: "Junior Sales Intern – B2B",
      dept: "Sales",
      location: "Remote",
      type: "Internship",
      experience: "0–1 yr",
      isNew: true,
      isActive: true,
      description: "Assist the sales team in market research, client outreach, lead qualification, and sample kit dispatch.",
      requirements: ["Enthusiastic graduate with marketing/business passion", "Good verbal & written communication", "Willingness to learn industrial packaging sales"]
    }
  ],
  contact: {
    title: "Start Your",
    titleHighlight: "Journey",
    titleRest: "With Us",
    description: "Send us your application and let's explore how your skills can contribute to Parth Printtech's legacy of precision and innovation. We review every submission personally.",
    responseTime: "We reply within 3–5 business days",
    email: "careers@parthprinttech.com",
    office: "47/8, G.I.D.C., Kalol - 382725 (N.G.), Dist. Gandhinagar, Gujarat, India",
    phone: "+91 99788 88056"
  }
};

function getCareerFromDb(db) {
  if (db.career) {
    return {
      hero: {
        ...defaultCareerData.hero,
        ...(db.career.hero || {}),
        visualCard: {
          ...defaultCareerData.hero.visualCard,
          ...(db.career.hero?.visualCard || {})
        }
      },
      culture: { ...defaultCareerData.culture, ...(db.career.culture || {}) },
      process: { ...defaultCareerData.process, ...(db.career.process || {}) },
      roles: Array.isArray(db.career.roles) ? db.career.roles : defaultCareerData.roles,
      contact: { ...defaultCareerData.contact, ...(db.career.contact || {}) }
    };
  }
  return defaultCareerData;
}

function getApplicationsFromDb(db) {
  return Array.isArray(db.careerApplications) ? db.careerApplications : [];
}

// 1. Get Public Career Data (Active Roles only)
exports.getCareerData = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    // Filter active roles only for public frontend
    const activeRoles = (career.roles || []).filter(r => r.isActive !== false);
    res.json({
      success: true,
      data: {
        ...career,
        roles: activeRoles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch career data', error: err.message });
  }
};

// 2. Get Admin Career Data (All Roles + Full Applications List)
exports.getCareerAdminData = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    const applications = getApplicationsFromDb(db);
    res.json({
      success: true,
      data: {
        ...career,
        applications
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch career admin data', error: err.message });
  }
};

// 3. Update Hero Section
exports.updateHero = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    db.career = {
      ...career,
      hero: { ...career.hero, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Hero section updated successfully', data: db.career.hero });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hero', error: err.message });
  }
};

// 4. Update Culture Section
exports.updateCulture = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    db.career = {
      ...career,
      culture: { ...career.culture, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Work culture section updated successfully', data: db.career.culture });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update culture', error: err.message });
  }
};

// 5. Update Hiring Process Section
exports.updateProcess = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    db.career = {
      ...career,
      process: { ...career.process, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Hiring process updated successfully', data: db.career.process });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update process', error: err.message });
  }
};

// 6. Update Full Roles List (Bulk / Reorder)
exports.updateRoles = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    db.career = {
      ...career,
      roles: Array.isArray(req.body.roles) ? req.body.roles : career.roles
    };
    writeDb(db);
    res.json({ success: true, message: 'Job roles updated successfully', data: db.career.roles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update roles', error: err.message });
  }
};

// 7. Create New Role
exports.createRole = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    const newRole = {
      id: `role-${Date.now()}`,
      title: req.body.title || 'New Job Position',
      dept: req.body.dept || 'Production',
      location: req.body.location || 'Gujarat, India',
      type: req.body.type || 'Full-time',
      experience: req.body.experience || '1–3 yrs',
      isNew: req.body.isNew !== undefined ? req.body.isNew : true,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      description: req.body.description || '',
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : []
    };
    career.roles = [newRole, ...(career.roles || [])];
    db.career = career;
    writeDb(db);
    res.json({ success: true, message: 'Job role created successfully', data: newRole });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create role', error: err.message });
  }
};

// 8. Update Single Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const career = getCareerFromDb(db);
    const idx = (career.roles || []).findIndex(r => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Job role not found' });
    }
    career.roles[idx] = {
      ...career.roles[idx],
      ...req.body,
      id
    };
    db.career = career;
    writeDb(db);
    res.json({ success: true, message: 'Job role updated successfully', data: career.roles[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update role', error: err.message });
  }
};

// 9. Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const career = getCareerFromDb(db);
    career.roles = (career.roles || []).filter(r => r.id !== id);
    db.career = career;
    writeDb(db);
    res.json({ success: true, message: 'Job role deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete role', error: err.message });
  }
};

// 10. Update Contact & Sidebar Info
exports.updateContact = async (req, res) => {
  try {
    const db = readDb();
    const career = getCareerFromDb(db);
    db.career = {
      ...career,
      contact: { ...career.contact, ...req.body }
    };
    writeDb(db);
    res.json({ success: true, message: 'Contact info updated successfully', data: db.career.contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update contact info', error: err.message });
  }
};

// 11. Public: Submit Candidate Application (With optional resume file)
exports.submitApplication = async (req, res) => {
  try {
    const db = readDb();
    const applications = getApplicationsFromDb(db);

    let resumeUrl = req.body.resumeUrl || '';
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      candidateName: `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim() || 'Candidate',
      email: req.body.email || '',
      phone: req.body.phone || '',
      role: req.body.role || 'General Application',
      experience: req.body.experience || 'Not specified',
      message: req.body.message || '',
      resumeUrl,
      status: 'New', // 'New' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired'
      appliedAt: new Date().toISOString()
    };

    applications.unshift(newApplication);
    db.careerApplications = applications;
    writeDb(db);

    res.json({
      success: true,
      message: 'Application submitted successfully! Our HR team will reach out soon.',
      data: newApplication
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application', error: err.message });
  }
};

// 12. Admin: Get Applications List
exports.getApplications = async (req, res) => {
  try {
    const db = readDb();
    const applications = getApplicationsFromDb(db);
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications', error: err.message });
  }
};

// 13. Admin: Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const db = readDb();
    const applications = getApplicationsFromDb(db);
    const idx = applications.findIndex(a => a.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    applications[idx] = {
      ...applications[idx],
      status: status || applications[idx].status,
      notes: notes !== undefined ? notes : applications[idx].notes,
      updatedAt: new Date().toISOString()
    };

    db.careerApplications = applications;
    writeDb(db);

    res.json({ success: true, message: 'Application status updated', data: applications[idx] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update application status', error: err.message });
  }
};

// 14. Admin: Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    let applications = getApplicationsFromDb(db);
    applications = applications.filter(a => a.id !== id);
    db.careerApplications = applications;
    writeDb(db);
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete application', error: err.message });
  }
};
