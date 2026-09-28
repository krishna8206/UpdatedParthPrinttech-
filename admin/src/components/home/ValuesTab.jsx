'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, Award, Target, Cpu, Leaf, Shield } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const emptyValue = {
  id: '',
  title: '',
  description: '',
  iconType: 'target'
};

const getIconComponent = (type) => {
  switch (type) {
    case 'cpu': return Cpu;
    case 'leaf': return Leaf;
    case 'shield': return Shield;
    case 'target':
    default: return Target;
  }
};

export default function ValuesTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    title: initialData.title || 'Our Core',
    titleHighlight: initialData.titleHighlight || 'Values',
    description: initialData.description || '',
    items: initialData.items || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [valueForm, setValueForm] = useState(emptyValue);
  const toast = useToast();

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || 'Our Core',
        titleHighlight: initialData.titleHighlight || 'Values',
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
      await api.updateValues(formData);
      toast.success('Core Values header updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save values');
    } finally {
      setIsSaving(false);
    }
  };

  // Modals
  const openAddModal = () => {
    setEditingIndex(null);
    setValueForm({
      id: Date.now(),
      title: 'New Core Value Pillar',
      description: 'Dedicated to delivering excellence in every single roll and printed package.',
      iconType: 'target'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    setEditingIndex(idx);
    setValueForm({ ...formData.items[idx] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setValueForm(emptyValue);
  };

  const handleFieldChange = (field, value) => {
    setValueForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!valueForm.title) {
      toast.error('Please enter value title');
      return;
    }

    let updatedItems;
    if (editingIndex !== null) {
      updatedItems = [...formData.items];
      updatedItems[editingIndex] = valueForm;
    } else {
      updatedItems = [...formData.items, { ...valueForm, id: valueForm.id || Date.now() }];
    }

    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateValues(updatedData);
      toast.success(editingIndex !== null ? 'Core value updated and saved!' : 'New value pillar added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeValue = async (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedData = { ...formData, items: updatedItems };
    setFormData(updatedData);

    try {
      await api.updateValues(updatedData);
      toast.success('Value card removed and saved!');
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
              <Award size={20} color="var(--primary)" /> Core Values ({formData.items.length} Values)
            </h2>
            <p className="card-subtitle">
              Manage the 4 core brand pillars, titles, descriptions, and iconography.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={16} /> Add Value Card
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
            Values Grid Items
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {formData.items.length === 0 ? (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '36px', color: 'var(--text-muted)' }}>
                No core values configured. Click &quot;Add Value Card&quot; to create one.
              </div>
            ) : (
              formData.items.map((val, idx) => {
                const IconComp = getIconComponent(val.iconType);
                return (
                  <div key={val.id || idx} className="item-card">
                    <div className="item-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--primary-light)',
                          border: '1px solid var(--primary-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)'
                        }}>
                          <IconComp size={18} />
                        </div>
                        <div>
                          <span className="item-badge-pill" style={{ marginBottom: '2px' }}>Pillar #{idx + 1}</span>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {val.title}
                          </h4>
                        </div>
                      </div>

                      <div className="item-card-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(idx)}
                          title="Edit value"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeValue(idx)}
                          title="Delete value"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '12px' }}>
                      {val.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Value Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Core Value: ${valueForm.title || ''}` : 'Add New Core Value Pillar'}
        subtitle="Configure the pillar title, icon type, and brand story description."
        icon={Award}
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Value Title</label>
              <input
                type="text"
                className="form-input"
                value={valueForm.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Precision Engineering"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Icon Type</label>
              <select
                className="form-select"
                value={valueForm.iconType || 'target'}
                onChange={(e) => handleFieldChange('iconType', e.target.value)}
              >
                <option value="target">🎯 Precision Target</option>
                <option value="cpu">⚡ Advanced Technology (CPU)</option>
                <option value="leaf">🌿 Eco-Friendly (Leaf)</option>
                <option value="shield">🛡️ Quality Shield</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={valueForm.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Dedicated to delivering excellence in every single roll and printed package."
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingIndex !== null ? 'Save Changes' : 'Add Value Card'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
