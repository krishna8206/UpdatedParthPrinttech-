'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Package,
  Info,
  Globe,
  Briefcase,
  PhoneCall,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  const homeSubTabs = ['hero', 'whoweare', 'markets', 'products', 'clients', 'testimonials', 'values'];
  const isHomeActive = homeSubTabs.includes(activeTab) || activeTab === 'home';

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className={`admin-sidebar ${isMobileOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/world_map_blueprint.png"
            alt="Parth Printtech Logo"
            style={{
              height: '36px',
              width: 'auto',
              maxWidth: '190px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <span className="brand-subtitle" style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
            Admin CMS Console
          </span>
        </div>

        {/* Mobile Close Button (Visible on screens < 992px) */}
        {onCloseMobile && (
          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={onCloseMobile}
            aria-label="Close sidebar menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Overview</div>

        {/* Overview Dashboard */}
        <div
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
          style={{ cursor: 'pointer', marginBottom: '10px' }}
        >
          <LayoutDashboard size={18} />
          <span style={{ flex: 1 }}>Dashboard</span>
        </div>

        <div className="nav-section-title">Sections Manager</div>

        {/* Home Page Manager (Active) */}
        <div
          className={`nav-item ${isHomeActive ? 'active' : ''}`}
          onClick={() => handleNavClick('hero')}
          style={{ cursor: 'pointer' }}
        >
          <Home size={18} />
          <span style={{ flex: 1 }}>Home Page</span>
          <span
            style={{
              fontSize: '10px',
              background: isHomeActive ? '#ffffff' : '#e0f4fc',
              color: isHomeActive ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>

        {/* Products Page Manager (Active) */}
        <div
          className={`nav-item ${activeTab === 'products-page' ? 'active' : ''}`}
          onClick={() => handleNavClick('products-page')}
          style={{ cursor: 'pointer', marginTop: '4px' }}
        >
          <Package size={18} />
          <span style={{ flex: 1 }}>Products Page</span>
          <span
            style={{
              fontSize: '10px',
              background: activeTab === 'products-page' ? '#ffffff' : '#e0f4fc',
              color: activeTab === 'products-page' ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>

        {/* About Us Page Manager (Active) */}
        <div
          className={`nav-item ${activeTab === 'about-page' ? 'active' : ''}`}
          onClick={() => handleNavClick('about-page')}
          style={{ cursor: 'pointer', marginTop: '4px' }}
        >
          <Info size={18} />
          <span style={{ flex: 1 }}>About Us</span>
          <span
            style={{
              fontSize: '10px',
              background: activeTab === 'about-page' ? '#ffffff' : '#e0f4fc',
              color: activeTab === 'about-page' ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>

        {/* Markets We Serve Page Manager (Active) */}
        <div
          className={`nav-item ${activeTab === 'markets-page' ? 'active' : ''}`}
          onClick={() => handleNavClick('markets-page')}
          style={{ cursor: 'pointer', marginTop: '4px' }}
        >
          <Globe size={18} />
          <span style={{ flex: 1 }}>Markets We Serve</span>
          <span
            style={{
              fontSize: '10px',
              background: activeTab === 'markets-page' ? '#ffffff' : '#e0f4fc',
              color: activeTab === 'markets-page' ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>

        {/* Careers Page Manager (Active) */}
        <div
          className={`nav-item ${activeTab === 'careers-page' ? 'active' : ''}`}
          onClick={() => handleNavClick('careers-page')}
          style={{ cursor: 'pointer', marginTop: '4px' }}
        >
          <Briefcase size={18} />
          <span style={{ flex: 1 }}>Careers & ATS</span>
          <span
            style={{
              fontSize: '10px',
              background: activeTab === 'careers-page' ? '#ffffff' : '#e0f4fc',
              color: activeTab === 'careers-page' ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>

        {/* Contact Page & Inquiries Manager (Active) */}
        <div
          className={`nav-item ${activeTab === 'contact-page' ? 'active' : ''}`}
          onClick={() => handleNavClick('contact-page')}
          style={{ cursor: 'pointer', marginTop: '4px' }}
        >
          <PhoneCall size={18} />
          <span style={{ flex: 1 }}>Contact & Leads</span>
          <span
            style={{
              fontSize: '10px',
              background: activeTab === 'contact-page' ? '#ffffff' : '#e0f4fc',
              color: activeTab === 'contact-page' ? 'var(--primary)' : '#009fe3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            Live
          </span>
        </div>
      </nav>

      {/* Footer / User info */}
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{user?.name ? user.name[0] : 'A'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Super Admin'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{user?.username || 'admin'}</div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
