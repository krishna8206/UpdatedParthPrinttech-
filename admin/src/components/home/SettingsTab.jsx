'use client';

import React, { useState, useEffect } from 'react';
import { Save, Settings, Lock } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function SettingsTab({ initialSettings = {}, onRefresh }) {
  const [formData, setFormData] = useState({
    siteName: initialSettings.siteName || 'Parth Printtech LLP',
    tagline: initialSettings.tagline || 'Premium Label & Shrink Film Solutions',
    contactEmail: initialSettings.contactEmail || 'info@parthprinttech.com',
    contactPhone: initialSettings.contactPhone || '+91 98765 43210',
    address: initialSettings.address || '',
    socialLinks: initialSettings.socialLinks || {
      linkedin: '',
      instagram: '',
      facebook: '',
      whatsapp: ''
    }
  });

  // Sync state when parent data refreshes
  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setFormData({
        siteName: initialSettings.siteName || 'Parth Printtech LLP',
        tagline: initialSettings.tagline || 'Premium Label & Shrink Film Solutions',
        contactEmail: initialSettings.contactEmail || 'info@parthprinttech.com',
        contactPhone: initialSettings.contactPhone || '+91 98765 43210',
        address: initialSettings.address || '',
        socialLinks: initialSettings.socialLinks || {
          linkedin: '',
          instagram: '',
          facebook: '',
          whatsapp: ''
        }
      });
    }
  }, [initialSettings]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const toast = useToast();

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.updateSettings(formData);
      toast.success('Site settings updated successfully!');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPass(true);
    try {
      await api.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Admin password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Settings size={20} color="var(--primary)" /> Global Site Settings & Contact Details
            </h2>
            <p className="card-subtitle">
              Manage website metadata, contact phone, email, physical address, and social media handles.
            </p>
          </div>
          <button onClick={handleSaveSettings} className="btn btn-primary" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company / Website Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.siteName}
              onChange={(e) => handleFieldChange('siteName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input
              type="text"
              className="form-input"
              value={formData.tagline}
              onChange={(e) => handleFieldChange('tagline', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Official Contact Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.contactEmail}
              onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Contact Phone</label>
            <input
              type="text"
              className="form-input"
              value={formData.contactPhone}
              onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Physical Office / Factory Address</label>
          <textarea
            rows={2}
            className="form-textarea"
            value={formData.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
          />
        </div>

        {/* Social Links */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Social Profiles</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number / Link</label>
              <input
                type="text"
                className="form-input"
                value={formData.socialLinks?.whatsapp || ''}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Lock size={20} color="var(--primary)" /> Change Admin Password
            </h2>
            <p className="card-subtitle">
              Update credentials for your administrator account (Default: admin / admin123).
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isChangingPass}>
            <Lock size={14} /> {isChangingPass ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
