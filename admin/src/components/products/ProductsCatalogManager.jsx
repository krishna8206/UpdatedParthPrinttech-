'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Search,
  RefreshCw,
  ExternalLink,
  Save,
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../lib/media';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const CATEGORY_PRESETS = [
  'Shrink Sleeves',
  'Wrap-Around Labels',
  'Heat Transfer Labels',
  'Shrink Film',
  'Flexible Packaging',
  'Cartons & Boxes'
];

const emptyProductForm = {
  id: '',
  num: '01',
  category: 'Shrink Sleeves',
  title: '',
  description: '',
  detailedDescription: '',
  image: '/images/products/pvc_shrink_sleeves.png',
  accentColor: '#009fe3',
  dim: 'Custom Diameter & Height',
  regMark: 'REG-PROD-01',
  specs: [
    { label: 'Substrate', value: 'High-Grade Film' },
    { label: 'Shrinkage Rate', value: 'Up to 58%' },
    { label: 'Print Process', value: 'Rotogravure / Flexo' },
    { label: 'Finishing Option', value: 'Gloss / Matte' }
  ]
};

export default function ProductsCatalogManager() {
  // Page Header Data
  const [headerData, setHeaderData] = useState({
    title: 'Our Print &',
    titleHighlight: 'Packaging Solutions',
    description: 'Inspect the engineering details, sizes, and print calibrations of our premium commercial packaging solutions.'
  });
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // Products Data
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding
  const [currentForm, setCurrentForm] = useState(emptyProductForm);

  const toast = useToast();

  const fetchCatalogData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getProducts();
      if (res.success) {
        if (res.data) setProducts(res.data);
        if (res.header) setHeaderData(res.header);
      }
    } catch (err) {
      toast.error('Failed to load products: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  // Handle Header Save
  const handleSaveHeader = async () => {
    setIsSavingHeader(true);
    try {
      await api.updateProductsHeader(headerData);
      toast.success('Products page header updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save header');
    } finally {
      setIsSavingHeader(false);
    }
  };

  // Categories list
  const existingCategories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.regMark?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open Add Modal
  const openAddModal = () => {
    setEditingId(null);
    const nextIndex = products.length + 1;
    const numStr = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
    setCurrentForm({
      ...emptyProductForm,
      id: '',
      num: numStr,
      regMark: `REG-PROD-${numStr}`,
      title: '',
      description: '',
      detailedDescription: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (prod) => {
    setEditingId(prod.id);
    setCurrentForm({
      ...prod,
      specs: prod.specs ? [...prod.specs] : []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setCurrentForm(emptyProductForm);
  };

  const handleFieldChange = (field, value) => {
    setCurrentForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto generate slug ID if adding and modifying title
      if (!editingId && field === 'title' && !prev.idModified) {
        updated.id = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  };

  // Specs handling
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...(currentForm.specs || [])];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setCurrentForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const addSpecField = () => {
    const updatedSpecs = [...(currentForm.specs || []), { label: 'Specification', value: 'Value' }];
    setCurrentForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const removeSpecField = (index) => {
    const updatedSpecs = currentForm.specs.filter((_, i) => i !== index);
    setCurrentForm((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  // Save Modal Form
  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!currentForm.title.trim()) {
      toast.error('Please enter product title');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Edit existing
        const res = await api.updateProduct(editingId, currentForm);
        if (res.success) {
          toast.success(`Product "${currentForm.title}" updated successfully!`);
          setProducts((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
        }
      } else {
        // Create new
        const res = await api.createProduct(currentForm);
        if (res.success) {
          toast.success(`New product "${currentForm.title}" added to catalog!`);
          setProducts((prev) => [...prev, res.data]);
        }
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id, title) => {
    if (products.length <= 1) {
      toast.error('Must maintain at least 1 catalog product.');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        toast.success(`Product deleted.`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // Reorder product
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setProducts(updated);

    try {
      await api.reorderProducts(updated);
      toast.success('Product order updated!');
    } catch (err) {
      toast.error('Failed to sync order to server.');
    }
  };

  return (
    <div>
      {/* Top Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={fetchCatalogData}
          className="btn btn-secondary btn-sm"
          title="Reload from backend"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Data
        </button>
        <a
          href="http://localhost:3000/products"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
        >
          <ExternalLink size={14} /> View Live Products Page
        </a>
      </div>

      {/* 1. Page Header Editor Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Package size={20} color="var(--primary)" /> Products Page Main Header
            </h2>
            <p className="card-subtitle">
              Edit the large title headline, cyan highlight text, and introductory subtitle displayed at the top of the /products page.
            </p>
          </div>
          <button onClick={handleSaveHeader} className="btn btn-primary" disabled={isSavingHeader}>
            <Save size={16} /> {isSavingHeader ? 'Saving...' : 'Save Page Header'}
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Page Headline (Main Part)</label>
            <input
              type="text"
              className="form-input"
              value={headerData.title || ''}
              onChange={(e) => setHeaderData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Our Print &"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Headline Cyan Accent Highlight</label>
            <input
              type="text"
              className="form-input"
              value={headerData.titleHighlight || ''}
              onChange={(e) => setHeaderData((prev) => ({ ...prev, titleHighlight: e.target.value }))}
              placeholder="e.g. Packaging Solutions"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Page Subtitle Description</label>
          <textarea
            rows={2}
            className="form-textarea"
            value={headerData.description || ''}
            onChange={(e) => setHeaderData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Inspect the engineering details, sizes, and print calibrations of our premium commercial packaging solutions."
          />
        </div>
      </div>

      {/* 2. Catalog Products List Card */}
      <div className="card">
        {/* Controls Toolbar: Search, Filters & Add Button */}
        <div className="card-header" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px', maxWidth: '320px', flex: 1 }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search products, categories, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {existingCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`tag-badge ${selectedCategory === cat ? 'item-badge-pill' : ''}`}
                  style={{
                    cursor: 'pointer',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    border: selectedCategory === cat ? '1px solid var(--primary-border)' : '1px solid var(--border)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {/* Products List */}
        <div className="items-list">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              Loading products catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No products found {searchQuery ? `matching "${searchQuery}"` : ''}. Click &quot;Add New Product&quot; to create one.
            </div>
          ) : (
            filteredProducts.map((prod, idx) => (
              <div key={prod.id || idx} className="item-card">
                <div className="item-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    {/* Thumbnail box */}
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: `2px solid ${prod.accentColor || '#009fe3'}`,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 3px 10px ${prod.accentColor || '#009fe3'}25`,
                      }}
                    >
                      {prod.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getMediaUrl(prod.image)}
                          alt={prod.title}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                          onError={(e) => {
                            if (prod.image?.startsWith('/images/')) {
                              e.currentTarget.src = `http://localhost:3000${prod.image}`;
                            }
                          }}
                        />
                      ) : (
                        <Package size={24} color={prod.accentColor || 'var(--primary)'} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="item-badge-pill" style={{ borderColor: prod.accentColor || 'var(--primary-border)' }}>
                          #{prod.num || idx + 1}
                        </span>
                        <span className="tag-badge" style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {prod.category}
                        </span>
                        {prod.regMark && (
                          <span className="tag-badge" style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--primary)' }}>
                            {prod.regMark}
                          </span>
                        )}
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                          {prod.title}
                        </h4>
                      </div>

                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '700px' }}>
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Move Up, Move Down, View Live, Edit, Delete) */}
                  <div className="item-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === products.length - 1}
                      title="Move down"
                    >
                      <MoveDown size={14} />
                    </button>
                    <a
                      href={`http://localhost:3000/products/${prod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      title="Preview product page"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(prod)}
                      title="Edit product details"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(prod.id, prod.title)}
                      title="Delete product"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Specs chips row */}
                {prod.specs && prod.specs.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '14px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-light)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {prod.specs.map((spec, sIdx) => (
                      <span key={sIdx} className="tag-badge" style={{ fontSize: '11px' }}>
                        <strong style={{ color: 'var(--text-main)', marginRight: '4px' }}>{spec.label}:</strong> {spec.value}
                      </span>
                    ))}
                    {prod.dim && (
                      <span className="tag-badge" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        📏 {prod.dim}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? `Edit Product: ${currentForm.title || ''}` : 'Add New Catalog Product'}
        subtitle="Configure product line details, category, technical specifications, and high-res imagery."
        icon={Package}
        maxWidth="820px"
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Title</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. PVC Shrink Sleeves"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                list="category-suggestions"
                value={currentForm.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                placeholder="Select or type category"
                required
              />
              <datalist id="category-suggestions">
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">URL Slug / Identifier</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.id || ''}
                onChange={(e) => {
                  setCurrentForm((prev) => ({ ...prev, id: e.target.value, idModified: true }));
                }}
                placeholder="e.g. pvc-shrink-sleeves"
                required
              />
              <p className="form-helper">Used for the URL: /products/[id]</p>
            </div>

            <div className="form-group">
              <label className="form-label">Index Number Badge</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.num || '01'}
                onChange={(e) => handleFieldChange('num', e.target.value)}
                placeholder="01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Mark</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.regMark || 'REG-PROD-01'}
                onChange={(e) => handleFieldChange('regMark', e.target.value)}
                placeholder="e.g. REG-PVC-01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accent Theme Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={currentForm.accentColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={currentForm.accentColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dimensions / Sizing Tag</label>
            <input
              type="text"
              className="form-input"
              value={currentForm.dim || 'Custom Diameter & Height'}
              onChange={(e) => handleFieldChange('dim', e.target.value)}
              placeholder="e.g. Custom Diameter & Height or Roll Format"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary Description (Grid Card)</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={currentForm.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Brief overview displayed on the main catalog card grid..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Specification Narrative (Product Detail Page)</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={currentForm.detailedDescription || ''}
              onChange={(e) => handleFieldChange('detailedDescription', e.target.value)}
              placeholder="In-depth technical narrative, applications, material properties, and engineering calibration details..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Image Path or Upload</label>
            <input
              type="text"
              className="form-input"
              value={currentForm.image || ''}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <FileUpload
              currentUrl={currentForm.image}
              label="Upload High-Resolution Product Image"
              accept="image/*"
              onUploadComplete={(url) => handleFieldChange('image', url)}
            />
          </div>

          {/* Dynamic Specs Table Grid */}
          <div style={{ marginTop: '20px', background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <label className="form-label" style={{ margin: 0 }}>Technical Specification Parameters</label>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  Parameters listed here automatically populate the calibration spec dashboard on the live website.
                </p>
              </div>
              <button type="button" onClick={addSpecField} className="btn btn-secondary btn-sm">
                <Plus size={12} /> Add Spec Parameter
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {(currentForm.specs || []).map((spec, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Parameter (e.g. Substrate)"
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
                    onClick={() => removeSpecField(sIdx)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '6px 8px' }}
                    title="Remove parameter"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
