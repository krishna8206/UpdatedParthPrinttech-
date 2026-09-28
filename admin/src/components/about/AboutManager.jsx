'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Info,
  Sliders,
  Sparkles,
  Save,
  RefreshCw,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Video,
  Award,
  Clock,
  Target,
  Compass,
  CheckCircle2,
  Users
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../lib/media';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const initialAboutState = {
  hero: {
    title: 'Engineering Packaging With',
    titleHighlight: 'Precision',
    description: 'Since 2009, Parth Printtech has been delivering high-quality packaging and labeling solutions. We specialize in PVC Shrink Sleeves, PETG Shrink Sleeves, BOPP Wrap-Around Labels, Heat Transfer Labels (HTL), and Plain PVC Shrink Film, with a focus on quality, precision, and reliable performance.',
    videoSrc: '/videos/video-3.mp4',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
    image1: '/images/Who_We_Are.jpg',
    image2: '/images/products/bopp_label.png',
    image3: '/images/products/pvc_shrink_sleeves.png'
  },
  founders: {
    subtitle: 'LEADERSHIP & VISION',
    title: 'Meet Our',
    titleHighlight: 'Founders',
    description: 'Driven by technical innovation and an unwavering commitment to packaging excellence.',
    image: '/images/world_map_blueprint.png',
    badgeText: 'FOUNDERS & DIRECTORS',
    foundersList: [
      {
        id: '1',
        index: '01',
        name: 'Parth Patel',
        description: 'Leading strategic vision and technology adoption in high-precision shrink sleeves and printing innovation.'
      },
      {
        id: '2',
        index: '02',
        name: 'Shailesh Patel',
        description: 'Pioneering industrial print engineering, rotogravure calibrations, and operational excellence across commercial markets.'
      }
    ]
  },
  visionMission: {
    title: 'Driven By Purpose,',
    titleHighlight: 'Built For Quality',
    description: 'We are committed to redefining packaging standards through precision, consistent quality, and innovative printing solutions. Every product we create reflects our dedication to durability, vibrant color, and superior craftsmanship.',
    cards: [
      {
        id: 'vision',
        title: 'Our Vision',
        description: 'To become a trusted leader in the printing and packaging industry by delivering innovative, sustainable, and high-quality labeling solutions.'
      },
      {
        id: 'mission',
        title: 'Our Mission',
        description: 'To provide reliable printing and packaging solutions with advanced technology, consistent quality, and a strong commitment to customer satisfaction.'
      },
      {
        id: 'philosophy',
        title: 'Our Philosophy',
        description: 'We believe quality starts with the process. Every product is made with precision, attention to detail, and a commitment to delivering packaging solutions that add value to every brand.'
      }
    ]
  },
  history: {
    badgeLabel: '2009 – 2026 EVOLUTION',
    title: 'Our Journey of',
    titleHighlight: 'Evolution',
    centerBadge: '17 YEARS',
    inception: {
      year: '2009',
      tag: 'INCEPTION',
      title: 'Founding Printing Setup',
      description: 'Established core B2B label & packaging operations.'
    },
    current: {
      year: '2026',
      tag: 'GLOBAL LEADER',
      title: 'Global Packaging Reach',
      description: 'Supplying 50+ industries with automated precision.'
    }
  }
};

export default function AboutManager() {
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [aboutData, setAboutData] = useState(initialAboutState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State for Metric or Card Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'metric' or 'visionCard'
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getAboutData();
      if (res.success && res.data) {
        setAboutData({
          hero: { ...initialAboutState.hero, ...(res.data.hero || {}) },
          founders: { ...initialAboutState.founders, ...(res.data.founders || {}) },
          visionMission: { ...initialAboutState.visionMission, ...(res.data.visionMission || {}) },
          history: { ...initialAboutState.history, ...(res.data.history || {}) }
        });
      }
    } catch (err) {
      toast.error('Failed to load about data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save specific section header
  const handleSaveSection = async (sectionKey) => {
    setIsSaving(true);
    try {
      if (sectionKey === 'hero') {
        await api.updateAboutHero(aboutData.hero);
        toast.success('About Hero section saved successfully!');
      } else if (sectionKey === 'founders') {
        await api.updateAboutFounders(aboutData.founders);
        toast.success('Meet Our Founders section saved successfully!');
      } else if (sectionKey === 'visionMission') {
        await api.updateAboutVisionMission(aboutData.visionMission);
        toast.success('Vision & Mission section saved successfully!');
      } else if (sectionKey === 'history') {
        await api.updateAboutHistory(aboutData.history);
        toast.success('Evolution Timeline saved successfully!');
      } else {
        await api.updateAboutData(aboutData);
        toast.success('About page updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for nested field change
  const handleFieldChange = (section, field, value) => {
    setAboutData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Helper for hero image changes with auto-save
  const handleHeroImageChange = async (imageKey, newUrl, autoSave = false) => {
    const updatedHero = {
      ...aboutData.hero,
      [imageKey]: newUrl
    };
    setAboutData((prev) => ({
      ...prev,
      hero: updatedHero
    }));

    if (autoSave) {
      try {
        setIsSaving(true);
        await api.updateAboutHero(updatedHero);
        toast.success(`Image updated and saved to database!`);
      } catch (err) {
        toast.error('Failed to auto-save image: ' + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteHeroImage = async (imageKey, cardLabel) => {
    if (!window.confirm(`Are you sure you want to clear/delete the image for ${cardLabel}?`)) {
      return;
    }
    await handleHeroImageChange(imageKey, '', true);
    toast.info(`Cleared ${cardLabel} image.`);
  };

  // Helper for founder image changes with auto-save
  const handleFounderImageChange = async (newUrl, autoSave = false) => {
    const updatedFounders = {
      ...aboutData.founders,
      image: newUrl
    };
    setAboutData((prev) => ({
      ...prev,
      founders: updatedFounders
    }));

    if (autoSave) {
      try {
        setIsSaving(true);
        await api.updateAboutFounders(updatedFounders);
        toast.success('Founders showcase image updated and saved to database!');
      } catch (err) {
        toast.error('Failed to auto-save founders image: ' + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Modals for Vision Cards
  const openEditVisionCard = (idx) => {
    setModalType('visionCard');
    setEditingIndex(idx);
    setModalForm({ ...aboutData.visionMission.cards[idx] });
    setIsModalOpen(true);
  };

  const openAddVisionCard = () => {
    setModalType('visionCard');
    setEditingIndex(null);
    setModalForm({
      id: `pillar-${Date.now()}`,
      title: 'Our Core Value',
      description: 'Describe the purpose, innovation, and quality standards of this pillar.'
    });
    setIsModalOpen(true);
  };

  const removeVisionCard = async (idx) => {
    if (aboutData.visionMission.cards.length <= 1) {
      toast.error('Must maintain at least 1 pillar card.');
      return;
    }
    const cardTitle = aboutData.visionMission.cards[idx]?.title || 'Pillar card';
    if (!window.confirm(`Are you sure you want to delete "${cardTitle}"?`)) {
      return;
    }
    const updatedCards = aboutData.visionMission.cards.filter((_, i) => i !== idx);
    const updatedVisionSection = {
      ...aboutData.visionMission,
      cards: updatedCards
    };

    setAboutData((prev) => ({
      ...prev,
      visionMission: updatedVisionSection
    }));

    try {
      await api.updateAboutVisionMission(updatedVisionSection);
      toast.success('Pillar card removed and database updated!');
    } catch (err) {
      toast.error('Failed to remove pillar');
    }
  };

  const moveVisionCard = async (idx, direction) => {
    const cards = [...aboutData.visionMission.cards];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const temp = cards[idx];
    cards[idx] = cards[targetIdx];
    cards[targetIdx] = temp;

    const updatedVisionSection = {
      ...aboutData.visionMission,
      cards
    };

    setAboutData((prev) => ({
      ...prev,
      visionMission: updatedVisionSection
    }));

    try {
      await api.updateAboutVisionMission(updatedVisionSection);
      toast.success('Pillars reordered successfully!');
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  // Modals for Founders
  const openEditFounder = (idx) => {
    setModalType('founder');
    setEditingIndex(idx);
    setModalForm({ ...aboutData.founders.foundersList[idx] });
    setIsModalOpen(true);
  };

  const openAddFounder = () => {
    setModalType('founder');
    setEditingIndex(null);
    const nextIdx = (aboutData.founders.foundersList || []).length + 1;
    setModalForm({
      id: String(Date.now()),
      index: nextIdx < 10 ? `0${nextIdx}` : `${nextIdx}`,
      name: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setModalForm({});
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      if (modalType === 'visionCard') {
        let updatedCards;
        if (editingIndex !== null) {
          updatedCards = [...aboutData.visionMission.cards];
          updatedCards[editingIndex] = modalForm;
        } else {
          updatedCards = [...(aboutData.visionMission.cards || []), modalForm];
        }

        const updatedVisionSection = {
          ...aboutData.visionMission,
          cards: updatedCards
        };

        setAboutData((prev) => ({
          ...prev,
          visionMission: updatedVisionSection
        }));

        await api.updateAboutVisionMission(updatedVisionSection);
        toast.success(editingIndex !== null ? 'Pillar card updated and saved!' : 'New pillar card added and saved!');
      } else if (modalType === 'founder') {
        let updatedList;
        if (editingIndex !== null) {
          updatedList = [...aboutData.founders.foundersList];
          updatedList[editingIndex] = modalForm;
        } else {
          updatedList = [...(aboutData.founders.foundersList || []), modalForm];
        }

        const updatedFounders = {
          ...aboutData.founders,
          foundersList: updatedList
        };

        setAboutData((prev) => ({
          ...prev,
          founders: updatedFounders
        }));

        await api.updateAboutFounders(updatedFounders);
        toast.success(editingIndex !== null ? 'Founder profile updated and saved!' : 'New founder profile added and saved!');
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const removeFounder = async (idx) => {
    if ((aboutData.founders.foundersList || []).length <= 1) {
      toast.error('Must maintain at least 1 founder profile.');
      return;
    }
    const founderName = aboutData.founders.foundersList[idx]?.name || 'Founder';
    if (!window.confirm(`Are you sure you want to delete profile for "${founderName}"?`)) {
      return;
    }
    const updatedList = aboutData.founders.foundersList.filter((_, i) => i !== idx);
    const updatedFounders = {
      ...aboutData.founders,
      foundersList: updatedList
    };

    setAboutData((prev) => ({
      ...prev,
      founders: updatedFounders
    }));

    try {
      await api.updateAboutFounders(updatedFounders);
      toast.success('Founder profile removed and database updated!');
    } catch (err) {
      toast.error('Failed to remove founder profile');
    }
  };

  const moveFounder = async (idx, direction) => {
    const list = [...aboutData.founders.foundersList];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    const updatedFounders = {
      ...aboutData.founders,
      foundersList: list
    };

    setAboutData((prev) => ({
      ...prev,
      founders: updatedFounders
    }));

    try {
      await api.updateAboutFounders(updatedFounders);
      toast.success('Founders reordered successfully!');
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const subTabs = [
    { id: 'hero', label: 'Hero Video Banner', icon: Video },
    { id: 'founders', label: 'Meet Our Founders', icon: Users },
    { id: 'visionMission', label: 'Vision, Mission & Values', icon: Target },
    { id: 'history', label: 'Evolution Timeline', icon: Clock }
  ];

  return (
    <div>
      {/* Sub-Tabs & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="tabs-header" style={{ marginBottom: 0, display: 'flex', flexWrap: 'wrap', gap: '8px', flex: '1 1 auto' }}>
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeSubTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveSubTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={fetchData}
            className="btn btn-secondary btn-sm"
            title="Reload from backend"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Data
          </button>
          <a
            href="http://localhost:3000/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          Loading about section data...
        </div>
      ) : (
        <div>
          {/* 1. HERO TAB */}
          {activeSubTab === 'hero' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Video size={20} color="var(--primary)" /> Hero Video &amp; Structural Collage Banner
                  </h2>
                  <p className="card-subtitle">
                    Configure the background video, primary headline, description copy, CTA button, and 3 layered collage visuals.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('hero')}
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Hero Section'}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hero Title (Main Part)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.hero.title || ''}
                    onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                    placeholder="Engineering Packaging With"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Title (Cyan Highlight)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.hero.titleHighlight || ''}
                    onChange={(e) => handleFieldChange('hero', 'titleHighlight', e.target.value)}
                    placeholder="Precision"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hero Narrative Description</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={aboutData.hero.description || ''}
                  onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                  placeholder="Since 2009, Parth Printtech has been delivering..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CTA Button Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.hero.ctaText || ''}
                    onChange={(e) => handleFieldChange('hero', 'ctaText', e.target.value)}
                    placeholder="Get a Quote"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CTA Destination Link</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.hero.ctaLink || ''}
                    onChange={(e) => handleFieldChange('hero', 'ctaLink', e.target.value)}
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Background Video Path / Upload</label>
                <input
                  type="text"
                  className="form-input"
                  value={aboutData.hero.videoSrc || ''}
                  onChange={(e) => handleFieldChange('hero', 'videoSrc', e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <FileUpload
                  currentUrl={aboutData.hero.videoSrc}
                  label="Upload Background MP4 Video"
                  accept="video/*"
                  onUploadComplete={(url) => handleFieldChange('hero', 'videoSrc', url)}
                />
              </div>

              {/* 3 Collage Images with Full Edit/Delete & Live Previews */}
              <div style={{ marginTop: '28px', background: '#f8fafc', padding: '22px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={18} color="var(--primary)" /> Hero Collage Visual Cards (3 Right-Side Display Frames)
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Controls the 3 layered hero images on the About page. Uploading auto-saves immediately to the database.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('hero')}
                    className="btn btn-primary btn-sm"
                    disabled={isSaving}
                  >
                    <Save size={14} /> {isSaving ? 'Saving...' : 'Save Collage Visuals'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Card #1: Main Facility Base */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '6px' }}>
                        Card #1: Main Base
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Top Large Frame</span>
                    </div>

                    {/* Preview Area */}
                    <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {aboutData.hero.image1 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getMediaUrl(aboutData.hero.image1)}
                          alt="Card 1 Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '12px' }}>
                          <ImageIcon size={28} style={{ opacity: 0.4, marginBottom: '4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>No Image Configured</div>
                        </div>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Image URL / Path</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.hero.image1 || ''}
                        onChange={(e) => handleHeroImageChange('image1', e.target.value, false)}
                        onBlur={() => handleSaveSection('hero')}
                        placeholder="e.g. /images/Who_We_Are.jpg or uploaded URL"
                        style={{ fontSize: '12px' }}
                      />
                    </div>

                    <FileUpload
                      currentUrl={aboutData.hero.image1}
                      label="Upload / Replace Image #1"
                      accept="image/*"
                      showPreviewBar={false}
                      onUploadComplete={(url) => handleHeroImageChange('image1', url, true)}
                    />
                  </div>

                  {/* Card #2: BOPP / Product */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '6px' }}>
                        Card #2: BOPP / Product
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bottom-Left Frame</span>
                    </div>

                    {/* Preview Area */}
                    <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {aboutData.hero.image2 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getMediaUrl(aboutData.hero.image2)}
                          alt="Card 2 Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '12px' }}>
                          <ImageIcon size={28} style={{ opacity: 0.4, marginBottom: '4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>No Image Configured</div>
                        </div>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Image URL / Path</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.hero.image2 || ''}
                        onChange={(e) => handleHeroImageChange('image2', e.target.value, false)}
                        onBlur={() => handleSaveSection('hero')}
                        placeholder="e.g. /images/products/bopp_label.png"
                        style={{ fontSize: '12px' }}
                      />
                    </div>

                    <FileUpload
                      currentUrl={aboutData.hero.image2}
                      label="Upload / Replace Image #2"
                      accept="image/*"
                      showPreviewBar={false}
                      onUploadComplete={(url) => handleHeroImageChange('image2', url, true)}
                    />
                  </div>

                  {/* Card #3: Shrink Sleeves */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '6px' }}>
                        Card #3: Shrink Sleeves
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bottom-Right Frame</span>
                    </div>

                    {/* Preview Area */}
                    <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {aboutData.hero.image3 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getMediaUrl(aboutData.hero.image3)}
                          alt="Card 3 Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '12px' }}>
                          <ImageIcon size={28} style={{ opacity: 0.4, marginBottom: '4px' }} />
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>No Image Configured</div>
                        </div>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Image URL / Path</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.hero.image3 || ''}
                        onChange={(e) => handleHeroImageChange('image3', e.target.value, false)}
                        onBlur={() => handleSaveSection('hero')}
                        placeholder="e.g. /images/products/pvc_shrink_sleeves.png"
                        style={{ fontSize: '12px' }}
                      />
                    </div>

                    <FileUpload
                      currentUrl={aboutData.hero.image3}
                      label="Upload / Replace Image #3"
                      accept="image/*"
                      showPreviewBar={false}
                      onUploadComplete={(url) => handleHeroImageChange('image3', url, true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MEET OUR FOUNDERS TAB */}
          {activeSubTab === 'founders' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Users size={20} color="var(--primary)" /> Meet Our Founders Leadership Section
                  </h2>
                  <p className="card-subtitle">
                    Manage the section titles, leadership showcase image &amp; badge, and individual founder profiles.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('founders')}
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Founders Section'}
                </button>
              </div>

              {/* Section Titles */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Section Tag / Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.founders?.subtitle || ''}
                    onChange={(e) => handleFieldChange('founders', 'subtitle', e.target.value)}
                    placeholder="LEADERSHIP & VISION"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Title Line (Prefix)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.founders?.title || ''}
                    onChange={(e) => handleFieldChange('founders', 'title', e.target.value)}
                    placeholder="Meet Our"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Title Cyan Highlight</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.founders?.titleHighlight || ''}
                    onChange={(e) => handleFieldChange('founders', 'titleHighlight', e.target.value)}
                    placeholder="Founders"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Section Description Paragraph</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={aboutData.founders?.description || ''}
                  onChange={(e) => handleFieldChange('founders', 'description', e.target.value)}
                  placeholder="Driven by technical innovation and an unwavering commitment to packaging excellence."
                />
              </div>

              {/* Left Showcase Image & Badge Frame */}
              <div style={{ marginTop: '24px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} color="var(--primary)" /> Founders Showcase Visual Frame (Left Side)
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 320px) 1fr', gap: '20px', alignItems: 'start' }}>
                  {/* Image Preview */}
                  <div>
                    <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: '#ffffff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {aboutData.founders?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getMediaUrl(aboutData.founders.image)}
                          alt="Founders Showcase Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          <ImageIcon size={32} style={{ opacity: 0.4 }} />
                          <div style={{ fontSize: '12px', marginTop: '4px' }}>No Image Set</div>
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(11, 19, 41, 0.85)', backdropFilter: 'blur(4px)', color: '#00e5ff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'center' }}>
                        {aboutData.founders?.badgeText || 'FOUNDERS & DIRECTORS'}
                      </div>
                    </div>
                  </div>

                  {/* Settings & Upload */}
                  <div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Overlay Badge Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.founders?.badgeText || ''}
                        onChange={(e) => handleFieldChange('founders', 'badgeText', e.target.value)}
                        placeholder="FOUNDERS & DIRECTORS"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Image URL / Path</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.founders?.image || ''}
                        onChange={(e) => handleFounderImageChange(e.target.value, false)}
                        onBlur={() => handleSaveSection('founders')}
                        placeholder="/images/world_map_blueprint.png or uploaded image URL"
                      />
                    </div>

                    <FileUpload
                      currentUrl={aboutData.founders?.image}
                      label="Upload / Replace Showcase Image"
                      accept="image/*"
                      showPreviewBar={false}
                      onUploadComplete={(url) => handleFounderImageChange(url, true)}
                    />
                  </div>
                </div>
              </div>

              {/* Founders Leadership Profiles List */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      Founders Leadership Profiles ({(aboutData.founders?.foundersList || []).length})
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Add or edit founder names, order indices, and role descriptions shown on the right side.
                    </p>
                  </div>
                  <button type="button" onClick={openAddFounder} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add Founder Profile
                  </button>
                </div>

                <div className="items-list">
                  {(aboutData.founders?.foundersList || []).map((founder, idx) => (
                    <div key={founder.id || idx} className="item-card">
                      <div className="item-card-header">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                          <div
                            style={{
                              fontSize: '18px',
                              fontWeight: 800,
                              color: 'var(--primary)',
                              background: 'var(--primary-light)',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid var(--primary-border)',
                              minWidth: '46px',
                              textAlign: 'center'
                            }}
                          >
                            {founder.index || `0${idx + 1}`}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              {founder.name}
                            </h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                              {founder.description}
                            </p>
                          </div>
                        </div>

                        <div className="item-card-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={idx === 0}
                            onClick={() => moveFounder(idx, -1)}
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={idx === (aboutData.founders?.foundersList || []).length - 1}
                            onClick={() => moveFounder(idx, 1)}
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditFounder(idx)}
                            title="Edit Founder"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFounder(idx)}
                            title="Delete Founder"
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

          {/* 3. VISION & MISSION TAB */}
          {activeSubTab === 'visionMission' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Target size={20} color="var(--primary)" /> Vision, Mission &amp; Philosophy Pillars
                  </h2>
                  <p className="card-subtitle">
                    Manage the section header and the 3 interactive CMYK die-cut cards.
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('visionMission')}
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Vision & Mission'}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Section Title Line</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.visionMission.title || ''}
                    onChange={(e) => handleFieldChange('visionMission', 'title', e.target.value)}
                    placeholder="Driven By Purpose,"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Title Cyan Highlight</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.visionMission.titleHighlight || ''}
                    onChange={(e) => handleFieldChange('visionMission', 'titleHighlight', e.target.value)}
                    placeholder="Built For Quality"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={aboutData.visionMission.description || ''}
                  onChange={(e) => handleFieldChange('visionMission', 'description', e.target.value)}
                  placeholder="We are committed to redefining packaging standards..."
                />
              </div>

              {/* Pillar Cards */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    Core Purpose Cards ({(aboutData.visionMission.cards || []).length} Pillars)
                  </h4>
                  <button type="button" onClick={openAddVisionCard} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add Pillar Card
                  </button>
                </div>

                <div className="items-list">
                  {(aboutData.visionMission.cards || []).map((card, idx) => (
                    <div key={card.id || idx} className="item-card">
                      <div className="item-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: idx === 0 ? '#e0f4fc' : idx === 1 ? '#fce7f3' : idx === 2 ? '#fef9c3' : '#f0fdf4',
                              color: idx === 0 ? '#009fe3' : idx === 1 ? '#e3007b' : idx === 2 ? '#ca8a04' : '#16a34a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800
                            }}
                          >
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              {card.title}
                            </h4>
                            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                              {card.description}
                            </p>
                          </div>
                        </div>

                        <div className="item-card-actions">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={idx === 0}
                            onClick={() => moveVisionCard(idx, -1)}
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            disabled={idx === (aboutData.visionMission.cards || []).length - 1}
                            onClick={() => moveVisionCard(idx, 1)}
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditVisionCard(idx)}
                            title="Edit card"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeVisionCard(idx)}
                            title="Delete card"
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

          {/* 4. EVOLUTION TIMELINE TAB */}
          {activeSubTab === 'history' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <Clock size={20} color="var(--primary)" /> 17-Year Evolution Timeline
                  </h2>
                  <p className="card-subtitle">
                    Edit the inception milestone (2009), center evolution counter, and the current global leader milestone (2026).
                  </p>
                </div>
                <button
                  onClick={() => handleSaveSection('history')}
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Evolution Timeline'}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Top Badge Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.history.badgeLabel || ''}
                    onChange={(e) => handleFieldChange('history', 'badgeLabel', e.target.value)}
                    placeholder="2009 – 2026 EVOLUTION"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.history.title || ''}
                    onChange={(e) => handleFieldChange('history', 'title', e.target.value)}
                    placeholder="Our Journey of"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Title Cyan Highlight</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aboutData.history.titleHighlight || ''}
                    onChange={(e) => handleFieldChange('history', 'titleHighlight', e.target.value)}
                    placeholder="Evolution"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Center Connector Badge</label>
                <input
                  type="text"
                  className="form-input"
                  value={aboutData.history.centerBadge || '17 YEARS'}
                  onChange={(e) => handleFieldChange('history', 'centerBadge', e.target.value)}
                  placeholder="17 YEARS"
                />
              </div>

              {/* Inception Card (2009) & Current Card (2026) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {/* 2009 Inception */}
                <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-muted)' }}>
                      {aboutData.history.inception?.year || '2009'}
                    </span>
                    <span className="tag-badge">{aboutData.history.inception?.tag || 'INCEPTION'}</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Inception Year</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.history.inception?.year || ''}
                        onChange={(e) => {
                          setAboutData((prev) => ({
                            ...prev,
                            history: {
                              ...prev.history,
                              inception: { ...prev.history.inception, year: e.target.value }
                            }
                          }));
                        }}
                        placeholder="2009"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Milestone Tag Badge</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.history.inception?.tag || ''}
                        onChange={(e) => {
                          setAboutData((prev) => ({
                            ...prev,
                            history: {
                              ...prev.history,
                              inception: { ...prev.history.inception, tag: e.target.value }
                            }
                          }));
                        }}
                        placeholder="INCEPTION"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Milestone Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={aboutData.history.inception?.title || ''}
                      onChange={(e) => {
                        setAboutData((prev) => ({
                          ...prev,
                          history: {
                            ...prev.history,
                            inception: { ...prev.history.inception, title: e.target.value }
                          }
                        }));
                      }}
                      placeholder="Founding Printing Setup"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Milestone Subtitle</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={aboutData.history.inception?.description || ''}
                      onChange={(e) => {
                        setAboutData((prev) => ({
                          ...prev,
                          history: {
                            ...prev.history,
                            inception: { ...prev.history.inception, description: e.target.value }
                          }
                        }));
                      }}
                      placeholder="Established core B2B label & packaging operations."
                    />
                  </div>
                </div>

                {/* 2026 Global Reach */}
                <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#16a34a' }}>
                      {aboutData.history.current?.year || '2026'}
                    </span>
                    <span className="item-badge-pill" style={{ borderColor: '#86efac', background: '#dcfce7', color: '#15803d' }}>
                      {aboutData.history.current?.tag || 'GLOBAL LEADER'}
                    </span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Milestone Year</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.history.current?.year || ''}
                        onChange={(e) => {
                          setAboutData((prev) => ({
                            ...prev,
                            history: {
                              ...prev.history,
                              current: { ...prev.history.current, year: e.target.value }
                            }
                          }));
                        }}
                        placeholder="2026"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Milestone Tag Badge</label>
                      <input
                        type="text"
                        className="form-input"
                        value={aboutData.history.current?.tag || ''}
                        onChange={(e) => {
                          setAboutData((prev) => ({
                            ...prev,
                            history: {
                              ...prev.history,
                              current: { ...prev.history.current, tag: e.target.value }
                            }
                          }));
                        }}
                        placeholder="GLOBAL LEADER"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Milestone Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={aboutData.history.current?.title || ''}
                      onChange={(e) => {
                        setAboutData((prev) => ({
                          ...prev,
                          history: {
                            ...prev.history,
                            current: { ...prev.history.current, title: e.target.value }
                          }
                        }));
                      }}
                      placeholder="Global Packaging Reach"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Milestone Subtitle</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={aboutData.history.current?.description || ''}
                      onChange={(e) => {
                        setAboutData((prev) => ({
                          ...prev,
                          history: {
                            ...prev.history,
                            current: { ...prev.history.current, description: e.target.value }
                          }
                        }));
                      }}
                      placeholder="Supplying 50+ industries with automated precision."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shared Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === 'visionCard'
            ? (editingIndex !== null ? `Edit Pillar: ${modalForm.title || ''}` : 'Add New Pillar Card')
            : modalType === 'founder'
            ? (editingIndex !== null ? `Edit Founder: ${modalForm.name || ''}` : 'Add New Founder Profile')
            : 'Configure Item'
        }
        subtitle="Configure the values, label copy, and details."
        icon={modalType === 'visionCard' ? Target : Users}
        maxWidth="600px"
      >
        <form onSubmit={handleSaveModal}>
          {modalType === 'visionCard' ? (
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
                <label className="form-label">Pillar Description</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={modalForm.description || ''}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Display Index (e.g. 01, 02)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.index || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, index: e.target.value }))}
                    placeholder="01"
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Founder Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.name || ''}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Parth Patel"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role &amp; Contribution Description</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={modalForm.description || ''}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Leading strategic vision and technology adoption in high-precision shrink sleeves..."
                  required
                />
              </div>
            </div>
          )}

          <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
