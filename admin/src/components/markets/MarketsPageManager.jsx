'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe,
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
  Layers,
  Award,
  Zap,
  Building,
  Target,
  Box,
  TrendingUp,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { api, FRONTEND_URL } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../lib/media';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

export default function MarketsPageManager() {
  const [activeSubTab, setActiveSubTab] = useState('hero');
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const toast = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getMarketsPageData();
      if (res.success && res.data) {
        setPageData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load markets page data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Direct section saves
  const handleSaveSection = async (sectionKey) => {
    setIsSaving(true);
    try {
      if (sectionKey === 'hero') {
        await api.updateMarketsPageHero(pageData.hero);
        toast.success('Hero section saved successfully!');
      } else if (sectionKey === 'categories') {
        await api.updateMarketsPageCategories({
          catalogHeader: pageData.catalogHeader,
          categories: pageData.categories
        });
        toast.success('Categories catalog saved successfully!');
      } else if (sectionKey === 'industries') {
        await api.updateMarketsPageIndustries({
          industryHeader: pageData.industryHeader,
          industries: pageData.industries
        });
        toast.success('Industry sectors saved successfully!');
      } else if (sectionKey === 'productUses') {
        await api.updateMarketsPageProductUses({
          productUsesHeader: pageData.productUsesHeader,
          productUses: pageData.productUses
        });
        toast.success('Product uses showcase saved successfully!');
      } else if (sectionKey === 'featuredSolutions') {
        await api.updateMarketsPageFeaturedSolutions({
          featuredHeader: pageData.featuredHeader,
          featuredSolutions: pageData.featuredSolutions
        });
        toast.success('Featured solutions slider saved successfully!');
      } else if (sectionKey === 'whyChooseUs') {
        await api.updateMarketsPageWhyChooseUs({
          whyChooseHeader: pageData.whyChooseHeader,
          whyChooseUs: pageData.whyChooseUs
        });
        toast.success('Commitments and advantages saved successfully!');
      } else if (sectionKey === 'processMetrics') {
        await api.updateMarketsPageProcessMetrics({
          processHeader: pageData.processHeader,
          workflowSteps: pageData.workflowSteps,
          metrics: pageData.metrics
        });
        toast.success('Workflow process and metrics saved successfully!');
      } else if (sectionKey === 'seoCta') {
        await api.updateMarketsPageSeoCta({
          seoHeader: pageData.seoHeader,
          seoBlocks: pageData.seoBlocks,
          popularSearches: pageData.popularSearches,
          cta: pageData.cta
        });
        toast.success('SEO content & CTA banner saved successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  };

  // State modification helpers
  const handleNestedField = (section, field, value) => {
    setPageData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleHeroMockupChange = async (cardIndex, field, value, autoSave = false) => {
    const currentMockups = [...(pageData.hero?.mockups || [
      { tag: "BEVERAGE & FMCG SOLUTIONS", tagColor: "#009fe3", tagBg: "#e0f2fe", code: "REG-BOPP-03", title: "High-Speed Roll-Fed & Shrink Packaging", text: "Waterproof, scuff-proof & high-tension rotary roll-fed application", photo: "/images/products/bopp_label.png" },
      { tag: "360° SHRINK SLEEVES", tagColor: "#059669", tagBg: "#ecfdf5", code: "REG-PVC-01", title: "PVC & PETG Sleeves", text: "58% to 78% high-contour heat shrink fit for bottles and jars", photo: "/images/products/pvc_shrink_sleeves.png" },
      { tag: "HEAT TRANSFER (HTL)", tagColor: "#e3007b", tagBg: "#fdf2f8", code: "REG-HTL-04", title: "Heat Transfer Labels", text: "Permanent molecular bond & scratch-proof finish", photo: "/images/products/htl_paint_pails.png" }
    ])];

    if (!currentMockups[cardIndex]) {
      currentMockups[cardIndex] = {};
    }
    currentMockups[cardIndex] = {
      ...currentMockups[cardIndex],
      [field]: value
    };

    const updatedHero = {
      ...pageData.hero,
      mockups: currentMockups,
      ...(field === 'photo' ? { [`image${cardIndex + 1}`]: value } : {})
    };

    setPageData((prev) => ({
      ...prev,
      hero: updatedHero
    }));

    if (autoSave) {
      try {
        await api.updateMarketsPageHero(updatedHero);
        toast.success(`Showcase Card #${cardIndex + 1} image updated!`);
      } catch (err) {
        toast.error('Failed to auto-save showcase image: ' + err.message);
      }
    }
  };

  // Modal open helpers
  const openModal = (type, index = null, defaultData = {}) => {
    setModalType(type);
    setEditingIndex(index);
    if (index !== null) {
      if (type === 'category') setModalForm({ ...pageData.categories[index] });
      else if (type === 'industry') setModalForm({ ...pageData.industries[index] });
      else if (type === 'productUse') setModalForm({ ...pageData.productUses[index] });
      else if (type === 'featured') setModalForm({ ...pageData.featuredSolutions[index] });
      else if (type === 'why') setModalForm({ ...pageData.whyChooseUs[index] });
      else if (type === 'step') setModalForm({ ...pageData.workflowSteps[index] });
      else if (type === 'metric') setModalForm({ ...pageData.metrics[index] });
      else if (type === 'seoBlock') setModalForm({ ...pageData.seoBlocks[index] });
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

  // Generic Reorder
  const moveItem = async (arrayKey, index, direction, saveSectionKey) => {
    const list = [...(pageData[arrayKey] || [])];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    setPageData((prev) => ({ ...prev, [arrayKey]: list }));
    try {
      if (saveSectionKey === 'categories') {
        await api.updateMarketsPageCategories({ catalogHeader: pageData.catalogHeader, categories: list });
      } else if (saveSectionKey === 'industries') {
        await api.updateMarketsPageIndustries({ industryHeader: pageData.industryHeader, industries: list });
      } else if (saveSectionKey === 'productUses') {
        await api.updateMarketsPageProductUses({ productUsesHeader: pageData.productUsesHeader, productUses: list });
      } else if (saveSectionKey === 'featuredSolutions') {
        await api.updateMarketsPageFeaturedSolutions({ featuredHeader: pageData.featuredHeader, featuredSolutions: list });
      } else if (saveSectionKey === 'whyChooseUs') {
        await api.updateMarketsPageWhyChooseUs({ whyChooseHeader: pageData.whyChooseHeader, whyChooseUs: list });
      } else if (saveSectionKey === 'processMetrics') {
        await api.updateMarketsPageProcessMetrics({ processHeader: pageData.processHeader, workflowSteps: list, metrics: pageData.metrics });
      }
      toast.success('Order updated!');
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  // Generic Delete
  const deleteItem = async (arrayKey, index, saveSectionKey, minCount = 1) => {
    if ((pageData[arrayKey] || []).length <= minCount) {
      toast.error(`Must keep at least ${minCount} item(s).`);
      return;
    }
    const updated = pageData[arrayKey].filter((_, i) => i !== index);
    setPageData((prev) => ({ ...prev, [arrayKey]: updated }));
    try {
      if (saveSectionKey === 'categories') {
        await api.updateMarketsPageCategories({ catalogHeader: pageData.catalogHeader, categories: updated });
      } else if (saveSectionKey === 'industries') {
        await api.updateMarketsPageIndustries({ industryHeader: pageData.industryHeader, industries: updated });
      } else if (saveSectionKey === 'productUses') {
        await api.updateMarketsPageProductUses({ productUsesHeader: pageData.productUsesHeader, productUses: updated });
      } else if (saveSectionKey === 'featuredSolutions') {
        await api.updateMarketsPageFeaturedSolutions({ featuredHeader: pageData.featuredHeader, featuredSolutions: updated });
      } else if (saveSectionKey === 'whyChooseUs') {
        await api.updateMarketsPageWhyChooseUs({ whyChooseHeader: pageData.whyChooseHeader, whyChooseUs: updated });
      } else if (saveSectionKey === 'processMetrics') {
        await api.updateMarketsPageProcessMetrics({ processHeader: pageData.processHeader, workflowSteps: updated, metrics: pageData.metrics });
      } else if (saveSectionKey === 'seoCta') {
        await api.updateMarketsPageSeoCta({ seoHeader: pageData.seoHeader, seoBlocks: updated, popularSearches: pageData.popularSearches, cta: pageData.cta });
      }
      toast.success('Item deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  // Save Modal
  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      let arrayKey = '';
      let saveFn = null;
      let payloadGen = null;

      if (modalType === 'category') {
        arrayKey = 'categories';
        payloadGen = (list) => ({ catalogHeader: pageData.catalogHeader, categories: list });
        saveFn = api.updateMarketsPageCategories;
      } else if (modalType === 'industry') {
        arrayKey = 'industries';
        payloadGen = (list) => ({ industryHeader: pageData.industryHeader, industries: list });
        saveFn = api.updateMarketsPageIndustries;
      } else if (modalType === 'productUse') {
        arrayKey = 'productUses';
        payloadGen = (list) => ({ productUsesHeader: pageData.productUsesHeader, productUses: list });
        saveFn = api.updateMarketsPageProductUses;
      } else if (modalType === 'featured') {
        arrayKey = 'featuredSolutions';
        payloadGen = (list) => ({ featuredHeader: pageData.featuredHeader, featuredSolutions: list });
        saveFn = api.updateMarketsPageFeaturedSolutions;
      } else if (modalType === 'why') {
        arrayKey = 'whyChooseUs';
        payloadGen = (list) => ({ whyChooseHeader: pageData.whyChooseHeader, whyChooseUs: list });
        saveFn = api.updateMarketsPageWhyChooseUs;
      } else if (modalType === 'step') {
        arrayKey = 'workflowSteps';
        payloadGen = (list) => ({ processHeader: pageData.processHeader, workflowSteps: list, metrics: pageData.metrics });
        saveFn = api.updateMarketsPageProcessMetrics;
      } else if (modalType === 'metric') {
        arrayKey = 'metrics';
        payloadGen = (list) => ({ processHeader: pageData.processHeader, workflowSteps: pageData.workflowSteps, metrics: list });
        saveFn = api.updateMarketsPageProcessMetrics;
      } else if (modalType === 'seoBlock') {
        arrayKey = 'seoBlocks';
        payloadGen = (list) => ({ seoHeader: pageData.seoHeader, seoBlocks: list, popularSearches: pageData.popularSearches, cta: pageData.cta });
        saveFn = api.updateMarketsPageSeoCta;
      }

      let updatedList;
      if (editingIndex !== null) {
        updatedList = [...pageData[arrayKey]];
        updatedList[editingIndex] = modalForm;
      } else {
        updatedList = [...(pageData[arrayKey] || []), modalForm];
      }

      setPageData((prev) => ({ ...prev, [arrayKey]: updatedList }));
      if (saveFn && payloadGen) {
        await saveFn(payloadGen(updatedList));
      }
      toast.success(editingIndex !== null ? 'Item updated!' : 'New item added!');
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Popular searches handlers
  const [newTagInput, setNewTagInput] = useState('');
  const addPopularTag = async () => {
    if (!newTagInput.trim()) return;
    const updated = [...(pageData.popularSearches || []), newTagInput.trim()];
    setPageData((prev) => ({ ...prev, popularSearches: updated }));
    setNewTagInput('');
    try {
      await api.updateMarketsPageSeoCta({
        seoHeader: pageData.seoHeader,
        seoBlocks: pageData.seoBlocks,
        popularSearches: updated,
        cta: pageData.cta
      });
      toast.success('Search tag added!');
    } catch (err) {
      toast.error('Failed to add tag');
    }
  };

  const removePopularTag = async (tagIdx) => {
    const updated = pageData.popularSearches.filter((_, i) => i !== tagIdx);
    setPageData((prev) => ({ ...prev, popularSearches: updated }));
    try {
      await api.updateMarketsPageSeoCta({
        seoHeader: pageData.seoHeader,
        seoBlocks: pageData.seoBlocks,
        popularSearches: updated,
        cta: pageData.cta
      });
      toast.success('Search tag removed!');
    } catch (err) {
      toast.error('Failed to remove tag');
    }
  };

  const subTabs = [
    { id: 'hero', label: '1. Hero & Top Mockups', icon: Sliders },
    { id: 'categories', label: `2. Categories Catalog (${pageData?.categories?.length || 0})`, icon: Layers },
    { id: 'industries', label: `3. Industry Segments (${pageData?.industries?.length || 0})`, icon: Building },
    { id: 'productUses', label: `4. Product Uses & Applications (${pageData?.productUses?.length || 0})`, icon: Box },
    { id: 'featuredSolutions', label: `5. Featured Slider (${pageData?.featuredSolutions?.length || 0})`, icon: Zap },
    { id: 'whyChooseUs', label: `6. Commitments & Why Choose Us (${pageData?.whyChooseUs?.length || 0})`, icon: Award },
    { id: 'processMetrics', label: `7. Workflow & Metrics (${pageData?.workflowSteps?.length || 0})`, icon: TrendingUp },
    { id: 'seoCta', label: '8. SEO Content & CTA Banner', icon: FileText }
  ];

  if (isLoading || !pageData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        Loading all Markets We Serve sections...
      </div>
    );
  }

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
              style={{ fontSize: '13px', padding: '10px 16px' }}
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
            href={`${FRONTEND_URL}/markets-we-serve`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} /> Open Live Page
          </a>
        </div>
      </div>

      <div>
        {/* ========================================================================= */}
        {/* 1. HERO TAB */}
        {/* ========================================================================= */}
        {activeSubTab === 'hero' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Sliders size={20} color="var(--primary)" /> 1. Hero Header &amp; 3D Floating Mockups
                </h2>
                <p className="card-subtitle">
                  Edit the top badge, main title, cyan highlight, description copy, and the 3 floating 3D label mockup cards.
                </p>
              </div>
              <button onClick={() => handleSaveSection('hero')} className="btn btn-primary" disabled={isSaving}>
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Hero Section'}
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Top Badge Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageData.hero?.badge || ''}
                  onChange={(e) => handleNestedField('hero', 'badge', e.target.value)}
                  placeholder="MARKETS & APPLICATIONS"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Main Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageData.hero?.title || ''}
                  onChange={(e) => handleNestedField('hero', 'title', e.target.value)}
                  placeholder="Markets We Serve &"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title Cyan Highlight</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageData.hero?.titleHighlight || ''}
                  onChange={(e) => handleNestedField('hero', 'titleHighlight', e.target.value)}
                  placeholder="Printing Solutions"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Page Subtitle Description</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={pageData.hero?.description || ''}
                onChange={(e) => handleNestedField('hero', 'description', e.target.value)}
                placeholder="Discover premium, high-performance label printing solutions custom engineered for our markets..."
              />
            </div>

            {/* 3 Bento Showcase Cards Editor */}
            <div style={{ marginTop: '28px', background: '#f8fafc', padding: '22px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} color="var(--primary)" /> Hero Bento Showcase Cards (3 Right-Side Display Frames)
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Controls the 3 structured product showcase cards displayed on the Markets We Serve hero section. Uploading auto-saves immediately to the database.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveSection('hero')}
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                >
                  <Save size={14} /> {isSaving ? 'Saving...' : 'Save Showcase Cards'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Card #1: Top Featured (BOPP / Beverage FMCG) */}
                {(() => {
                  const card = pageData.hero?.mockups?.[0] || {
                    tag: "BEVERAGE & FMCG SOLUTIONS",
                    code: "REG-BOPP-03",
                    title: "High-Speed Roll-Fed & Shrink Packaging",
                    text: "Waterproof, scuff-proof & high-tension rotary roll-fed application",
                    photo: "/images/products/bopp_label.png"
                  };
                  return (
                    <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#009fe3', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
                          Card #1: Top Featured (Wide)
                        </span>
                      </div>

                      <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {card.photo ? (
                          <img
                            src={getMediaUrl(card.photo)}
                            alt="Card 1 Preview"
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
                          value={card.photo || ''}
                          onChange={(e) => handleHeroMockupChange(0, 'photo', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          placeholder="/images/products/bopp_label.png"
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <FileUpload
                        currentUrl={card.photo}
                        label="Upload / Replace Image #1"
                        accept="image/*"
                        showPreviewBar={false}
                        onUploadComplete={(url) => handleHeroMockupChange(0, 'photo', url, true)}
                      />

                      <div className="form-group" style={{ marginTop: '10px', marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Card Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.title || ''}
                          onChange={(e) => handleHeroMockupChange(0, 'title', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Subtitle / Specs</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.text || ''}
                          onChange={(e) => handleHeroMockupChange(0, 'text', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Badge Label</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.tag || ''}
                          onChange={(e) => handleHeroMockupChange(0, 'tag', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Card #2: Bottom-Left (360° Shrink Sleeves) */}
                {(() => {
                  const card = pageData.hero?.mockups?.[1] || {
                    tag: "360° SHRINK SLEEVES",
                    code: "REG-PVC-01",
                    title: "PVC & PETG Sleeves",
                    text: "58% to 78% high-contour heat shrink fit for bottles and jars",
                    photo: "/images/products/pvc_shrink_sleeves.png"
                  };
                  return (
                    <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                          Card #2: Bottom-Left (Sleeves)
                        </span>
                      </div>

                      <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {card.photo ? (
                          <img
                            src={getMediaUrl(card.photo)}
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
                          value={card.photo || ''}
                          onChange={(e) => handleHeroMockupChange(1, 'photo', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          placeholder="/images/products/pvc_shrink_sleeves.png"
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <FileUpload
                        currentUrl={card.photo}
                        label="Upload / Replace Image #2"
                        accept="image/*"
                        showPreviewBar={false}
                        onUploadComplete={(url) => handleHeroMockupChange(1, 'photo', url, true)}
                      />

                      <div className="form-group" style={{ marginTop: '10px', marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Card Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.title || ''}
                          onChange={(e) => handleHeroMockupChange(1, 'title', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Subtitle / Specs</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.text || ''}
                          onChange={(e) => handleHeroMockupChange(1, 'text', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Badge Label</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.tag || ''}
                          onChange={(e) => handleHeroMockupChange(1, 'tag', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Card #3: Bottom-Right (HTL / Specialty) */}
                {(() => {
                  const card = pageData.hero?.mockups?.[2] || {
                    tag: "HEAT TRANSFER (HTL)",
                    code: "REG-HTL-04",
                    title: "Heat Transfer Labels",
                    text: "Permanent molecular bond & scratch-proof finish",
                    photo: "/images/products/htl_paint_pails.png"
                  };
                  return (
                    <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#e3007b', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px' }}>
                          Card #3: Bottom-Right (HTL)
                        </span>
                      </div>

                      <div style={{ position: 'relative', width: '100%', height: '140px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {card.photo ? (
                          <img
                            src={getMediaUrl(card.photo)}
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
                          value={card.photo || ''}
                          onChange={(e) => handleHeroMockupChange(2, 'photo', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          placeholder="/images/products/htl_paint_pails.png"
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <FileUpload
                        currentUrl={card.photo}
                        label="Upload / Replace Image #3"
                        accept="image/*"
                        showPreviewBar={false}
                        onUploadComplete={(url) => handleHeroMockupChange(2, 'photo', url, true)}
                      />

                      <div className="form-group" style={{ marginTop: '10px', marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Card Title</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.title || ''}
                          onChange={(e) => handleHeroMockupChange(2, 'title', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '8px' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Subtitle / Specs</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.text || ''}
                          onChange={(e) => handleHeroMockupChange(2, 'text', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '0' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Badge Label</label>
                        <input
                          type="text"
                          className="form-input"
                          value={card.tag || ''}
                          onChange={(e) => handleHeroMockupChange(2, 'tag', e.target.value, false)}
                          onBlur={() => handleSaveSection('hero')}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CATEGORIES CATALOG TAB */}
        {/* ========================================================================= */}
        {activeSubTab === 'categories' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Layers size={20} color="var(--primary)" /> 2. Browse Printing Categories &amp; Blueprint Specs
                </h2>
                <p className="card-subtitle">
                  Configure section header and manage technical blueprint cards with dimensional tags and specs tables.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() =>
                    openModal('category', null, {
                      id: `cat-${Date.now()}`,
                      num: String((pageData.categories?.length || 0) + 1).padStart(2, '0'),
                      regMark: `REG-SOL-0${(pageData.categories?.length || 0) + 1}`,
                      dim: 'Custom Diameter & Height',
                      title: 'New Printing Solution',
                      desc: 'High-precision commercial packaging calibrated for durability.',
                      badge: 'High Precision',
                      accentColor: '#009fe3',
                      photo: '/images/products/pvc_shrink_sleeves.png',
                      specs: [
                        { label: 'Substrate', value: 'High-Grade Film' },
                        { label: 'Shrinkage Rate', value: 'Up to 50%' },
                        { label: 'Print Process', value: 'Rotogravure / Flexo' },
                        { label: 'Thickness', value: '35 to 50 Microns' }
                      ]
                    })
                  }
                  className="btn btn-secondary"
                >
                  <Plus size={16} /> Add Category Solution
                </button>
                <button onClick={() => handleSaveSection('categories')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Categories Section'}
                </button>
              </div>
            </div>

            {/* Section Header Editor */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                Section Header Display
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subtitle / Badge Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.catalogHeader?.subtitle || ''}
                    onChange={(e) => handleNestedField('catalogHeader', 'subtitle', e.target.value)}
                    placeholder="MARKETS WE SERVE CATALOG"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.catalogHeader?.title || ''}
                    onChange={(e) => handleNestedField('catalogHeader', 'title', e.target.value)}
                    placeholder="Browse Printing Categories"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={pageData.catalogHeader?.description || ''}
                  onChange={(e) => handleNestedField('catalogHeader', 'description', e.target.value)}
                  placeholder="Explore our custom layout and structural label profiles..."
                />
              </div>
            </div>

            {/* List */}
            <div className="items-list">
              {(pageData.categories || []).map((cat, idx) => (
                <div key={cat.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '10px',
                          border: `2px solid ${cat.accentColor || '#009fe3'}44`,
                          background: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={getMediaUrl(cat.photo)}
                          alt={cat.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.src = '/images/products/pvc_shrink_sleeves.png'; }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="tag-badge">#{cat.num || idx + 1}</span>
                          <span className="tag-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                            {cat.regMark || 'REG-STD'}
                          </span>
                          <span className="item-badge-pill" style={{ borderColor: (cat.accentColor || '#009fe3') + '66', color: cat.accentColor || '#009fe3' }}>
                            {cat.badge || 'Packaging'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {cat.title}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('categories', idx, -1, 'categories')} title="Move Up"><ArrowUp size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.categories.length - 1} onClick={() => moveItem('categories', idx, 1, 'categories')} title="Move Down"><ArrowDown size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('category', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('categories', idx, 'categories')} title="Delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. INDUSTRY VERTICALS TAB */}
        {/* ========================================================================= */}
        {activeSubTab === 'industries' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Building size={20} color="var(--primary)" /> 3. Industry Vertical Solutions
                </h2>
                <p className="card-subtitle">
                  Manage industry application sectors (Food &amp; Beverage, Cosmetics, Healthcare, Retail, etc.).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => openModal('industry', null, { id: `ind-${Date.now()}`, name: 'New Industry Sector', desc: 'Custom packaging solutions for specialized operations.' })}
                  className="btn btn-secondary"
                >
                  <Plus size={16} /> Add Industry Sector
                </button>
                <button onClick={() => handleSaveSection('industries')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Industries Section'}
                </button>
              </div>
            </div>

            {/* Section Header Editor */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                Section Header Display
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.industryHeader?.subtitle || ''}
                    onChange={(e) => handleNestedField('industryHeader', 'subtitle', e.target.value)}
                    placeholder="Industry Vertical Solutions"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.industryHeader?.title || ''}
                    onChange={(e) => handleNestedField('industryHeader', 'title', e.target.value)}
                    placeholder="Engineered for Every Segment"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={pageData.industryHeader?.description || ''}
                  onChange={(e) => handleNestedField('industryHeader', 'description', e.target.value)}
                  placeholder="From regulatory compliance markings to premium retail aesthetics..."
                />
              </div>
            </div>

            <div className="items-list">
              {(pageData.industries || []).map((ind, idx) => (
                <div key={ind.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#e0f4fc', color: '#009fe3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {ind.name}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {ind.desc}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('industries', idx, -1, 'industries')} title="Move Up"><ArrowUp size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.industries.length - 1} onClick={() => moveItem('industries', idx, 1, 'industries')} title="Move Down"><ArrowDown size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('industry', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('industries', idx, 'industries')} title="Delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PRODUCT USES & APPLICATIONS SHOWCASE */}
        {/* ========================================================================= */}
        {activeSubTab === 'productUses' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Box size={20} color="var(--primary)" /> 4. Product Uses &amp; Container Application Showcase
                </h2>
                <p className="card-subtitle">
                  Configure real-world packaging application cards (Bottles, Jars, Vials, Chemicals, Aerosols) with hotspots and specs.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() =>
                    openModal('productUse', null, {
                      id: `use-${Date.now()}`,
                      category: 'Bottles & Beverage',
                      title: 'New Container Application',
                      subtitle: 'Commercial Liquid & Solid Packaging',
                      badge: 'Full Body Branding',
                      accentColor: '#009fe3',
                      photo: '/images/products/pvc_shrink_sleeves.png',
                      containerType: 'PET & HDPE Containers',
                      uses: ['Beverage Bottling', 'Retail Display', 'Cold-Chain Moisture Proof'],
                      hotspots: [
                        { badge: 'Neck Band', detail: 'Tamper-evident shrink ring.' },
                        { badge: 'Body Contour', detail: 'Full 360-degree graphics.' }
                      ],
                      specs: [
                        { label: 'Substrate', value: 'PVC / PETG' },
                        { label: 'Thickness', value: '35 - 50 Microns' }
                      ]
                    })
                  }
                  className="btn btn-secondary"
                >
                  <Plus size={16} /> Add Container Application
                </button>
                <button onClick={() => handleSaveSection('productUses')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Product Uses Section'}
                </button>
              </div>
            </div>

            {/* Header */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Section Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageData.productUsesHeader?.title || ''}
                  onChange={(e) => handleNestedField('productUsesHeader', 'title', e.target.value)}
                  placeholder="Product Uses & Packaging Applications"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={pageData.productUsesHeader?.description || ''}
                  onChange={(e) => handleNestedField('productUsesHeader', 'description', e.target.value)}
                  placeholder="Discover how Parth Printtech's custom shrink sleeves..."
                />
              </div>
            </div>

            {/* List */}
            <div className="items-list">
              {(pageData.productUses || []).map((use, idx) => (
                <div key={use.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '10px',
                          border: `2px solid ${use.accentColor || '#009fe3'}44`,
                          background: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={getMediaUrl(use.photo)}
                          alt={use.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.src = '/images/products/pvc_shrink_sleeves.png'; }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="tag-badge" style={{ background: '#e0f2fe', color: '#0066cc' }}>{use.category}</span>
                          <span className="item-badge-pill" style={{ borderColor: (use.accentColor || '#009fe3') + '66', color: use.accentColor || '#009fe3' }}>
                            {use.badge || 'Application'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {use.title}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          📦 <strong>{use.containerType}</strong> — {use.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('productUses', idx, -1, 'productUses')} title="Move Up"><ArrowUp size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.productUses.length - 1} onClick={() => moveItem('productUses', idx, 1, 'productUses')} title="Move Down"><ArrowDown size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('productUse', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('productUses', idx, 'productUses')} title="Delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. FEATURED SOLUTIONS SLIDER */}
        {/* ========================================================================= */}
        {activeSubTab === 'featuredSolutions' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Zap size={20} color="var(--primary)" /> 5. Featured Printing Solutions Slider
                </h2>
                <p className="card-subtitle">
                  Configure the horizontal interactive slider showcasing bespoke formats with metric badges.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() =>
                    openModal('featured', null, {
                      id: `feat-${Date.now()}`,
                      title: 'New Featured Solution',
                      desc: 'Engineered high-performance labeling format.',
                      metric: 'High-speed rotary rating',
                      accent: '#009fe3',
                      photo: '/images/products/pvc_shrink_sleeves.png'
                    })
                  }
                  className="btn btn-secondary"
                >
                  <Plus size={16} /> Add Slider Card
                </button>
                <button onClick={() => handleSaveSection('featuredSolutions')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Featured Slider'}
                </button>
              </div>
            </div>

            {/* Header */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.featuredHeader?.subtitle || ''}
                    onChange={(e) => handleNestedField('featuredHeader', 'subtitle', e.target.value)}
                    placeholder="Bespoke Formats"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.featuredHeader?.title || ''}
                    onChange={(e) => handleNestedField('featuredHeader', 'title', e.target.value)}
                    placeholder="Featured Printing Solutions"
                  />
                </div>
              </div>
            </div>

            <div className="items-list">
              {(pageData.featuredSolutions || []).map((fp, idx) => (
                <div key={fp.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          border: `2px solid ${fp.accent || '#009fe3'}44`,
                          background: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={getMediaUrl(fp.photo)}
                          alt={fp.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => { e.currentTarget.src = '/images/products/pvc_shrink_sleeves.png'; }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="item-badge-pill" style={{ borderColor: (fp.accent || '#009fe3') + '66', color: fp.accent || '#009fe3' }}>
                            {fp.metric || 'Format'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {fp.title}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {fp.desc}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('featuredSolutions', idx, -1, 'featuredSolutions')} title="Move Up"><ArrowUp size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.featuredSolutions.length - 1} onClick={() => moveItem('featuredSolutions', idx, 1, 'featuredSolutions')} title="Move Down"><ArrowDown size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('featured', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('featuredSolutions', idx, 'featuredSolutions')} title="Delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. COMMITMENTS & WHY CHOOSE US */}
        {/* ========================================================================= */}
        {activeSubTab === 'whyChooseUs' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  <Award size={20} color="var(--primary)" /> 6. Commitments &amp; Why Choose Parth Printtech
                </h2>
                <p className="card-subtitle">
                  Configure the 6 core competitive advantages and quality commitments.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => openModal('why', null, { title: 'New Advantage', desc: 'Describe the engineering and delivery commitment.' })}
                  className="btn btn-secondary"
                >
                  <Plus size={16} /> Add Advantage
                </button>
                <button onClick={() => handleSaveSection('whyChooseUs')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Commitments Section'}
                </button>
              </div>
            </div>

            {/* Header */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.whyChooseHeader?.subtitle || ''}
                    onChange={(e) => handleNestedField('whyChooseHeader', 'subtitle', e.target.value)}
                    placeholder="Our Commitments"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Main Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.whyChooseHeader?.title || ''}
                    onChange={(e) => handleNestedField('whyChooseHeader', 'title', e.target.value)}
                    placeholder="Precision Printing Standards"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={pageData.whyChooseHeader?.description || ''}
                  onChange={(e) => handleNestedField('whyChooseHeader', 'description', e.target.value)}
                  placeholder="We combine structural packaging engineering with high-capacity digital output..."
                />
              </div>
            </div>

            <div className="items-list">
              {(pageData.whyChooseUs || []).map((item, idx) => (
                <div key={idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {item.title}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('whyChooseUs', idx, -1, 'whyChooseUs')} title="Move Up"><ArrowUp size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.whyChooseUs.length - 1} onClick={() => moveItem('whyChooseUs', idx, 1, 'whyChooseUs')} title="Move Down"><ArrowDown size={14} /></button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('why', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('whyChooseUs', idx, 'whyChooseUs')} title="Delete"><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. WORKFLOW PROCESS & SUCCESS METRICS */}
        {/* ========================================================================= */}
        {activeSubTab === 'processMetrics' && (
          <div>
            {/* Workflow Process */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <TrendingUp size={20} color="var(--primary)" /> 7A. 6-Step Printing Process Timeline
                  </h2>
                  <p className="card-subtitle">
                    Configure the design-to-delivery workflow steps shown on the page.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() =>
                      openModal('step', null, {
                        step: String((pageData.workflowSteps?.length || 0) + 1).padStart(2, '0'),
                        title: 'New Workflow Step',
                        desc: 'Describe this phase of the label printing cycle.'
                      })
                    }
                    className="btn btn-secondary"
                  >
                    <Plus size={16} /> Add Workflow Step
                  </button>
                  <button onClick={() => handleSaveSection('processMetrics')} className="btn btn-primary" disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Process & Metrics'}
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pageData.processHeader?.subtitle || ''}
                      onChange={(e) => handleNestedField('processHeader', 'subtitle', e.target.value)}
                      placeholder="Seamless Integration"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Main Heading</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pageData.processHeader?.title || ''}
                      onChange={(e) => handleNestedField('processHeader', 'title', e.target.value)}
                      placeholder="How We Print Your Labels"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={pageData.processHeader?.description || ''}
                    onChange={(e) => handleNestedField('processHeader', 'description', e.target.value)}
                    placeholder="A streamlined design-to-delivery workflow ensuring zero calibration mistakes..."
                  />
                </div>
              </div>

              <div className="items-list">
                {(pageData.workflowSteps || []).map((step, idx) => (
                  <div key={idx} className="item-card">
                    <div className="item-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#009fe3', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {step.step || idx + 1}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {step.title}
                          </h4>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <div className="item-card-actions">
                        <button type="button" className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => moveItem('workflowSteps', idx, -1, 'processMetrics')} title="Move Up"><ArrowUp size={14} /></button>
                        <button type="button" className="btn btn-secondary btn-sm" disabled={idx === pageData.workflowSteps.length - 1} onClick={() => moveItem('workflowSteps', idx, 1, 'processMetrics')} title="Move Down"><ArrowDown size={14} /></button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('step', idx)} title="Edit"><Edit3 size={14} /> Edit</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('workflowSteps', idx, 'processMetrics')} title="Delete"><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">7B. Customer Success Live Metrics</h3>
                  <p className="card-subtitle">4 animated count-up numbers displayed across commercial production volume.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {(pageData.metrics || []).map((m, mIdx) => (
                  <div key={m.id || mIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="tag-badge">#{mIdx + 1} Counter</span>
                      <button type="button" onClick={() => openModal('metric', mIdx)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                        <Edit3 size={12} /> Edit
                      </button>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#009fe3' }}>
                      {m.target?.toLocaleString()}{m.suffix}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. SEO CONTENT & CTA BANNER */}
        {/* ========================================================================= */}
        {activeSubTab === 'seoCta' && (
          <div>
            {/* SEO Articles */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    <FileText size={20} color="var(--primary)" /> 8A. SEO Keyword Educational Articles
                  </h2>
                  <p className="card-subtitle">
                    Configure rich indexing blocks (Why Quality Labels Matter, Label Types, Customization Options).
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => openModal('seoBlock', null, { heading: 'New SEO Paragraph', content: 'Detailed industry information and manufacturing description.' })}
                    className="btn btn-secondary"
                  >
                    <Plus size={16} /> Add SEO Article Block
                  </button>
                  <button onClick={() => handleSaveSection('seoCta')} className="btn btn-primary" disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save SEO & CTA'}
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">SEO Subtitle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pageData.seoHeader?.subtitle || ''}
                      onChange={(e) => handleNestedField('seoHeader', 'subtitle', e.target.value)}
                      placeholder="Professional Label Printing & Packaging"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SEO Main Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={pageData.seoHeader?.title || ''}
                      onChange={(e) => handleNestedField('seoHeader', 'title', e.target.value)}
                      placeholder="Custom Label Printing Solutions"
                    />
                  </div>
                </div>
              </div>

              <div className="items-list">
                {(pageData.seoBlocks || []).map((sb, idx) => (
                  <div key={idx} className="item-card">
                    <div className="item-card-header">
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {sb.heading}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                          {sb.content}
                        </p>
                      </div>
                      <div className="item-card-actions">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal('seoBlock', idx)}><Edit3 size={14} /> Edit</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteItem('seoBlocks', idx, 'seoCta')}><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <Search size={18} color="var(--primary)" /> 8B. Popular Search Keyword Tags
                  </h3>
                  <p className="card-subtitle">Interactive keyword tags displayed in the quick search widget.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="e.g. Tamper-Evident Seals"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPopularTag(); } }}
                />
                <button type="button" onClick={addPopularTag} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                  <Plus size={16} /> Add Tag
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(pageData.popularSearches || []).map((tag, tIdx) => (
                  <div
                    key={tIdx}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removePopularTag(tIdx)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <Target size={18} color="var(--primary)" /> 8C. Bottom Call-To-Action Banner
                  </h3>
                  <p className="card-subtitle">The closing conversion card at the bottom of the page.</p>
                </div>
                <button onClick={() => handleSaveSection('seoCta')} className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save CTA'}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">CTA Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={pageData.cta?.title || ''}
                  onChange={(e) => handleNestedField('cta', 'title', e.target.value)}
                  placeholder="Ready to Create Your Custom Labels?"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CTA Description</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={pageData.cta?.description || ''}
                  onChange={(e) => handleNestedField('cta', 'description', e.target.value)}
                  placeholder="Whether you need high-capacity roll labels..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Primary Button Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.cta?.buttonText || ''}
                    onChange={(e) => handleNestedField('cta', 'buttonText', e.target.value)}
                    placeholder="Browse Products"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Button Link</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pageData.cta?.buttonLink || ''}
                    onChange={(e) => handleNestedField('cta', 'buttonLink', e.target.value)}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Unified Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === 'category'
            ? editingIndex !== null ? `Edit Solution: ${modalForm.title || ''}` : 'Add Solution Card'
            : modalType === 'industry'
            ? editingIndex !== null ? `Edit Industry: ${modalForm.name || ''}` : 'Add Industry Sector'
            : modalType === 'productUse'
            ? editingIndex !== null ? `Edit Application: ${modalForm.title || ''}` : 'Add Container Application'
            : modalType === 'featured'
            ? editingIndex !== null ? `Edit Featured: ${modalForm.title || ''}` : 'Add Featured Card'
            : modalType === 'why'
            ? editingIndex !== null ? `Edit Advantage: ${modalForm.title || ''}` : 'Add Advantage'
            : modalType === 'step'
            ? editingIndex !== null ? `Edit Workflow Step: ${modalForm.title || ''}` : 'Add Workflow Step'
            : modalType === 'metric'
            ? `Edit Metric Counter: ${modalForm.label || ''}`
            : editingIndex !== null ? `Edit SEO Block: ${modalForm.heading || ''}` : 'Add SEO Block'
        }
        subtitle="Changes made here are saved directly to the database and sync instantly."
        icon={Layers}
        maxWidth={modalType === 'category' || modalType === 'productUse' ? '720px' : '580px'}
      >
        <form onSubmit={handleSaveModal}>
          {/* Category Modal */}
          {modalType === 'category' && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Solution Title</label>
                  <input type="text" className="form-input" value={modalForm.title || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Tag (e.g. 360° Graphics)</label>
                  <input type="text" className="form-input" value={modalForm.badge || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, badge: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Index Number (e.g. 01)</label>
                  <input type="text" className="form-input" value={modalForm.num || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, num: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Code (e.g. REG-PVC-01)</label>
                  <input type="text" className="form-input" value={modalForm.regMark || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, regMark: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Technical Description</label>
                <textarea rows={2} className="form-textarea" value={modalForm.desc || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <FileUpload currentUrl={modalForm.photo} label="Upload Image" accept="image/*" onUploadComplete={(url) => setModalForm((prev) => ({ ...prev, photo: url }))} />
              </div>
            </div>
          )}

          {/* Industry Modal */}
          {modalType === 'industry' && (
            <div>
              <div className="form-group">
                <label className="form-label">Industry Name</label>
                <input type="text" className="form-input" value={modalForm.name || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Application Description</label>
                <textarea rows={3} className="form-textarea" value={modalForm.desc || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))} required />
              </div>
            </div>
          )}

          {/* Product Uses Modal */}
          {modalType === 'productUse' && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Application Title</label>
                  <input type="text" className="form-input" value={modalForm.title || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Filter Category Tab</label>
                  <select className="form-input" value={modalForm.category || 'Bottles & Beverage'} onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}>
                    <option value="Bottles & Beverage">Bottles &amp; Beverage</option>
                    <option value="Jars, Tubs & Creams">Jars, Tubs &amp; Creams</option>
                    <option value="Vials & Healthcare">Vials &amp; Healthcare</option>
                    <option value="Chemicals & Industrial">Chemicals &amp; Industrial</option>
                    <option value="Cans & Aerosols">Cans &amp; Aerosols</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Container Type (e.g. PET Bottles)</label>
                  <input type="text" className="form-input" value={modalForm.containerType || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, containerType: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Badge Tag (e.g. Full Body Branding)</label>
                  <input type="text" className="form-input" value={modalForm.badge || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, badge: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle Description</label>
                <input type="text" className="form-input" value={modalForm.subtitle || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, subtitle: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Photo Image</label>
                <FileUpload currentUrl={modalForm.photo} label="Upload Application Photo" accept="image/*" onUploadComplete={(url) => setModalForm((prev) => ({ ...prev, photo: url }))} />
              </div>
            </div>
          )}

          {/* Featured Slider Modal */}
          {modalType === 'featured' && (
            <div>
              <div className="form-group">
                <label className="form-label">Solution Title</label>
                <input type="text" className="form-input" value={modalForm.title || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Metric Badge (e.g. 360-degree coverage)</label>
                  <input type="text" className="form-input" value={modalForm.metric || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, metric: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Accent Color (Hex)</label>
                  <input type="text" className="form-input" value={modalForm.accent || '#009fe3'} onChange={(e) => setModalForm((prev) => ({ ...prev, accent: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={2} className="form-textarea" value={modalForm.desc || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Photo</label>
                <FileUpload currentUrl={modalForm.photo} label="Upload Image" accept="image/*" onUploadComplete={(url) => setModalForm((prev) => ({ ...prev, photo: url }))} />
              </div>
            </div>
          )}

          {/* Why Modal */}
          {modalType === 'why' && (
            <div>
              <div className="form-group">
                <label className="form-label">Advantage Title</label>
                <input type="text" className="form-input" value={modalForm.title || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-textarea" value={modalForm.desc || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))} required />
              </div>
            </div>
          )}

          {/* Step Modal */}
          {modalType === 'step' && (
            <div>
              <div className="form-row">
                <div className="form-group" style={{ maxWidth: '100px' }}>
                  <label className="form-label">Step #</label>
                  <input type="text" className="form-input" value={modalForm.step || '01'} onChange={(e) => setModalForm((prev) => ({ ...prev, step: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Step Title</label>
                  <input type="text" className="form-input" value={modalForm.title || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={2} className="form-textarea" value={modalForm.desc || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, desc: e.target.value }))} required />
              </div>
            </div>
          )}

          {/* Metric Modal */}
          {modalType === 'metric' && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Number</label>
                  <input type="number" className="form-input" value={modalForm.target || 0} onChange={(e) => setModalForm((prev) => ({ ...prev, target: parseInt(e.target.value) || 0 }))} required />
                </div>
                <div className="form-group" style={{ maxWidth: '100px' }}>
                  <label className="form-label">Suffix</label>
                  <input type="text" className="form-input" value={modalForm.suffix || '+'} onChange={(e) => setModalForm((prev) => ({ ...prev, suffix: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Label Description</label>
                <input type="text" className="form-input" value={modalForm.label || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, label: e.target.value }))} required />
              </div>
            </div>
          )}

          {/* SEO Block Modal */}
          {modalType === 'seoBlock' && (
            <div>
              <div className="form-group">
                <label className="form-label">Heading</label>
                <input type="text" className="form-input" value={modalForm.heading || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, heading: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Article / Paragraph Content</label>
                <textarea rows={4} className="form-textarea" value={modalForm.content || ''} onChange={(e) => setModalForm((prev) => ({ ...prev, content: e.target.value }))} required />
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
      </Modal>
    </div>
  );
}
