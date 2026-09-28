'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, Plus, Trash2, Edit3, BarChart2, Layers } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const emptyStat = { num: '100%', label: 'Client Satisfaction', backText: 'Our clients are always happy!' };
const emptyFloatCard = { title: 'Precision Tech', desc: 'State of the art machinery.' };

export default function WhoWeAreTab({ initialData = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    subheading: initialData.subheading || 'WHO WE ARE',
    headingLine1: initialData.headingLine1 || 'Redefining The',
    headingLine2Highlight: initialData.headingLine2Highlight || 'Art',
    headingLine2Rest: initialData.headingLine2Rest || 'Of Printing.',
    description: initialData.description || '',
    image: initialData.image || '/images/Who_We_Are.jpg',
    badgeText: initialData.badgeText || '• ESTABLISHED EXPERTS • PREMIUM PRINTING',
    stats: initialData.stats || [
      { num: '100%', label: 'Client Satisfaction', backText: 'Our clients are always happy!' },
      { num: 'Top', label: 'Quality Materials', backText: 'Built to impress!' }
    ],
    floatCards: initialData.floatCards || [
      { title: 'Precision Tech', desc: 'State of the art machinery.' },
      { title: 'Custom Packaging', desc: 'Tailored to your brand.' }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  // Modals state
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [editingStatIndex, setEditingStatIndex] = useState(null);
  const [statForm, setStatForm] = useState(emptyStat);

  const [floatModalOpen, setFloatModalOpen] = useState(false);
  const [editingFloatIndex, setEditingFloatIndex] = useState(null);
  const [floatForm, setFloatForm] = useState(emptyFloatCard);

  // Sync state when parent data refreshes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        subheading: initialData.subheading || 'WHO WE ARE',
        headingLine1: initialData.headingLine1 || 'Redefining The',
        headingLine2Highlight: initialData.headingLine2Highlight || 'Art',
        headingLine2Rest: initialData.headingLine2Rest || 'Of Printing.',
        description: initialData.description || '',
        image: initialData.image || '/images/Who_We_Are.jpg',
        badgeText: initialData.badgeText || '• ESTABLISHED EXPERTS • PREMIUM PRINTING',
        stats: initialData.stats || [
          { num: '100%', label: 'Client Satisfaction', backText: 'Our clients are always happy!' },
          { num: 'Top', label: 'Quality Materials', backText: 'Built to impress!' }
        ],
        floatCards: initialData.floatCards || [
          { title: 'Precision Tech', desc: 'State of the art machinery.' },
          { title: 'Custom Packaging', desc: 'Tailored to your brand.' }
        ]
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSection = async (updatedData = formData) => {
    setIsSaving(true);
    try {
      await api.updateWhoWeAre(updatedData);
      toast.success('Who We Are section updated successfully!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save Who We Are data');
    } finally {
      setIsSaving(false);
    }
  };

  // Stat Cards Modals
  const openAddStatModal = () => {
    setEditingStatIndex(null);
    setStatForm({ num: '', label: '', backText: '' });
    setStatModalOpen(true);
  };

  const openEditStatModal = (idx) => {
    setEditingStatIndex(idx);
    setStatForm({ ...formData.stats[idx] });
    setStatModalOpen(true);
  };

  const handleSaveStat = async (e) => {
    if (e) e.preventDefault();
    if (!statForm.num || !statForm.label) {
      toast.error('Please provide a number/badge and front label');
      return;
    }

    let updatedStats;
    if (editingStatIndex !== null) {
      updatedStats = [...formData.stats];
      updatedStats[editingStatIndex] = statForm;
    } else {
      updatedStats = [...formData.stats, statForm];
    }

    const updatedData = { ...formData, stats: updatedStats };
    setFormData(updatedData);
    setStatModalOpen(false);
    await handleSaveSection(updatedData);
  };

  const removeStat = async (idx) => {
    const updatedStats = formData.stats.filter((_, i) => i !== idx);
    const updatedData = { ...formData, stats: updatedStats };
    setFormData(updatedData);
    await handleSaveSection(updatedData);
  };

  // Floating Cards Modals
  const openAddFloatModal = () => {
    setEditingFloatIndex(null);
    setFloatForm({ title: '', desc: '' });
    setFloatModalOpen(true);
  };

  const openEditFloatModal = (idx) => {
    setEditingFloatIndex(idx);
    setFloatForm({ ...formData.floatCards[idx] });
    setFloatModalOpen(true);
  };

  const handleSaveFloat = async (e) => {
    if (e) e.preventDefault();
    if (!floatForm.title) {
      toast.error('Please provide a card title');
      return;
    }

    let updatedCards;
    if (editingFloatIndex !== null) {
      updatedCards = [...formData.floatCards];
      updatedCards[editingFloatIndex] = floatForm;
    } else {
      updatedCards = [...formData.floatCards, floatForm];
    }

    const updatedData = { ...formData, floatCards: updatedCards };
    setFormData(updatedData);
    setFloatModalOpen(false);
    await handleSaveSection(updatedData);
  };

  const removeFloatCard = async (idx) => {
    const updatedCards = formData.floatCards.filter((_, i) => i !== idx);
    const updatedData = { ...formData, floatCards: updatedCards };
    setFormData(updatedData);
    await handleSaveSection(updatedData);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Info size={20} color="var(--primary)" /> &quot;Who We Are&quot; Story & Showcase
            </h2>
            <p className="card-subtitle">
              Manage the brand narrative, headline typography, rotating badge text, interactive flip stat cards, and parallax image.
            </p>
          </div>
          <button onClick={() => handleSaveSection()} className="btn btn-primary" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Headings */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subheading Tag</label>
            <input
              type="text"
              className="form-input"
              value={formData.subheading}
              onChange={(e) => handleChange('subheading', e.target.value)}
              placeholder="e.g. WHO WE ARE"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rotating Badge Circle Text</label>
            <input
              type="text"
              className="form-input"
              value={formData.badgeText}
              onChange={(e) => handleChange('badgeText', e.target.value)}
              placeholder="e.g. • ESTABLISHED EXPERTS • PREMIUM PRINTING"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Main Heading Line 1</label>
            <input
              type="text"
              className="form-input"
              value={formData.headingLine1}
              onChange={(e) => handleChange('headingLine1', e.target.value)}
              placeholder="e.g. Redefining The"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Line 2 Outlined Highlight Word</label>
            <input
              type="text"
              className="form-input"
              value={formData.headingLine2Highlight}
              onChange={(e) => handleChange('headingLine2Highlight', e.target.value)}
              placeholder="e.g. Art"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Line 2 Remaining Text</label>
            <input
              type="text"
              className="form-input"
              value={formData.headingLine2Rest}
              onChange={(e) => handleChange('headingLine2Rest', e.target.value)}
              placeholder="e.g. Of Printing."
            />
          </div>
        </div>

        {/* Narrative Description */}
        <div className="form-group">
          <label className="form-label">Main Story Description</label>
          <textarea
            rows={4}
            className="form-textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Write compelling brand copy..."
          />
        </div>

        {/* Main Section Image */}
        <div className="form-group">
          <label className="form-label">Featured Image (Parallax Media Block)</label>
          <input
            type="text"
            className="form-input"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <FileUpload
            currentUrl={formData.image}
            label="Upload High-Resolution Showcase Photo"
            accept="image/*"
            onUploadComplete={(url) => handleChange('image', url)}
          />
        </div>

        {/* Flip Stat Cards Section with Add / Edit Modal */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Interactive 3D Flip Stat Cards ({formData.stats.length})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Stat boxes that flip to reveal back detail text on user hover.
              </p>
            </div>
            <button type="button" onClick={openAddStatModal} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Stat Card
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {formData.stats.map((stat, idx) => (
              <div key={idx} className="item-card">
                <div className="item-card-header" style={{ marginBottom: '10px' }}>
                  <span className="item-badge-pill">Stat #{idx + 1}</span>
                  <div className="item-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditStatModal(idx)}
                      title="Edit stat"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeStat(idx)}
                      title="Delete stat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                    {stat.num || '—'}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {stat.label || 'No label'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                    Back: &quot;{stat.backText}&quot;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Highlight Cards Section with Add / Edit Modal */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                Floating Glass Accent Cards ({formData.floatCards.length})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Glassmorphic accent cards overlaid dynamically on the showcase media.
              </p>
            </div>
            <button type="button" onClick={openAddFloatModal} className="btn btn-secondary btn-sm">
              <Plus size={14} /> Add Floating Card
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {formData.floatCards.map((card, idx) => (
              <div key={idx} className="item-card">
                <div className="item-card-header" style={{ marginBottom: '10px' }}>
                  <span className="item-badge-pill">Card #{idx + 1}</span>
                  <div className="item-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditFloatModal(idx)}
                      title="Edit card"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFloatCard(idx)}
                      title="Delete card"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {card.title || 'Untitled'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {card.desc || 'No description'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Card Modal Form */}
      <Modal
        isOpen={statModalOpen}
        onClose={() => setStatModalOpen(false)}
        title={editingStatIndex !== null ? `Edit Stat Card #${editingStatIndex + 1}` : 'Add New Stat Card'}
        subtitle="Configure the front number metric, label, and flip reveal description."
        icon={BarChart2}
      >
        <form onSubmit={handleSaveStat}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Big Stat (Front Number/Badge)</label>
              <input
                type="text"
                className="form-input"
                value={statForm.num}
                onChange={(e) => setStatForm({ ...statForm, num: e.target.value })}
                placeholder="e.g. 100% or 25+"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Front Label</label>
              <input
                type="text"
                className="form-input"
                value={statForm.label}
                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                placeholder="e.g. Client Satisfaction"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Back Flip Reveal Text</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={statForm.backText}
              onChange={(e) => setStatForm({ ...statForm, backText: e.target.value })}
              placeholder="e.g. Our clients are always happy with precision tolerances!"
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={() => setStatModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStatIndex !== null ? 'Save Changes' : 'Add Stat Card'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Floating Card Modal Form */}
      <Modal
        isOpen={floatModalOpen}
        onClose={() => setFloatModalOpen(false)}
        title={editingFloatIndex !== null ? `Edit Floating Card #${editingFloatIndex + 1}` : 'Add New Floating Card'}
        subtitle="Configure the glass accent card headline and tagline."
        icon={Layers}
      >
        <form onSubmit={handleSaveFloat}>
          <div className="form-group">
            <label className="form-label">Card Title</label>
            <input
              type="text"
              className="form-input"
              value={floatForm.title}
              onChange={(e) => setFloatForm({ ...floatForm, title: e.target.value })}
              placeholder="e.g. Precision Tech"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Card Tagline / Description</label>
            <input
              type="text"
              className="form-input"
              value={floatForm.desc}
              onChange={(e) => setFloatForm({ ...floatForm, desc: e.target.value })}
              placeholder="e.g. State of the art European printing machinery."
            />
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={() => setFloatModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingFloatIndex !== null ? 'Save Changes' : 'Add Floating Card'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
