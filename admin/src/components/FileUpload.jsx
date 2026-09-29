'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Check, AlertCircle, Film, Image as ImageIcon, Copy } from 'lucide-react';
import { uploadFile } from '../lib/api';
import { getMediaUrl } from '../lib/media';
import { useToast } from '../context/ToastContext';

export default function FileUpload({
  onUploadComplete,
  currentUrl = '',
  label = 'Upload Media',
  accept = 'image/*,video/mp4,video/webm',
  showPreviewBar = true
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({ loaded: 0, total: 0 });
  const [preview, setPreview] = useState(currentUrl);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    setPreview(currentUrl || '');
  }, [currentUrl]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStats({ loaded: 0, total: file.size });

    try {
      const res = await uploadFile(file, (percent, loaded, total) => {
        setUploadProgress(percent);
        setUploadStats({ loaded, total });
      });
      if (res.success && res.file) {
        const fullUrl = getMediaUrl(res.file.url);
        setPreview(fullUrl);
        if (onUploadComplete) {
          // Keep relative /uploads/... paths clean so localhost:5000 is never hardcoded in database
          // If it's a Cloudinary URL (https://res.cloudinary.com/...), keep full secure cloud URL
          const saveUrl = res.file.url.startsWith('/') ? res.file.url : (res.file.url.startsWith('http') ? res.file.url : fullUrl);
          onUploadComplete(saveUrl, res.file);
        }
        toast.success(`Uploaded: ${file.name} (${formatFileSize(file.size)})`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isVideo = preview && (preview.endsWith('.mp4') || preview.endsWith('.webm') || preview.includes('/videos/'));

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label className="form-label">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '10px',
          padding: '22px 20px',
          textAlign: 'center',
          cursor: isUploading ? 'default' : 'pointer',
          background: dragOver ? 'var(--primary-light)' : '#f8fafc',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        />

        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
                <span>Uploading to server...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #009fe3, #0077b6)', transition: 'width 0.2s ease' }} />
              </div>
              {uploadStats.total > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px', textAlign: 'right' }}>
                  {formatFileSize(uploadStats.loaded)} / {formatFileSize(uploadStats.total)}
                </div>
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Large video files can take a few moments — please wait</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Upload size={28} color="var(--primary)" />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              Click to select or drag & drop file
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Supports Images & Any Size Video (MP4, WebM, MOV, etc.) — <strong>No file size limit</strong>
            </p>
          </div>
        )}
      </div>

      {showPreviewBar && preview && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isVideo ? (
            <div style={{ width: '48px', height: '48px', background: '#0b1329', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={20} color="#009fe3" />
            </div>
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {preview}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} /> Active URL
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(preview);
              toast.info('URL copied to clipboard');
            }}
          >
            <Copy size={12} /> Copy
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
