'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, MessageSquare, Star } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const emptyTestimonial = {
  id: '',
  client: '',
  role: '',
  company: '',
  quote: '',
  rating: 5,
  avatarColor: '#009fe3'
};

export default function TestimonialsTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    title: initialData.title || 'What Our',
    titleHighlight: initialData.titleHighlight || 'Clients Say',
    description: initialData.description || '',
    items: initialData.items || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const toast = useToast();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || 'What Our',
        titleHighlight: initialData.titleHighlight || 'Clients Say',
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
      await api.updateTestimonials(formData);
      toast.success('Testimonials header updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save testimonials');
    } finally {
      setIsSaving(false);
    }
  };

  // Modals
  const openAddModal = () => {
    setEditingIndex(null);
    setTestimonialForm({
      id: Date.now(),
      client: '',
      role: 'Operations Director',
      company: 'Enterprise Brands',
      quote: 'Exceptional print quality and flawless turnaround time. Parth Printtech is our trusted packaging partner.',
      rating: 5,
      avatarColor: '#009fe3'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    setEditingIndex(idx);
    setTestimonialForm({ ...formData.items[idx] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setTestimonialForm(emptyTestimonial);
  };

  const handleFieldChange = (field, value) => {
    setTestimonialForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!testimonialForm.client || !testimonialForm.quote) {
      toast.error('Please enter client name and testimonial quote');
      return;
    }

    let updatedItems;
    if (editingIndex !== null) {
      updatedItems = [...formData.items];
      updatedItems[editingIndex] = testimonialForm;
    } else {
      updatedItems = [...formData.items, { ...testimonialForm, id: testimonialForm.id || Date.now() }];
    }

    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateTestimonials(updatedData);
      toast.success(editingIndex !== null ? 'Review updated and saved!' : 'New review added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeTestimonial = async (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);

    try {
      await api.updateTestimonials(updatedData);
      toast.success('Testimonial removed and saved!');
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
              <MessageSquare size={20} color="var(--primary)" /> Testimonials & Reviews ({formData.items.length} Reviews)
            </h2>
            <p className="card-subtitle">
              Manage the two alternating infinite marquee review tracks, 5-star ratings, quotes, and client credentials.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Testimonial
            </button>
            <button onClick={handleSaveHeader} className="btn btn-secondary" disabled={isSaving}>
              <Save size={16} /> Save Header
            </button>
          </div>
        </div>

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
          <label className="form-label">Section Subtitle / Description</label>
          <textarea
            rows={2}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleHeaderChange('description', e.target.value)}
          />
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
            Customer Reviews List
          </h3>

          <div className="items-list">
            {formData.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                No testimonials added yet. Click &quot;Add Testimonial&quot; to create one.
              </div>
            ) : (
              formData.items.map((item, idx) => (
                <div key={item.id || idx} className="item-card">
                  <div className="item-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: item.avatarColor || '#009fe3',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {item.client ? item.client[0].toUpperCase() : 'U'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {item.client || 'Anonymous'}
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            ({item.role ? `${item.role}, ` : ''}{item.company})
                          </span>
                        </div>
                        {/* Star Rating display */}
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                          {[...Array(item.rating || 5)].map((_, s) => (
                            <Star key={s} size={13} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(idx)}
                        title="Edit testimonial"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeTestimonial(idx)}
                        title="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', marginTop: '10px', fontStyle: 'italic', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Testimonial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Review: ${testimonialForm.client || ''}` : 'Add New Client Review'}
        subtitle="Configure client credentials, rating, avatar tint, and quote text."
        icon={MessageSquare}
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Client Full Name</label>
              <input
                type="text"
                className="form-input"
                value={testimonialForm.client || ''}
                onChange={(e) => handleFieldChange('client', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Role / Designation</label>
              <input
                type="text"
                className="form-input"
                value={testimonialForm.role || ''}
                onChange={(e) => handleFieldChange('role', e.target.value)}
                placeholder="e.g. VP Packaging & Quality"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company / Brand Name</label>
              <input
                type="text"
                className="form-input"
                value={testimonialForm.company || ''}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                placeholder="e.g. FMCG Leaders Ltd."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Star Rating</label>
              <select
                className="form-select"
                value={testimonialForm.rating || 5}
                onChange={(e) => handleFieldChange('rating', Number(e.target.value))}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Badge Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={testimonialForm.avatarColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('avatarColor', e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={testimonialForm.avatarColor || '#009fe3'}
                  onChange={(e) => handleFieldChange('avatarColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Testimonial Quote</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={testimonialForm.quote || ''}
              onChange={(e) => handleFieldChange('quote', e.target.value)}
              placeholder="Write the partner's feedback review..."
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Changes' : 'Add Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
