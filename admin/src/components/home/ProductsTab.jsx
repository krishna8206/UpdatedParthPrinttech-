'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, Package, Layers, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../lib/media';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const emptyProduct = {
  id: '',
  category: 'Shrink Sleeves',
  title: '',
  description: '',
  image: '/images/products/pvc_shrink_sleeves.png',
  accentColor: '#009fe3',
  specs: [
    { label: 'Substrate', value: 'High-Grade Film' },
    { label: 'Shrinkage Rate', value: 'Up to 60%' },
    { label: 'Print Process', value: 'Rotogravure' },
    { label: 'Finish', value: 'Gloss / Matte' }
  ]
};

export default function ProductsTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    title: initialData.title || 'Engineered Print',
    titleHighlight: initialData.titleHighlight || 'Solutions',
    description: initialData.description || '',
    items: initialData.items || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const toast = useToast();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || 'Engineered Print',
        titleHighlight: initialData.titleHighlight || 'Solutions',
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
      await api.updateFeaturedProducts(formData);
      toast.success('Featured Products section header updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  // Modal open
  const openAddModal = () => {
    setEditingIndex(null);
    setProductForm({
      id: '0' + (formData.items.length + 1),
      category: 'Shrink Sleeves',
      title: 'New Custom Label Solution',
      description: 'Engineered for exceptional surface adhesion and dynamic shelf appeal.',
      image: '/images/products/pvc_shrink_sleeves.png',
      accentColor: '#009fe3',
      specs: [
        { label: 'Substrate', value: 'High-Grade Film' },
        { label: 'Shrinkage Rate', value: 'Up to 60%' },
        { label: 'Print Process', value: 'Rotogravure' },
        { label: 'Finish', value: 'Gloss / Matte' }
      ]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    setEditingIndex(idx);
    setProductForm({
      ...formData.items[idx],
      specs: formData.items[idx].specs ? [...formData.items[idx].specs] : []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setProductForm(emptyProduct);
  };

  const handleProductFieldChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  // Specs in modal
  const handleSpecChange = (specIdx, field, value) => {
    const updatedSpecs = [...(productForm.specs || [])];
    updatedSpecs[specIdx] = { ...updatedSpecs[specIdx], [field]: value };
    setProductForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const addSpec = () => {
    const updatedSpecs = [...(productForm.specs || []), { label: 'Feature', value: 'Specification' }];
    setProductForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const removeSpec = (specIdx) => {
    const updatedSpecs = productForm.specs.filter((_, i) => i !== specIdx);
    setProductForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  // Save product from modal
  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!productForm.title) {
      toast.error('Please enter product title');
      return;
    }

    let updatedItems;
    if (editingIndex !== null) {
      updatedItems = [...formData.items];
      updatedItems[editingIndex] = productForm;
    } else {
      updatedItems = [...formData.items, productForm];
    }

    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateFeaturedProducts(updatedData);
      toast.success(editingIndex !== null ? 'Product updated and saved!' : 'New product added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Updated locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);

    try {
      await api.updateFeaturedProducts(updatedData);
      toast.success('Product removed and saved!');
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
              <Package size={20} color="var(--primary)" /> Featured Products Showcase ({formData.items.length} Products)
            </h2>
            <p className="card-subtitle">
              Manage the alternating product rows, category badges, high-res photos, 2x2 technical specs grid, and CTAs.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Product Showcase
            </button>
            <button onClick={handleSaveHeader} className="btn btn-secondary" disabled={isSaving}>
              <Save size={16} /> Save Header
            </button>
          </div>
        </div>

        {/* Section Header fields */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => handleHeaderChange('title', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title Outlined Highlight</label>
            <input
              type="text"
              className="form-input"
              value={formData.titleHighlight}
              onChange={(e) => handleHeaderChange('titleHighlight', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Section Description</label>
          <textarea
            rows={2}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleHeaderChange('description', e.target.value)}
          />
        </div>

        {/* Products List */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
            Products Rows
          </h3>

          <div className="items-list">
            {formData.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No products configured. Click &quot;Add Product Showcase&quot; to create one.
              </div>
            ) : (
              formData.items.map((prod, idx) => (
                <div key={prod.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Accent color pill & thumb */}
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                        border: `2px solid ${prod.accentColor || '#009fe3'}`,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative'
                      }}>
                        {prod.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={getMediaUrl(prod.image)}
                            alt={prod.title || 'Product'}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                            onError={(e) => {
                              if (prod.image?.startsWith('/images/')) {
                                e.currentTarget.src = `http://localhost:3000${prod.image}`;
                              }
                            }}
                          />
                        ) : (
                          <Package size={22} color={prod.accentColor || 'var(--primary)'} />
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="item-badge-pill" style={{ borderColor: prod.accentColor || 'var(--primary-border)' }}>
                            #{idx + 1}
                          </span>
                          <span className="tag-badge">
                            {prod.category || 'General'}
                          </span>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {prod.title}
                          </h4>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', maxWidth: '600px' }}>
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(idx)}
                        title="Edit product"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeProduct(idx)}
                        title="Delete product"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Specs summary tags */}
                  {prod.specs && prod.specs.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap' }}>
                      {prod.specs.map((spec, sIdx) => (
                        <span key={sIdx} className="tag-badge" style={{ fontSize: '11px' }}>
                          <strong style={{ color: 'var(--text-main)', marginRight: '4px' }}>{spec.label}:</strong> {spec.value}
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

      {/* Add / Edit Product Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Product: ${productForm.title || ''}` : 'Add New Product Showcase'}
        subtitle="Configure category badge, title, high-res image, and 2x2 technical specs grid."
        icon={Package}
        maxWidth="760px"
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Category</label>
              <input
                type="text"
                className="form-input"
                value={productForm.category || ''}
                onChange={(e) => handleProductFieldChange('category', e.target.value)}
                placeholder="e.g. Shrink Sleeves or Flexible Pouches"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input
                type="text"
                className="form-input"
                value={productForm.title || ''}
                onChange={(e) => handleProductFieldChange('title', e.target.value)}
                placeholder="e.g. PVC Shrink Sleeves"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accent Glow Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={productForm.accentColor || '#009fe3'}
                  onChange={(e) => handleProductFieldChange('accentColor', e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={productForm.accentColor || '#009fe3'}
                  onChange={(e) => handleProductFieldChange('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description Copy</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={productForm.description || ''}
              onChange={(e) => handleProductFieldChange('description', e.target.value)}
              placeholder="Engineered for exceptional surface adhesion and dynamic shelf appeal."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Image Path or Upload</label>
            <input
              type="text"
              className="form-input"
              value={productForm.image || ''}
              onChange={(e) => handleProductFieldChange('image', e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <FileUpload
              currentUrl={productForm.image}
              label="Upload High-Resolution Product Image"
              accept="image/*"
              onUploadComplete={(url) => handleProductFieldChange('image', url)}
            />
          </div>

          {/* Technical Specifications Grid inside modal */}
          <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <label className="form-label" style={{ margin: 0 }}>Technical Specifications Grid</label>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Displays 2x2 specification badges on the product row.</p>
              </div>
              <button type="button" onClick={addSpec} className="btn btn-secondary btn-sm">
                <Plus size={12} /> Add Spec Field
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {(productForm.specs || []).map((spec, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Label (e.g. Substrate)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(sIdx, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Value (e.g. PVC Film)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(sIdx, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(sIdx)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '6px 8px' }}
                    title="Remove spec"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
