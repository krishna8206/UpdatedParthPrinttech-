'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, MoveUp, MoveDown, Film, CheckCircle2, Play, ExternalLink, Video, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../FileUpload';
import Modal from '../Modal';

const emptySlide = {
  videoSrc: '/videos/0918(2) (1).mp4',
  title: '',
  titleHighlight: '',
  subtitle: '',
  ctaText: 'Explore Services',
  ctaLink: '/products',
  isActive: true,
};

export default function HeroSliderTab({ initialSlides = [], initialHeroVideo = '', onRefresh }) {
  const [slides, setSlides] = useState(initialSlides);
  const [heroVideo, setHeroVideo] = useState(initialHeroVideo || '/videos/0918(2) (1).mp4');
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null means adding new
  const [currentSlideForm, setCurrentSlideForm] = useState(emptySlide);
  const toast = useToast();

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
  }, [initialSlides]);

  useEffect(() => {
    if (initialHeroVideo) {
      setHeroVideo(initialHeroVideo);
    }
  }, [initialHeroVideo]);

  // ─── Background Video Handlers ───────────────────────────────────────────
  const handleSaveHeroVideo = async () => {
    if (!heroVideo) {
      toast.error('Please enter or upload a video URL first');
      return;
    }
    setIsSavingVideo(true);
    try {
      await api.updateHeroVideo(heroVideo);
      toast.success('Background video updated successfully! Refresh the frontend to see changes.');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update background video');
    } finally {
      setIsSavingVideo(false);
    }
  };

  // ─── Slide CRUD ───────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingIndex(null);
    setCurrentSlideForm({
      id: Date.now(),
      videoSrc: heroVideo || '/videos/0918(2) (1).mp4',
      title: 'High-Precision',
      titleHighlight: 'Printing Solution',
      subtitle: 'Engineered for exceptional packaging performance and vibrant color reproduction.',
      ctaText: 'Explore Services',
      ctaLink: '/products',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setCurrentSlideForm({ ...slides[index] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setCurrentSlideForm(emptySlide);
  };

  const handleFormChange = (field, value) => {
    setCurrentSlideForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!currentSlideForm.title && !currentSlideForm.titleHighlight) {
      toast.error('Please enter at least a title for the slide');
      return;
    }

    let updatedSlides;
    if (editingIndex !== null) {
      // Edit existing
      updatedSlides = [...slides];
      updatedSlides[editingIndex] = currentSlideForm;
    } else {
      // Add new
      updatedSlides = [...slides, { ...currentSlideForm, id: currentSlideForm.id || Date.now() }];
    }

    setSlides(updatedSlides);
    closeModal();

    setIsSaving(true);
    try {
      await api.updateHeroSlides(updatedSlides);
      toast.success(editingIndex !== null ? 'Slide updated successfully!' : 'New slide added and saved!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Saved locally. Click "Save All Slides" if backend failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeSlide = async (index) => {
    if (slides.length <= 1) {
      toast.error('Must keep at least 1 hero slide');
      return;
    }
    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);

    try {
      await api.updateHeroSlides(updatedSlides);
      toast.success('Slide removed and database updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error('Removed locally.');
    }
  };

  const moveSlide = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSlides(updated);

    try {
      await api.updateHeroSlides(updated);
      toast.success('Slide order updated!');
      if (onRefresh) onRefresh();
    } catch (err) {
      // ignore
    }
  };

  // Resolve video URL for preview (handle both absolute and relative)
  const resolveVideoUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div>
      {/* ═══════════════ BACKGROUND VIDEO CARD ═══════════════ */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Video size={20} color="var(--primary)" /> Hero Background Video
            </h2>
            <p className="card-subtitle">
              Configure the background video that plays in a loop behind all slides on the homepage.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveHeroVideo}
            disabled={isSavingVideo}
          >
            <Save size={16} />
            {isSavingVideo ? 'Saving Video...' : 'Save Background Video'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Video Preview Column */}
          <div>
            <label className="form-label" style={{ marginBottom: '8px' }}>Active Video Preview</label>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: '#0b1329',
              position: 'relative',
              aspectRatio: '16/9',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {heroVideo ? (
                <video
                  key={heroVideo}
                  src={resolveVideoUrl(heroVideo)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '8px', color: '#64748b',
                }}>
                  <Film size={32} />
                  <span style={{ fontSize: '12px' }}>No video configured</span>
                </div>
              )}
              {/* Play indicator badge */}
              <div style={{
                position: 'absolute', top: '8px', left: '8px',
                background: 'rgba(11, 19, 41, 0.8)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                padding: '3px 8px', borderRadius: '4px',
                fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <Play size={10} color="#009fe3" fill="#009fe3" /> Live Preview
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Plays continuously in loop across the entire hero banner.
            </p>
          </div>

          {/* Controls Column */}
          <div>
            <div className="form-group">
              <label className="form-label">Current Video URL / Path</label>
              <input
                type="text"
                className="form-input"
                value={heroVideo}
                onChange={(e) => setHeroVideo(e.target.value)}
                placeholder="/videos/0918(2) (1).mp4 or uploaded URL"
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Enter a file path like <code>/videos/filename.mp4</code> or upload a new video below.
              </p>
            </div>

            <FileUpload
              currentUrl={heroVideo}
              label="Upload New Video File"
              accept="video/mp4,video/webm,video/*"
              onUploadComplete={(url) => setHeroVideo(url)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Film size={20} color="var(--primary)" /> Hero Video Slider ({slides.length} Slides)
            </h2>
            <p className="card-subtitle">
              Manage background video slides, headlines, cyan highlights, subtitles, and CTA buttons on the homepage.
            </p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add New Slide
          </button>
        </div>

        {/* Slides List */}
        <div className="items-list">
          {slides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No hero slides configured. Click &quot;Add New Slide&quot; to create one.
            </div>
          ) : (
            slides.map((slide, index) => (
              <div key={slide.id || index} className="item-card">
                <div className="item-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="item-badge-pill">
                      Slide #{index + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {slide.title || 'Untitled Slide'} <span style={{ color: 'var(--primary)' }}>{slide.titleHighlight}</span>
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '500px' }}>
                        {slide.subtitle || 'No subtitle provided'}
                      </p>
                    </div>
                  </div>

                  <div className="item-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => moveSlide(index, -1)}
                      disabled={index === 0}
                      title="Move up in order"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => moveSlide(index, 1)}
                      disabled={index === slides.length - 1}
                      title="Move down in order"
                    >
                      <MoveDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(index)}
                      title="Edit slide"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSlide(index)}
                      title="Delete slide"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ExternalLink size={14} color="var(--primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>CTA:</span> {slide.ctaText} &rarr; {slide.ctaLink}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Slide Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingIndex !== null ? `Edit Slide #${editingIndex + 1}` : 'Add New Hero Slide'}
        subtitle="Configure headline, cyan highlight, description copy, and call-to-action button."
        icon={Film}
      >
        <form onSubmit={handleSaveModal}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Main Title (White Text)</label>
              <input
                type="text"
                className="form-input"
                value={currentSlideForm.title || ''}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g. High-Precision"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Highlighted Title (Cyan Blue Gradient)</label>
              <input
                type="text"
                className="form-input"
                value={currentSlideForm.titleHighlight || ''}
                onChange={(e) => handleFormChange('titleHighlight', e.target.value)}
                placeholder="e.g. Printing Solution"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={currentSlideForm.subtitle || ''}
              onChange={(e) => handleFormChange('subtitle', e.target.value)}
              placeholder="Engineered for exceptional packaging performance and vibrant color reproduction."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">CTA Button Text</label>
              <input
                type="text"
                className="form-input"
                value={currentSlideForm.ctaText || 'Explore Services'}
                onChange={(e) => handleFormChange('ctaText', e.target.value)}
                placeholder="Explore Services"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Button Link</label>
              <input
                type="text"
                className="form-input"
                value={currentSlideForm.ctaLink || '/products'}
                onChange={(e) => handleFormChange('ctaLink', e.target.value)}
                placeholder="/products"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '20px -24px -24px -24px' }}>
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Add Slide'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
