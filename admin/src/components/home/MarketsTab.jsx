'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, Globe, Tag, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';
import FileUpload from '../FileUpload';

const resolveAdminImg = (src) => {
  if (!src) return '';
  if (src.startsWith('/uploads/')) return `http://localhost:5000${src}`;
  if (src.startsWith('/')) return `http://localhost:3000${src}`;
  return src;
};

const emptyMarket = {
  id: '',
  title: '',
  description: '',
  image: '',
  products: ['Shrink Sleeves', 'Specialty Labels'],
  accentColor: '#009fe3'
};

export default function MarketsTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    title: initialData.title || 'Markets We',
    titleHighlight: initialData.titleHighlight || 'Serve',
    description: initialData.description || '',
    items: initialData.items || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [marketForm, setMarketForm] = useState(emptyMarket);
  const [productsInput, setProductsInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || 'Markets We',
        titleHighlight: initialData.titleHighlight || 'Serve',
        description: initialData.description || '',
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
      await api.updateMarkets(formData);
      toast.success('Markets We Serve header updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save markets data');
    } finally {
      setIsSaving(false);
    }
  };

  // Modals
  const openAddModal = () => {
    setEditingIndex(null);
    setMarketForm({
      id: 'market-' + Date.now(),
      title: 'New Industry Sector',
      description: 'Custom engineered high-barrier packaging and premium labels.',
      image: '',
      products: ['Shrink Sleeves', 'Specialty Labels'],
      accentColor: '#009fe3'
    });
    setProductsInput('Shrink Sleeves, Specialty Labels');
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    setEditingIndex(idx);
    const item = formData.items[idx];
    setMarketForm({
      id: item.id || 'market-' + Date.now(),
      title: item.title || '',
      description: item.description || '',
      image: item.image || item.photo || '',
      products: Array.isArray(item.products) ? item.products : [],
      accentColor: item.accentColor || '#009fe3'
    });
    setProductsInput(Array.isArray(item.products) ? item.products.join(', ') : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setMarketForm(emptyMarket);
    setProductsInput('');
  };

  const handleFieldChange = (field, value) => {
    setMarketForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!marketForm.title) {
      toast.error('Please enter industry title');
      return;
    }

    const parsedProducts = productsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedMarket = {
      ...marketForm,
      products: parsedProducts
    };

    let updatedItems;
    if (editingIndex !== null) {
      updatedItems = [...formData.items];
      updatedItems[editingIndex] = updatedMarket;
    } else {
      updatedItems = [...formData.items, { ...updatedMarket, id: updatedMarket.id || ('market-' + Date.now()) }];
    }

    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateMarkets(updatedData);
      toast.success(editingIndex !== null ? 'Market sector updated and saved!' : 'New market sector added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeItem = async (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);

    try {
      await api.updateMarkets(updatedData);
      toast.success('Market sector removed and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Removed locally.');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Globe size={20} color="var(--primary)" /> Markets We Serve ({formData.items.length} Industries)
            </h2>
            <p className="card-subtitle">
              Manage the 3D fanned paper cards, industry sectors, images, accent CMYK colors, and product tags.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Market Sector
            </button>
            <button onClick={handleSaveHeader} className="btn btn-secondary" disabled={isSaving}>
              <Save size={16} /> Save Header
            </button>
          </div>
        </div>

        {/* Header fields */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleHeaderChange('title', e.target.value)}
              placeholder="Markets We"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title Outlined Highlight</label>
            <input
              type="text"
              className="form-input"
              value={formData.titleHighlight}
              onChange={(e) => handleHeaderChange('titleHighlight', e.target.value)}
              placeholder="Serve"
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
          />
        </div>

        {/* Items List */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
            Industry Market Cards
          </h3>

          <div className="items-list">
            {formData.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No market sectors added. Click &quot;Add Market Sector&quot; to create one.
              </div>
            ) : (
              formData.items.map((market, idx) => (
                <div key={market.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: market.accentColor || '#009fe3',
                          display: 'inline-block',
                          boxShadow: `0 0 8px ${market.accentColor || '#009fe3'}66`,
                          flexShrink: 0
                        }}
                      />
                      {market.image ? (
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={resolveAdminImg(market.image)}
                            alt={market.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            background: '#f1f5f9',
                            border: '1px dashed #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8',
                            flexShrink: 0
                          }}
                        >
                          <ImageIcon size={18} />
                        </div>
                      )}
                      <span className="item-badge-pill">#{idx + 1}</span>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                        {market.title}
                      </h4>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(idx)}
                        title="Edit market sector"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(idx)}
                        title="Delete market"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {market.description && (
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      {market.description}
                    </p>
                  )}

                  {/* Product Tags */}
                  {market.products && market.products.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {market.products.map((p, pIdx) => (
                        <span key={pIdx} className="tag-badge">
                          <Tag size={10} style={{ marginRight: '4px', opacity: 0.7 }} /> {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Market Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Market Sector: ${marketForm.title || ''}` : 'Add New Market Sector'}
        subtitle="Configure industry sector name, image, description, accent brand color, and product tags."
        icon={Globe}
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry Title</label>
              <input
                type="text"
                className="form-input"
                value={marketForm.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Food & Beverages or Pharmaceuticals"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accent Brand Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={marketForm.accentColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={marketForm.accentColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Market Packaging Image */}
          <div className="form-group">
            <label className="form-label">Market Packaging Image</label>
            <FileUpload
              currentUrl={marketForm.image}
              label=""
              accept="image/*"
              onUploadComplete={(url) => handleFieldChange('image', url)}
            />
            <div style={{ marginTop: '8px' }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Or Image Path / URL
              </label>
              <input
                type="text"
                className="form-input"
                value={marketForm.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="/images/products/pvc_shrink_sleeves.png or https://..."
              />
            </div>
            {marketForm.image && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <img
                  src={resolveAdminImg(marketForm.image)}
                  alt="Preview"
                  style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', background: '#fff', border: '1px solid #cbd5e1' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {marketForm.image}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Card Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={marketForm.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Custom engineered high-barrier packaging and premium labels."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Tags (Comma Separated)</label>
            <input
              type="text"
              className="form-input"
              value={productsInput}
              onChange={(e) => setProductsInput(e.target.value)}
              placeholder="e.g. Stand-Up Pouches, Shrink Sleeves, Barrier Laminates"
            />
            <p className="form-helper">Separate multiple tags with a comma.</p>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Changes' : 'Add Market Sector'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
