'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Edit3,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const PRESET_BRANDS = [
  { name: 'Flexibond', brand: 'Flexibond', logoUrl: '/logo/flexibond.webp', color: '#009fe3' },
  { name: 'Gulab Oils', brand: 'Gulab Oils', logoUrl: '/logo/gulab_oils.webp', color: '#e91e63' },
  { name: 'Gokul Sweets', brand: 'Gokul Sweets', logoUrl: '/logo/gokul.png', color: '#4caf50' }
];

const emptyClient = {
  id: '',
  name: '',
  brand: '',
  color: '#009fe3',
  logoUrl: ''
};

export default function ClientsTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    title: initialData.title || 'Trusted by the',
    titleHighlight: initialData.titleHighlight || 'Industry Leaders',
    description:
      initialData.description ||
      'We design, manufacture, and print high-performance packaging and shrink sleeves for trusted market leaders like Gulab Oils, Flexibond, and Gokul Sweets.',
    items: initialData.items || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [clientForm, setClientForm] = useState(emptyClient);
  const toast = useToast();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || 'Trusted by the',
        titleHighlight: initialData.titleHighlight || 'Industry Leaders',
        description:
          initialData.description ||
          'We design, manufacture, and print high-performance packaging and shrink sleeves for trusted market leaders like Gulab Oils, Flexibond, and Gokul Sweets.',
        items: initialData.items || []
      });
    }
  }, [initialData]);

  const handleHeaderChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveHeader = async () => {
    setIsSaving(true);
    try {
      await api.updateClients(formData);
      toast.success('Clients section header updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Modals
  const openAddModal = () => {
    setEditingIndex(null);
    setClientForm({
      id: Date.now(),
      name: '',
      brand: '',
      color: '#009fe3',
      logoUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    const item = formData.items[idx];
    setEditingIndex(idx);
    setClientForm({
      ...item,
      name: item.name || item.brand || '',
      brand: item.brand || item.name || '',
      logoUrl: item.logoUrl || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setClientForm(emptyClient);
  };

  const handleFormFieldChange = (field, value) => {
    setClientForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name') {
        next.brand = value;
      } else if (field === 'brand' && !next.name) {
        next.name = value;
      }
      return next;
    });
  };

  const handleSelectPreset = (preset) => {
    setClientForm((prev) => ({
      ...prev,
      name: preset.name,
      brand: preset.brand,
      logoUrl: preset.logoUrl,
      color: preset.color || '#009fe3'
    }));
    toast.info(`Selected preset: ${preset.name}`);
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    const brandName = (clientForm.name || clientForm.brand || '').trim();
    if (!brandName) {
      toast.error('Please enter a client or brand name');
      return;
    }
    if (!clientForm.logoUrl || !clientForm.logoUrl.trim()) {
      toast.error('Please upload or provide a logo image for this brand');
      return;
    }

    const cleanedItem = {
      id: clientForm.id || Date.now(),
      name: brandName,
      brand: brandName,
      color: clientForm.color || '#009fe3',
      logoUrl: clientForm.logoUrl.trim()
    };

    let updatedItems;
    if (editingIndex !== null) {
      updatedItems = [...formData.items];
      updatedItems[editingIndex] = cleanedItem;
    } else {
      updatedItems = [...formData.items, cleanedItem];
    }

    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateClients(updatedData);
      toast.success(editingIndex !== null ? 'Brand logo updated and saved!' : 'New brand logo added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeClient = async (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);

    try {
      await api.updateClients(updatedData);
      toast.success('Brand logo removed and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Removed locally.');
    }
  };

  const handleResetToStandardLogos = async () => {
    if (!window.confirm('Reset the client list to standard brand partners (Flexibond, Gulab Oils, Gokul Sweets)?')) {
      return;
    }

    const standardItems = [
      { id: 1, name: 'Flexibond', brand: 'Flexibond', color: '#009fe3', logoUrl: '/logo/flexibond.webp' },
      { id: 2, name: 'Gulab Oils', brand: 'Gulab Oils', color: '#e91e63', logoUrl: '/logo/gulab_oils.webp' },
      { id: 3, name: 'Gokul Sweets', brand: 'Gokul Sweets', color: '#4caf50', logoUrl: '/logo/gokul.png' },
      { id: 4, name: 'Flexibond', brand: 'Flexibond', color: '#009fe3', logoUrl: '/logo/flexibond.webp' },
      { id: 5, name: 'Gulab Oils', brand: 'Gulab Oils', color: '#e91e63', logoUrl: '/logo/gulab_oils.webp' },
      { id: 6, name: 'Gokul Sweets', brand: 'Gokul Sweets', color: '#4caf50', logoUrl: '/logo/gokul.png' }
    ];

    const updatedData = { ...formData, items: standardItems };
    setFormData(updatedData);

    setIsSaving(true);
    try {
      await api.updateClients(updatedData);
      toast.success('Standard brand partner logos restored!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Updated locally.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to resolve logo image URL including preset fallback
  const getResolvedLogo = (client) => {
    if (client.logoUrl && client.logoUrl.trim()) {
      return client.logoUrl.trim();
    }
    const nameMatch = (client.name || client.brand || '').toLowerCase().trim();
    const preset = PRESET_BRANDS.find((p) => p.name.toLowerCase() === nameMatch);
    return preset ? preset.logoUrl : '';
  };

  return (
    <div>
      <div className="card">
        {/* Header section */}
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Users size={20} color="var(--primary)" /> Clients & Brand Partners ({formData.items.length} Logos)
            </h2>
            <p className="card-subtitle">
              Manage client brand logos for the animated 3-column vertical marquee on the homepage.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleResetToStandardLogos} className="btn btn-secondary btn-sm" title="Restore standard logos">
              <RefreshCw size={14} /> Reset Defaults
            </button>
            <button type="button" onClick={openAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Brand Logo
            </button>
            <button type="button" onClick={handleSaveHeader} className="btn btn-secondary" disabled={isSaving}>
              <Save size={16} /> Save Header
            </button>
          </div>
        </div>

        {/* Header text configuration */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleHeaderChange('title', e.target.value)}
              placeholder="e.g. Trusted by the"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title Outlined Highlight</label>
            <input
              type="text"
              className="form-input"
              value={formData.titleHighlight}
              onChange={(e) => handleHeaderChange('titleHighlight', e.target.value)}
              placeholder="e.g. Industry Leaders"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Section Subtitle / Description</label>
          <textarea
            rows={2}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleHeaderChange('description', e.target.value)}
            placeholder="Description explaining your brand packaging solutions for industry leaders..."
          />
        </div>

        {/* Live Frontend Design Note */}
        <div
          style={{
            marginTop: '16px',
            marginBottom: '20px',
            padding: '12px 16px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Sparkles size={20} color="#009fe3" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12.5px', color: '#0369a1', margin: 0, lineHeight: 1.5 }}>
            <strong>Frontend Display Note:</strong> On the live website, client cards showcase <strong>only the brand logo image</strong> without text inside a floating 3-column marquee. Make sure each brand has a clear logo image (PNG, SVG, or WebP) with a transparent or clean background.
          </p>
        </div>

        {/* Client Brands List */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Client Brands List ({formData.items.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Card preview shows the actual logo image displayed on frontend
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '14px' }}>
            {formData.items.length === 0 ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px 20px', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: '12px', border: '2px dashed var(--border)' }}>
                <ImageIcon size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', margin: '0 0 6px' }}>
                  No client brand logos added yet
                </p>
                <p style={{ fontSize: '12.5px', margin: '0 0 16px', color: 'var(--text-muted)' }}>
                  Click &quot;Add Brand Logo&quot; or &quot;Reset Defaults&quot; to populate your brand partner logos.
                </p>
                <button type="button" onClick={handleResetToStandardLogos} className="btn btn-secondary btn-sm" style={{ marginRight: '8px' }}>
                  <RefreshCw size={14} /> Load Standard Logos
                </button>
                <button type="button" onClick={openAddModal} className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Brand Logo
                </button>
              </div>
            ) : (
              formData.items.map((client, idx) => {
                const resolvedLogo = getResolvedLogo(client);
                const brandName = client.name || client.brand || 'Unnamed Brand';

                return (
                  <div
                    key={client.id || idx}
                    className="item-card"
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      background: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Left: Brand Logo Preview & Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      {/* Logo Thumbnail Frame (crisp white card) */}
                      <div
                        style={{
                          width: '84px',
                          height: '54px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}
                      >
                        {resolvedLogo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={resolvedLogo}
                            alt={brandName}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              width: 'auto',
                              height: 'auto',
                              objectFit: 'contain'
                            }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <AlertCircle size={16} color="#f59e0b" />
                            <span style={{ fontSize: '9px', fontWeight: 700, color: '#b45309' }}>NO LOGO</span>
                          </div>
                        )}
                      </div>

                      {/* Brand Title & Status Badge */}
                      <div style={{ minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={brandName}
                        >
                          {brandName}
                        </h4>
                        {resolvedLogo ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#16a34a',
                              background: '#f0fdf4',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #bbf7d0'
                            }}
                          >
                            <CheckCircle2 size={12} /> Image Ready
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#d97706',
                              background: '#fffbeb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #fde68a'
                            }}
                          >
                            <AlertCircle size={12} /> Needs Image
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="item-card-actions" style={{ flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(idx)}
                        title="Edit brand logo"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeClient(idx)}
                        title="Delete brand"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Client Brand Logo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Brand Logo: ${clientForm.name || clientForm.brand || ''}` : 'Add New Brand Logo'}
        subtitle="Upload or select the brand logo image. In the frontend, only this image appears inside the rotating cards."
        icon={ImageIcon}
      >
        <form onSubmit={handleSaveModal}>
          {/* Brand Name Input */}
          <div className="form-group">
            <label className="form-label">
              Brand / Company Name <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={clientForm.name || ''}
              onChange={(e) => handleFormFieldChange('name', e.target.value)}
              placeholder="e.g. Flexibond, Gulab Oils, Gokul Sweets, Amul"
              required
            />
            <p className="form-helper">
              Used as the reference in admin and as the image alt tag for SEO & accessibility.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Or Quick-Select Standard Brand Partner:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_BRANDS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid #cbd5e1',
                    background: clientForm.name === preset.name ? 'var(--primary-light)' : '#ffffff',
                    color: clientForm.name === preset.name ? 'var(--primary)' : 'var(--text-main)',
                    borderColor: clientForm.name === preset.name ? 'var(--primary)' : '#cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Upload Dropzone */}
          <div className="form-group">
            <label className="form-label">
              Brand Logo Image <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <FileUpload
              currentUrl={clientForm.logoUrl}
              label=""
              accept="image/png,image/svg+xml,image/webp,image/jpeg,image/jpg"
              onUploadComplete={(url) => handleFormFieldChange('logoUrl', url)}
            />
          </div>

          {/* Direct URL / Path input */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Direct Image URL or Public Path:
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. /logo/flexibond.webp or http://localhost:5000/uploads/..."
              value={clientForm.logoUrl || ''}
              onChange={(e) => handleFormFieldChange('logoUrl', e.target.value)}
            />
          </div>

          {/* Live Frontend Card Preview */}
          <div
            style={{
              marginTop: '18px',
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--primary)" /> Frontend Card Preview
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Exact appearance on live website
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
              {/* Frontend Card Replica */}
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  position: 'relative',
                  transition: 'transform 0.3s ease'
                }}
              >
                {clientForm.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={clientForm.logoUrl}
                    alt={clientForm.name || 'Preview'}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '4px' }}>
                    <ImageIcon size={28} style={{ margin: '0 auto 6px', opacity: 0.5 }} />
                    <p style={{ fontSize: '10.5px', lineHeight: 1.3, margin: 0, fontWeight: 500 }}>
                      Upload or enter image URL to preview
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', margin: '8px 0 0 0' }}>
                (Cards on website display logo only — no text)
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Brand Logo' : 'Add Brand Logo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
