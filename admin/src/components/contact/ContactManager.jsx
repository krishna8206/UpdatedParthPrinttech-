'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  Sliders,
  Sparkles,
  Save,
  RefreshCw,
  Edit3,
  Trash2,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Share2,
  ExternalLink,
  MessageSquare,
  User,
  ArrowRight,
  Phone,
  FileText
} from 'lucide-react';
import { api, FRONTEND_URL } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const initialContactState = {
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
  ],
  inquiries: []
};

const INQUIRY_SUBJECTS = [
  "Custom Packaging",
  "Gravure Printing",
  "Rigid Boxes",
  "General Query"
];

const STATUS_OPTIONS = ["New", "In Progress", "Contacted", "Resolved"];

export default function ContactManager() {
  const [activeSubTab, setActiveSubTab] = useState('header');
  const [contactData, setContactData] = useState(initialContactState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getContactAdminData();
      if (res.success && res.data) {
        setContactData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load contact data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save Contact Page Content CMS
  const handleSaveContent = async (sectionName = 'Contact section') => {
    setIsSaving(true);
    try {
      const payload = {
        header: contactData.header,
        cards: contactData.cards,
        map: contactData.map,
        socials: contactData.socials,
        trustBadges: contactData.trustBadges
      };
      await api.updateContactContent(payload);
      toast.success(`${sectionName} saved successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to save contact content');
    } finally {
      setIsSaving(false);
    }
  };

  // State modification helpers
  const handleNestedField = (section, field, value) => {
    setContactData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleTrustBadgeChange = (index, value) => {
    const updated = [...(contactData.trustBadges || [])];
    updated[index] = value;
    setContactData((prev) => ({ ...prev, trustBadges: updated }));
  };

  // Update Status of Customer Inquiry
  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const res = await api.updateInquiryStatus(inquiryId, { status: newStatus });
      if (res.success) {
        const updated = (contactData.inquiries || []).map(i => i.id === inquiryId ? { ...i, status: newStatus } : i);
        setContactData((prev) => ({ ...prev, inquiries: updated }));
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
        toast.success(`Inquiry marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Delete Customer Inquiry
  const handleDeleteInquiry = async (inquiryId) => {
    if (!confirm('Are you sure you want to remove this customer inquiry?')) return;
    try {
      await api.deleteInquiry(inquiryId);
      const updated = (contactData.inquiries || []).filter(i => i.id !== inquiryId);
      setContactData((prev) => ({ ...prev, inquiries: updated }));
      if (isModalOpen && selectedInquiry?.id === inquiryId) {
        setIsModalOpen(false);
        setSelectedInquiry(null);
      }
      toast.success('Inquiry deleted');
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  // View Inquiry Modal
  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  // Sub-tabs config strictly arranged as present in Frontend (Header -> Direct Cards -> Map -> Socials -> Badges -> Inquiries)
  const subTabsConfig = [
    { id: 'header', label: '1. Page Header & Hero', icon: FileText },
    { id: 'cards', label: '2. Direct Contact Cards', icon: PhoneCall },
    { id: 'map', label: '3. Factory Map & Address', icon: MapPin },
    { id: 'socials', label: '4. Social Media Links', icon: Share2 },
    { id: 'badges', label: '5. Form & Trust Badges', icon: ShieldCheck },
    { id: 'inquiries', label: '6. Customer Inquiries (CRM)', icon: MessageSquare, count: contactData.inquiries?.length },
  ];

  // Filtered inquiries
  const filteredInquiries = (contactData.inquiries || []).filter(item => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchSubject = subjectFilter === 'All' || item.subject === subjectFilter;
    const query = searchTerm.toLowerCase();
    const matchSearch = !query ||
      item.fullName?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.message?.toLowerCase().includes(query) ||
      item.subject?.toLowerCase().includes(query);

    return matchStatus && matchSubject && matchSearch;
  });

  // Inquiry pipeline metrics
  const inqStats = {
    total: contactData.inquiries?.length || 0,
    new: contactData.inquiries?.filter(i => i.status === 'New').length || 0,
    inProgress: contactData.inquiries?.filter(i => i.status === 'In Progress').length || 0,
    contacted: contactData.inquiries?.filter(i => i.status === 'Contacted').length || 0,
    resolved: contactData.inquiries?.filter(i => i.status === 'Resolved').length || 0,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' };
      case 'In Progress': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'Contacted': return { bg: '#f3e8ff', color: '#9333ea', border: '#e9d5ff' };
      case 'Resolved': return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
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
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading Contact Inquiries & CMS data...</p>
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
            href={`${FRONTEND_URL}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. PAGE HEADER & HERO (Section 1 in Frontend)            */}
      {/* ======================================================== */}
      {activeSubTab === 'header' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <FileText size={20} color="var(--primary)" /> 1. Main Headline & Subtitle
              </h3>
              <p className="card-subtitle">Primary editorial headline and project calibration copy at the top of the Contact page.</p>
            </div>
            <button onClick={() => handleSaveContent('Page Header')} className="btn btn-primary" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Header'}
            </button>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Title Line 1</label>
              <input
                type="text"
                className="form-input"
                value={contactData.header?.title || ''}
                onChange={(e) => handleNestedField('header', 'title', e.target.value)}
                placeholder="e.g. Let's craft"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Title Highlight (Cyan Accent)</label>
              <input
                type="text"
                className="form-input"
                value={contactData.header?.titleHighlight || ''}
                onChange={(e) => handleNestedField('header', 'titleHighlight', e.target.value)}
                placeholder="e.g. something remarkable"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Title End</label>
              <input
                type="text"
                className="form-input"
                value={contactData.header?.titleRest || ''}
                onChange={(e) => handleNestedField('header', 'titleRest', e.target.value)}
                placeholder="e.g. together"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Hero Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={contactData.header?.description || ''}
              onChange={(e) => handleNestedField('header', 'description', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DIRECT CONTACT CARDS (Section 2 in Frontend)          */}
      {/* ======================================================== */}
      {activeSubTab === 'cards' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <PhoneCall size={20} color="var(--primary)" /> 2. Direct Contact Cards
              </h3>
              <p className="card-subtitle">Cards on the left column displaying direct email, telephone hotline, and response time promise.</p>
            </div>
            <button onClick={() => handleSaveContent('Contact Cards')} className="btn btn-primary" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Contact Cards'}
            </button>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
              ✉️ Email Us Card
            </h4>
            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactData.cards?.email || ''}
                  onChange={(e) => handleNestedField('cards', 'email', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Card Hint Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.cards?.emailHint || ''}
                  onChange={(e) => handleNestedField('cards', 'emailHint', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
              📞 Call Us Hotline Card
            </h4>
            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Hotline Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.cards?.phone || ''}
                  onChange={(e) => handleNestedField('cards', 'phone', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Hours Hint</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.cards?.phoneHint || ''}
                  onChange={(e) => handleNestedField('cards', 'phoneHint', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-main)' }}>
              ⏱️ Estimated Response Time Card
            </h4>
            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Response Time Value (e.g. Under 24 Hours)</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.cards?.responseTime || ''}
                  onChange={(e) => handleNestedField('cards', 'responseTime', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Response Guarantee Subtext</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.cards?.responseTimeHint || ''}
                  onChange={(e) => handleNestedField('cards', 'responseTimeHint', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FACTORY LOCATION & MAP (Section 3 in Frontend)        */}
      {/* ======================================================== */}
      {activeSubTab === 'map' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <MapPin size={20} color="var(--primary)" /> 3. Schematic Map & Factory Location
              </h3>
              <p className="card-subtitle">Stylized interactive blueprint map hotspot and physical address details on the contact page.</p>
            </div>
            <button onClick={() => handleSaveContent('Location & Map')} className="btn btn-primary" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Map Location'}
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">City Blueprint Name (e.g. KALOL)</label>
              <input
                type="text"
                className="form-input"
                value={contactData.map?.city || ''}
                onChange={(e) => handleNestedField('map', 'city', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State / Region (e.g. Gandhinagar, Gujarat)</label>
              <input
                type="text"
                className="form-input"
                value={contactData.map?.state || ''}
                onChange={(e) => handleNestedField('map', 'state', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Physical Postal Address</label>
            <input
              type="text"
              className="form-input"
              value={contactData.map?.address || ''}
              onChange={(e) => handleNestedField('map', 'address', e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Google Maps Link</label>
            <input
              type="text"
              className="form-input"
              value={contactData.map?.mapLink || ''}
              onChange={(e) => handleNestedField('map', 'mapLink', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SOCIAL MEDIA LINKS (Section 4 in Frontend)            */}
      {/* ======================================================== */}
      {activeSubTab === 'socials' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Share2 size={20} color="var(--primary)" /> 4. Social Media Profiles
              </h3>
              <p className="card-subtitle">Social network channel links displayed below the interactive map.</p>
            </div>
            <button onClick={() => handleSaveContent('Social Links')} className="btn btn-primary" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Socials'}
            </button>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Twitter / X URL</label>
              <input
                type="text"
                className="form-input"
                value={contactData.socials?.twitter || ''}
                onChange={(e) => handleNestedField('socials', 'twitter', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input
                type="text"
                className="form-input"
                value={contactData.socials?.instagram || ''}
                onChange={(e) => handleNestedField('socials', 'instagram', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">LinkedIn URL</label>
              <input
                type="text"
                className="form-input"
                value={contactData.socials?.linkedin || ''}
                onChange={(e) => handleNestedField('socials', 'linkedin', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Dribbble URL</label>
              <input
                type="text"
                className="form-input"
                value={contactData.socials?.dribbble || ''}
                onChange={(e) => handleNestedField('socials', 'dribbble', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GitHub URL</label>
              <input
                type="text"
                className="form-input"
                value={contactData.socials?.github || ''}
                onChange={(e) => handleNestedField('socials', 'github', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FORM & TRUST BADGES (Section 5 in Frontend)           */}
      {/* ======================================================== */}
      {activeSubTab === 'badges' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <ShieldCheck size={20} color="var(--primary)" /> 5. Form Footer Trust Badges
              </h3>
              <p className="card-subtitle">Three reassurance trust badges displayed underneath the inquiry submit button on the right column.</p>
            </div>
            <button onClick={() => handleSaveContent('Trust Badges')} className="btn btn-primary" disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Trust Badges'}
            </button>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {(contactData.trustBadges || ["Private & secure", "24hr reply", "No spam ever"]).map((badge, bIdx) => (
              <div key={bIdx} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Trust Badge #{bIdx + 1}</label>
                <input
                  type="text"
                  className="form-input"
                  value={badge}
                  onChange={(e) => handleTrustBadgeChange(bIdx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. CUSTOMER INQUIRIES (CRM) (Section 6)                  */}
      {/* ======================================================== */}
      {activeSubTab === 'inquiries' && (
        <div>
          {/* Metrics Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #0284c7' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{inqStats.total}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Total Inquiries</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #0284c7' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>{inqStats.new}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>New Unread</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #d97706' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706' }}>{inqStats.inProgress}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>In Progress</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #9333ea' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#9333ea' }}>{inqStats.contacted}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Contacted</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', borderTop: '4px solid #16a34a' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#16a34a' }}>{inqStats.resolved}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Resolved / Closed</div>
            </div>
          </div>

          {/* Inquiries Table / Cards Container */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 className="card-title">
                  <MessageSquare size={20} color="var(--primary)" /> 6. Customer Inquiry Messages & Leads
                </h3>
                <p className="card-subtitle">
                  Incoming contact inquiries submitted through the frontend contact page.
                </p>
              </div>

              {/* Search Bar */}
              <div style={{ display: 'flex', gap: '8px', minWidth: '260px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, email, message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status & Subject Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                <Filter size={14} style={{ marginRight: '4px' }} /> Status:
              </span>
              {['All', ...STATUS_OPTIONS].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px', padding: '4px 12px' }}
                >
                  {st}
                </button>
              ))}

              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: '16px', marginRight: '8px' }}>
                Subject:
              </span>
              {['All', ...INQUIRY_SUBJECTS].map(subj => (
                <button
                  key={subj}
                  onClick={() => setSubjectFilter(subj)}
                  className={`btn btn-sm ${subjectFilter === subj ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px', padding: '4px 12px' }}
                >
                  {subj}
                </button>
              ))}
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>No inquiries found</h4>
                <p style={{ fontSize: '13px' }}>Messages sent through the Contact Us form on the live site will appear here.</p>
              </div>
            ) : (
              <div className="items-list">
                {filteredInquiries.map((inq, idx) => {
                  const badge = getStatusBadge(inq.status);
                  return (
                    <div key={inq.id || idx} className="item-card">
                      <div className="item-card-header">
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                              {inq.fullName}
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
                              {inq.status || 'New'}
                            </span>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155', fontWeight: 700 }}>
                              {inq.subject || 'Custom Packaging'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Submitted: {inq.submittedAt ? new Date(inq.submittedAt).toLocaleString() : 'Recent'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '18px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            <span>✉️ <strong>Email:</strong> {inq.email}</span>
                          </div>

                          {inq.message && (
                            <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '8px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', lineHeight: 1.5 }}>
                              {inq.message}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="item-card-actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a
                              href={`mailto:${inq.email}?subject=Re: Inquiry on ${inq.subject || 'Parth Printtech'}`}
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--primary)', fontWeight: 700 }}
                            >
                              <Mail size={14} /> Reply Email
                            </a>

                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => openInquiryModal(inq)}
                            >
                              <Eye size={14} /> View
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteInquiry(inq.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Status select */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Stage:</span>
                            <select
                              className="form-input"
                              style={{ padding: '3px 8px', fontSize: '12px', height: 'auto', width: 'auto' }}
                              value={inq.status || 'New'}
                              onChange={(e) => handleStatusChange(inq.id, e.target.value)}
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
      {/* INQUIRY DETAIL MODAL                                     */}
      {/* ======================================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedInquiry ? `Inquiry from: ${selectedInquiry.fullName}` : 'Inquiry Details'}
      >
        {selectedInquiry && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  {selectedInquiry.fullName}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Subject: <strong>{selectedInquiry.subject}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Stage:</span>
                <select
                  className="form-input"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Client Email</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{selectedInquiry.email}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Received On</div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>
                  {selectedInquiry.submittedAt ? new Date(selectedInquiry.submittedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>FULL MESSAGE / SPECIFICATIONS</div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '14px', lineHeight: 1.6, color: 'var(--text-main)', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap' }}>
                {selectedInquiry.message}
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '24px -24px -24px -24px', display: 'flex', justifyContent: 'space-between' }}>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: Inquiry regarding ${selectedInquiry.subject || 'Parth Printtech'}`}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Mail size={16} /> Open Email Reply
              </a>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">Close</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
