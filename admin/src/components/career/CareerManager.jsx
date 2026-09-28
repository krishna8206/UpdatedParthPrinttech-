'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Sliders,
  Sparkles,
  Save,
  RefreshCw,
  Edit3,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Users,
  Award,
  Clock,
  Target,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download,
  Filter,
  Search,
  Eye,
  Check,
  X,
  ShieldCheck,
  Smile,
  TrendingUp,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const initialCareerState = {
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
  roles: [],
  contact: {
    title: "Start Your",
    titleHighlight: "Journey",
    titleRest: "With Us",
    description: "Send us your application and let's explore how your skills can contribute to Parth Printtech's legacy of precision and innovation. We review every submission personally.",
    responseTime: "We reply within 3–5 business days",
    email: "careers@parthprinttech.com",
    office: "47/8, G.I.D.C., Kalol - 382725 (N.G.), Dist. Gandhinagar, Gujarat, India",
    phone: "+91 99788 88056"
  },
  applications: []
};

const DEPARTMENTS = ["Production", "Design", "QC", "Sales", "Operations", "HR", "Management"];
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const STATUS_OPTIONS = ["New", "Reviewing", "Shortlisted", "Rejected", "Hired"];

export default function CareerManager() {
  // Ordered strictly in alignment with frontend layout
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [careerData, setCareerData] = useState(initialCareerState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Filters & Searches
  const [roleDeptFilter, setRoleDeptFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appSearchTerm, setAppSearchTerm] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'role', 'culture', 'step', 'viewApp'
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getCareerAdminData();
      if (res.success && res.data) {
        setCareerData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load career data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Section level save
  const handleSaveSection = async (sectionKey) => {
    setIsSaving(true);
    try {
      if (sectionKey === 'hero') {
        await api.updateCareerHero(careerData.hero);
        toast.success('Hero & Metrics saved successfully!');
      } else if (sectionKey === 'culture') {
        await api.updateCareerCulture(careerData.culture);
        toast.success('Work Culture section saved successfully!');
      } else if (sectionKey === 'process') {
        await api.updateCareerProcess(careerData.process);
        toast.success('Hiring Process saved successfully!');
      } else if (sectionKey === 'roles') {
        await api.updateCareerRoles(careerData.roles);
        toast.success('Job roles saved successfully!');
      } else if (sectionKey === 'contact') {
        await api.updateCareerContact(careerData.contact);
        toast.success('Contact info saved successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  // State modification helpers
  const handleNestedField = (section, field, value) => {
    setCareerData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleStatChange = (index, field, value) => {
    const updated = [...(careerData.hero?.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    setCareerData((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: updated }
    }));
  };

  // Modal open helpers
  const openModal = (type, index = null, defaultData = {}) => {
    setModalType(type);
    setEditingIndex(index);
    if (index !== null) {
      if (type === 'role') setModalForm({ ...careerData.roles[index] });
      else if (type === 'culture') setModalForm({ ...careerData.culture.items[index] });
      else if (type === 'step') setModalForm({ ...careerData.process.steps[index] });
      else if (type === 'viewApp') setModalForm({ ...careerData.applications[index] });
    } else {
      setModalForm(defaultData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setModalForm({});
  };

  // Submit Modal changes
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalType === 'role') {
        if (editingIndex !== null) {
          const roleId = careerData.roles[editingIndex].id;
          const res = await api.updateCareerRole(roleId, modalForm);
          if (res.success) {
            const updated = [...careerData.roles];
            updated[editingIndex] = res.data;
            setCareerData((prev) => ({ ...prev, roles: updated }));
            toast.success('Job role updated!');
          }
        } else {
          const res = await api.createCareerRole(modalForm);
          if (res.success) {
            setCareerData((prev) => ({ ...prev, roles: [res.data, ...prev.roles] }));
            toast.success('New job role posted!');
          }
        }
      } else if (modalType === 'culture') {
        const items = [...(careerData.culture.items || [])];
        if (editingIndex !== null) {
          items[editingIndex] = modalForm;
        } else {
          items.push({ ...modalForm, id: `culture-${Date.now()}` });
        }
        const updatedCulture = { ...careerData.culture, items };
        await api.updateCareerCulture(updatedCulture);
        setCareerData((prev) => ({ ...prev, culture: updatedCulture }));
        toast.success('Culture pillars updated!');
      } else if (modalType === 'step') {
        const steps = [...(careerData.process.steps || [])];
        if (editingIndex !== null) {
          steps[editingIndex] = modalForm;
        } else {
          steps.push({ ...modalForm, id: `step-${Date.now()}` });
        }
        const updatedProcess = { ...careerData.process, steps };
        await api.updateCareerProcess(updatedProcess);
        setCareerData((prev) => ({ ...prev, process: updatedProcess }));
        toast.success('Hiring process steps updated!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Role Active Status
  const toggleRoleStatus = async (index) => {
    const role = careerData.roles[index];
    const newStatus = !role.isActive;
    try {
      const res = await api.updateCareerRole(role.id, { isActive: newStatus });
      if (res.success) {
        const updated = [...careerData.roles];
        updated[index] = { ...updated[index], isActive: newStatus };
        setCareerData((prev) => ({ ...prev, roles: updated }));
        toast.success(`Role ${newStatus ? 'Activated' : 'Drafted'}`);
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  // Toggle Role "New" Badge
  const toggleRoleNew = async (index) => {
    const role = careerData.roles[index];
    const newBadge = !role.isNew;
    try {
      const res = await api.updateCareerRole(role.id, { isNew: newBadge });
      if (res.success) {
        const updated = [...careerData.roles];
        updated[index] = { ...updated[index], isNew: newBadge };
        setCareerData((prev) => ({ ...prev, roles: updated }));
        toast.success(`"New" badge ${newBadge ? 'enabled' : 'removed'}`);
      }
    } catch (err) {
      toast.error('Failed to toggle badge');
    }
  };

  // Delete Job Role
  const handleDeleteRole = async (index) => {
    if (!confirm('Are you sure you want to delete this job position?')) return;
    const role = careerData.roles[index];
    try {
      await api.deleteCareerRole(role.id);
      const updated = careerData.roles.filter((_, i) => i !== index);
      setCareerData((prev) => ({ ...prev, roles: updated }));
      toast.success('Job role deleted');
    } catch (err) {
      toast.error('Failed to delete role');
    }
  };

  // Reorder Roles
  const moveRole = async (index, direction) => {
    const list = [...careerData.roles];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setCareerData((prev) => ({ ...prev, roles: list }));
    try {
      await api.updateCareerRoles(list);
      toast.success('Role order updated');
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  // Reorder Culture Pillars
  const moveCulture = async (index, direction) => {
    const items = [...(careerData.culture?.items || [])];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;

    const updatedCulture = { ...careerData.culture, items };
    setCareerData((prev) => ({ ...prev, culture: updatedCulture }));
    try {
      await api.updateCareerCulture(updatedCulture);
      toast.success('Pillar order updated');
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  // Delete Culture Pillar
  const handleDeleteCulture = async (index) => {
    if (!confirm('Are you sure you want to delete this culture pillar?')) return;
    const items = (careerData.culture?.items || []).filter((_, i) => i !== index);
    const updatedCulture = { ...careerData.culture, items };
    setCareerData((prev) => ({ ...prev, culture: updatedCulture }));
    try {
      await api.updateCareerCulture(updatedCulture);
      toast.success('Culture pillar deleted');
    } catch (err) {
      toast.error('Failed to delete pillar');
    }
  };

  // Reorder Process Steps
  const moveStep = async (index, direction) => {
    const steps = [...(careerData.process?.steps || [])];
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const temp = steps[index];
    steps[index] = steps[target];
    steps[target] = temp;

    const updatedProcess = { ...careerData.process, steps };
    setCareerData((prev) => ({ ...prev, process: updatedProcess }));
    try {
      await api.updateCareerProcess(updatedProcess);
      toast.success('Step order updated');
    } catch (err) {
      toast.error('Failed to reorder');
    }
  };

  // Delete Process Step
  const handleDeleteStep = async (index) => {
    if (!confirm('Are you sure you want to delete this process step?')) return;
    const steps = (careerData.process?.steps || []).filter((_, i) => i !== index);
    const updatedProcess = { ...careerData.process, steps };
    setCareerData((prev) => ({ ...prev, process: updatedProcess }));
    try {
      await api.updateCareerProcess(updatedProcess);
      toast.success('Process step deleted');
    } catch (err) {
      toast.error('Failed to delete step');
    }
  };

  // Update Application Status in ATS
  const handleAppStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.updateCareerApplicationStatus(appId, { status: newStatus });
      if (res.success) {
        const updated = careerData.applications.map(a => a.id === appId ? { ...a, status: newStatus } : a);
        setCareerData((prev) => ({ ...prev, applications: updated }));
        if (modalForm.id === appId) {
          setModalForm((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success(`Application marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Delete Application
  const handleDeleteApp = async (appId) => {
    if (!confirm('Are you sure you want to remove this applicant record?')) return;
    try {
      await api.deleteCareerApplication(appId);
      const updated = careerData.applications.filter(a => a.id !== appId);
      setCareerData((prev) => ({ ...prev, applications: updated }));
      if (isModalOpen && modalForm.id === appId) closeModal();
      toast.success('Application deleted');
    } catch (err) {
      toast.error('Failed to delete application');
    }
  };

  // Sub-tabs arranged EXACTLY in sequential order as appearing on Frontend:
  // 1. Hero Section (CareerHero)
  // 2. Work Culture (CareerCulture)
  // 3. Hiring Process (CareerProcess)
  // 4. Open Roles (CareerOpenRoles)
  // 5. Contact Info (CareerApply Sidebar)
  // 6. Candidate ATS (CareerApply Submissions)
  const subTabsConfig = [
    { id: 'hero', label: '1. Hero & Metrics', icon: Sliders },
    { id: 'culture', label: '2. Work Culture', icon: Award, count: careerData.culture?.items?.length },
    { id: 'process', label: '3. Hiring Process', icon: Target, count: careerData.process?.steps?.length },
    { id: 'roles', label: '4. Open Roles', icon: Briefcase, count: careerData.roles?.length },
    { id: 'contact', label: '5. Contact Details', icon: Phone },
    { id: 'applications', label: '6. Candidate ATS', icon: FileText, count: careerData.applications?.length },
  ];

  // Filtered Roles
  const filteredRoles = (careerData.roles || []).filter(r => {
    if (roleDeptFilter === 'All') return true;
    return r.dept === roleDeptFilter;
  });

  // Filtered Applications
  const filteredApps = (careerData.applications || []).filter(a => {
    const matchStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
    const query = appSearchTerm.toLowerCase();
    const matchSearch = !query ||
      a.candidateName?.toLowerCase().includes(query) ||
      a.email?.toLowerCase().includes(query) ||
      a.role?.toLowerCase().includes(query) ||
      a.phone?.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  // Application Stats
  const appStats = {
    total: careerData.applications?.length || 0,
    new: careerData.applications?.filter(a => a.status === 'New').length || 0,
    reviewing: careerData.applications?.filter(a => a.status === 'Reviewing').length || 0,
    shortlisted: careerData.applications?.filter(a => a.status === 'Shortlisted').length || 0,
    hired: careerData.applications?.filter(a => a.status === 'Hired').length || 0,
    rejected: careerData.applications?.filter(a => a.status === 'Rejected').length || 0,
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' };
      case 'Reviewing': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'Shortlisted': return { bg: '#f3e8ff', color: '#9333ea', border: '#e9d5ff' };
      case 'Hired': return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
      case 'Rejected': return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' };
      default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid #cbd5e1',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading Career CMS & Applicant records...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sub-Tabs & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="tabs-header" style={{ marginBottom: 0, flex: '1 1 auto' }}>
        {subTabsConfig.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeSubTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveSubTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '11px',
                    background: activeSubTab === tab.id ? 'var(--primary-light)' : '#e2e8f0',
                    color: activeSubTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={fetchData}
            className="btn btn-secondary btn-sm"
            title="Refresh data from server"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Data
          </button>
          <a
            href="http://localhost:3000/career"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HERO & METRICS (Section 1 in Frontend)                */}
      {/* ======================================================== */}
      {activeSubTab === 'hero' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Sliders size={20} color="var(--primary)" /> Hero Headline & Description
                </h3>
                <p className="card-subtitle">Edit the primary headline and value proposition on the Career page.</p>
              </div>
              <button onClick={() => handleSaveSection('hero')} className="btn btn-primary" disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Hero Section'}
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.title || ''}
                  onChange={(e) => handleNestedField('hero', 'title', e.target.value)}
                  placeholder="e.g. Build Your Career,"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title Highlight (Cyan Accent)</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.titleHighlight || ''}
                  onChange={(e) => handleNestedField('hero', 'titleHighlight', e.target.value)}
                  placeholder="e.g. Print Your Future"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hero Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={careerData.hero?.description || ''}
                onChange={(e) => handleNestedField('hero', 'description', e.target.value)}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Primary CTA Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.ctaPrimaryText || ''}
                  onChange={(e) => handleNestedField('hero', 'ctaPrimaryText', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Primary CTA Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.ctaPrimaryLink || ''}
                  onChange={(e) => handleNestedField('hero', 'ctaPrimaryLink', e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Secondary CTA Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.ctaSecondaryText || ''}
                  onChange={(e) => handleNestedField('hero', 'ctaSecondaryText', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Secondary CTA Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.hero?.ctaSecondaryLink || ''}
                  onChange={(e) => handleNestedField('hero', 'ctaSecondaryLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. WORK CULTURE (Section 2 in Frontend)                  */}
      {/* ======================================================== */}
      {activeSubTab === 'culture' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Award size={20} color="var(--primary)" /> Section Header
                </h3>
                <p className="card-subtitle">Headline and description for the Work Culture section.</p>
              </div>
              <button onClick={() => handleSaveSection('culture')} className="btn btn-primary" disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Culture Section'}
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.culture?.title || ''}
                  onChange={(e) => handleNestedField('culture', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title Highlight</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.culture?.titleHighlight || ''}
                  onChange={(e) => handleNestedField('culture', 'titleHighlight', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={careerData.culture?.description || ''}
                onChange={(e) => handleNestedField('culture', 'description', e.target.value)}
              />
            </div>
          </div>

          {/* Culture Cards List */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Culture Pillars Cards</h3>
                <p className="card-subtitle">Manage the 6 core pillars describing working life at Parth Printtech.</p>
              </div>
              <button
                onClick={() => openModal('culture', null, {
                  title: 'New Culture Pillar',
                  desc: 'Pillar description detailing workplace advantages.',
                  chips: ['Team Focus', 'Excellence'],
                  iconName: 'ShieldCheck'
                })}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} /> Add Pillar
              </button>
            </div>

            <div className="items-list">
              {(careerData.culture?.items || []).map((item, idx) => (
                <div key={item.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        {(item.chips || []).map((chip, ci) => (
                          <span key={ci} style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveCulture(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveCulture(idx, 1)}
                        disabled={idx === (careerData.culture?.items?.length || 1) - 1}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openModal('culture', idx)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCulture(idx)}
                        title="Delete culture pillar"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. HIRING PROCESS (Section 3 in Frontend)                */}
      {/* ======================================================== */}
      {activeSubTab === 'process' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Target size={20} color="var(--primary)" /> Section Header
                </h3>
                <p className="card-subtitle">Introductory header for the recruitment roadmap.</p>
              </div>
              <button onClick={() => handleSaveSection('process')} className="btn btn-primary" disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Process'}
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.process?.title || ''}
                  onChange={(e) => handleNestedField('process', 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title Highlight</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.process?.titleHighlight || ''}
                  onChange={(e) => handleNestedField('process', 'titleHighlight', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={careerData.process?.description || ''}
                onChange={(e) => handleNestedField('process', 'description', e.target.value)}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="card-title">Hiring Steps Timeline</h3>
                <p className="card-subtitle">Configure the sequential milestones of candidate evaluation.</p>
              </div>
              <button
                onClick={() => openModal('step', null, {
                  num: `0${(careerData.process?.steps?.length || 0) + 1}`,
                  title: 'New Hiring Step',
                  desc: 'Description of candidate assessment step.',
                  tag: `Step 0${(careerData.process?.steps?.length || 0) + 1}`
                })}
                className="btn btn-primary btn-sm"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>

            <div className="items-list">
              {(careerData.process?.steps || []).map((step, idx) => (
                <div key={step.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {step.num || `0${idx + 1}`}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {step.title}
                        </h4>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveStep(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => moveStep(idx, 1)}
                        disabled={idx === (careerData.process?.steps?.length || 1) - 1}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openModal('step', idx)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteStep(idx)}
                        title="Delete process step"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. OPEN ROLES (Section 4 in Frontend)                    */}
      {/* ======================================================== */}
      {activeSubTab === 'roles' && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="card-title">
                  <Briefcase size={20} color="var(--primary)" /> Job Openings & Role Postings
                </h3>
                <p className="card-subtitle">
                  Create, edit, reorder, and toggle active/draft status of jobs displayed on the website.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => openModal('role', null, {
                    title: 'New Position',
                    dept: 'Production',
                    location: 'Gujarat, India',
                    type: 'Full-time',
                    experience: '2–4 yrs',
                    isNew: true,
                    isActive: true,
                    description: '',
                    requirements: []
                  })}
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Post New Job
                </button>
              </div>
            </div>

            {/* Department Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <Filter size={14} style={{ marginRight: '4px' }} /> Department:
              </span>
              {['All', ...DEPARTMENTS].map(dept => (
                <button
                  key={dept}
                  onClick={() => setRoleDeptFilter(dept)}
                  className={`btn btn-sm ${roleDeptFilter === dept ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px', padding: '4px 12px' }}
                >
                  {dept}
                  <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.8 }}>
                    {dept === 'All' ? careerData.roles?.length || 0 : (careerData.roles || []).filter(r => r.dept === dept).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Roles List */}
            <div className="items-list">
              {filteredRoles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No job positions found in this category. Click <strong>Post New Job</strong> to create one.
                </div>
              ) : (
                filteredRoles.map((role, idx) => {
                  const originalIndex = careerData.roles.findIndex(r => r.id === role.id);
                  return (
                    <div key={role.id || idx} className="item-card" style={{ opacity: role.isActive ? 1 : 0.65, borderLeft: role.isActive ? '4px solid var(--primary)' : '4px solid #94a3b8' }}>
                      <div className="item-card-header">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              {role.title}
                            </h4>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
                              {role.dept}
                            </span>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                              {role.type}
                            </span>
                            {role.isNew && (
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                                NEW
                              </span>
                            )}
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: role.isActive ? '#ecfdf5' : '#fee2e2', color: role.isActive ? '#059669' : '#dc2626', fontWeight: 700 }}>
                              {role.isActive ? 'Active on Live Site' : 'Draft / Hidden'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                            <span>📍 {role.location}</span>
                            <span>⏱️ {role.experience}</span>
                          </div>

                          {role.description && (
                            <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '8px', lineHeight: 1.5 }}>
                              {role.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="item-card-actions">
                          <button
                            type="button"
                            className={`btn btn-sm ${role.isActive ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => toggleRoleStatus(originalIndex)}
                            title={role.isActive ? 'Hide from live site' : 'Publish to live site'}
                          >
                            {role.isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleRoleNew(originalIndex)}
                            title="Toggle 'New' badge"
                          >
                            {role.isNew ? 'Unmark New' : 'Mark New'}
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => moveRole(originalIndex, -1)}
                            disabled={originalIndex === 0}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => moveRole(originalIndex, 1)}
                            disabled={originalIndex === careerData.roles.length - 1}
                          >
                            <ArrowDown size={14} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openModal('role', originalIndex)}
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteRole(originalIndex)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. APPLY & CONTACT SETTINGS (Section 5 in Frontend)      */}
      {/* ======================================================== */}
      {activeSubTab === 'contact' && (
        <div>
          {/* Section Header Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <FileText size={20} color="var(--primary)" /> Section Header & Invitation
                </h3>
                <p className="card-subtitle">
                  Headline and invitation description displayed on the left column above contact details.
                </p>
              </div>
              <button onClick={() => handleSaveSection('contact')} className="btn btn-primary" disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Contact Settings'}
              </button>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.title || ''}
                  onChange={(e) => handleNestedField('contact', 'title', e.target.value)}
                  placeholder="e.g. Start Your"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title Highlight (Cyan Accent)</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.titleHighlight || ''}
                  onChange={(e) => handleNestedField('contact', 'titleHighlight', e.target.value)}
                  placeholder="e.g. Journey"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title End</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.titleRest || ''}
                  onChange={(e) => handleNestedField('contact', 'titleRest', e.target.value)}
                  placeholder="e.g. With Us"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Section Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={careerData.contact?.description || ''}
                onChange={(e) => handleNestedField('contact', 'description', e.target.value)}
                placeholder="e.g. Send us your application and let's explore how your skills can contribute..."
              />
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Phone size={20} color="var(--primary)" /> Application Sidebar Contact Information
                </h3>
                <p className="card-subtitle">
                  Direct HR contact details displayed below the invitation on the left column.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">HR Response Time Note</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.responseTime || ''}
                  onChange={(e) => handleNestedField('contact', 'responseTime', e.target.value)}
                  placeholder="e.g. We reply within 3–5 business days"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Careers Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={careerData.contact?.email || ''}
                  onChange={(e) => handleNestedField('contact', 'email', e.target.value)}
                  placeholder="e.g. careers@parthprinttech.com"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">HR Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.phone || ''}
                  onChange={(e) => handleNestedField('contact', 'phone', e.target.value)}
                  placeholder="e.g. +91 99788 88056"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Factory / Office Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={careerData.contact?.office || ''}
                  onChange={(e) => handleNestedField('contact', 'office', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. CANDIDATE APPLICATIONS (ATS Pipeline)                 */}
      {/* ======================================================== */}
      {activeSubTab === 'applications' && (
        <div>
          {/* ATS Pipeline Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #0284c7' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{appStats.total}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Total Applications</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #0284c7' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>{appStats.new}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>New Submissions</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #d97706' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706' }}>{appStats.reviewing}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>In Review</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #9333ea' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#9333ea' }}>{appStats.shortlisted}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Shortlisted</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #16a34a' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>{appStats.hired}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Hired</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #dc2626' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626' }}>{appStats.rejected}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Rejected</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="card-title">
                  <FileText size={20} color="var(--primary)" /> Candidate Submissions & Resumes
                </h3>
                <p className="card-subtitle">
                  Review applicant profiles, download uploaded CVs/resumes, and track hiring stages.
                </p>
              </div>

              {/* Search Box */}
              <div style={{ display: 'flex', gap: '8px', minWidth: '260px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, role, email..."
                  value={appSearchTerm}
                  onChange={(e) => setAppSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <Filter size={14} style={{ marginRight: '4px' }} /> Status:
              </span>
              {['All', ...STATUS_OPTIONS].map(status => (
                <button
                  key={status}
                  onClick={() => setAppStatusFilter(status)}
                  className={`btn btn-sm ${appStatusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px', padding: '4px 12px' }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Applications List */}
            {filteredApps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <FileText size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>No candidate applications found</h4>
                <p style={{ fontSize: '13px' }}>Applications submitted by users on the frontend /career page will appear here instantly.</p>
              </div>
            ) : (
              <div className="items-list">
                {filteredApps.map((app, idx) => {
                  const badge = getStatusBadgeClass(app.status);
                  return (
                    <div key={app.id || idx} className="item-card">
                      <div className="item-card-header">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                              {app.candidateName}
                            </h4>
                            <span
                              style={{
                                fontSize: '11px',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`,
                                fontWeight: 700
                              }}
                            >
                              {app.status || 'New'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '18px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span>💼 <strong>Role:</strong> {app.role}</span>
                            <span>⏱️ <strong>Experience:</strong> {app.experience}</span>
                            <span>✉️ <strong>Email:</strong> {app.email}</span>
                            {app.phone && <span>📞 <strong>Phone:</strong> {app.phone}</span>}
                          </div>

                          {app.message && (
                            <p style={{ fontSize: '12.5px', color: 'var(--text-main)', marginTop: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                              &ldquo;{app.message}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="item-card-actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {app.resumeUrl ? (
                              <a
                                href={`http://localhost:5000${app.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-sm"
                                style={{ color: 'var(--primary)', fontWeight: 700 }}
                              >
                                <Download size={14} /> View Resume
                              </a>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px' }}>
                                No resume attached
                              </span>
                            )}

                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => openModal('viewApp', careerData.applications.findIndex(a => a.id === app.id))}
                            >
                              <Eye size={14} /> Details
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteApp(app.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Quick status selector */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Stage:</span>
                            <select
                              className="form-input"
                              style={{ padding: '3px 8px', fontSize: '12px', height: 'auto', width: 'auto' }}
                              value={app.status || 'New'}
                              onChange={(e) => handleAppStatusChange(app.id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DIALOGS                                            */}
      {/* ======================================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === 'role'
            ? editingIndex !== null ? `Edit Position: ${modalForm.title || ''}` : 'Post New Job Position'
            : modalType === 'culture'
            ? 'Edit Work Culture Pillar'
            : modalType === 'step'
            ? 'Edit Hiring Process Step'
            : modalType === 'viewApp'
            ? `Applicant: ${modalForm.candidateName || ''}`
            : 'Edit'
        }
      >
        {/* Applicant Detail View */}
        {modalType === 'viewApp' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {modalForm.candidateName}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Applied for <strong>{modalForm.role}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                <select
                  className="form-input"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                  value={modalForm.status || 'New'}
                  onChange={(e) => handleAppStatusChange(modalForm.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{modalForm.email || 'N/A'}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{modalForm.phone || 'N/A'}</div>
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Experience Level</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{modalForm.experience || 'N/A'}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Application Date</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>
                  {modalForm.appliedAt ? new Date(modalForm.appliedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {modalForm.message && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>COVER MESSAGE</div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                  {modalForm.message}
                </div>
              </div>
            )}

            {modalForm.resumeUrl && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>ATTACHED RESUME / CV</div>
                <a
                  href={`http://localhost:5000${modalForm.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Download size={16} /> Download / Open Resume Document
                </a>
              </div>
            )}

            <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
              <button type="button" onClick={closeModal} className="btn btn-secondary">Close</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDeleteApp(modalForm.id)}
              >
                <Trash2 size={14} /> Delete Record
              </button>
            </div>
          </div>
        ) : (
          /* Form for Role, Culture, Step */
          <form onSubmit={handleModalSubmit}>
            {/* Job Role Form */}
            {modalType === 'role' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.title || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Print Production Technician"
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-input"
                      value={modalForm.dept || 'Production'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, dept: e.target.value }))}
                      required
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employment Type</label>
                    <select
                      className="form-input"
                      value={modalForm.type || 'Full-time'}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      {JOB_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.location || ''}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Gujarat, India"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience Required</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.experience || ''}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, experience: e.target.value }))}
                      placeholder="e.g. 2–5 yrs"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={modalForm.description || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Key responsibilities and day-to-day duties..."
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      id="role-is-new"
                      checked={modalForm.isNew || false}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, isNew: e.target.checked }))}
                    />
                    <label htmlFor="role-is-new" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Show &ldquo;NEW&rdquo; Badge on Live Site
                    </label>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      id="role-is-active"
                      checked={modalForm.isActive !== false}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <label htmlFor="role-is-active" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Active (Visible to Job Seekers)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Culture Pillar Form */}
            {modalType === 'culture' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Pillar Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.title || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={modalForm.desc || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tag Chips (Comma Separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={Array.isArray(modalForm.chips) ? modalForm.chips.join(', ') : (modalForm.chips || '')}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, chips: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                    placeholder="e.g. ISO Certified, Safety Audits"
                  />
                </div>
              </div>
            )}

            {/* Step Form */}
            {modalType === 'step' && (
              <div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Step Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.num || ''}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, num: e.target.value }))}
                      placeholder="01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Step Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.title || ''}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Submit Application"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={modalForm.desc || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Step Badge / Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.tag || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, tag: e.target.value }))}
                    placeholder="Step 01"
                  />
                </div>
              </div>
            )}

            <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
              <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
