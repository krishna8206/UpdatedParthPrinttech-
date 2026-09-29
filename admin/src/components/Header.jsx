'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Radio, RefreshCw, Menu } from 'lucide-react';

export default function Header({ currentTitle = 'Home Page Management', onToggleMobileMenu }) {
  const [apiStatus, setApiStatus] = useState('checking');

  const checkHealth = async () => {
    try {
      setApiStatus('checking');
      const res = await api.checkHealth();
      if (res.status === 'ok') {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ minWidth: 0 }}>
          <h1 className="admin-topbar-title">
            {currentTitle}
          </h1>
          <p className="admin-topbar-subtitle">
            Parth Printtech LLP — Content Management System
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Backend API Connection Indicator */}
        <div
          className="api-status-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: apiStatus === 'online' ? '#dcfce7' : apiStatus === 'offline' ? '#fee2e2' : '#f1f5f9',
            border: `1px solid ${apiStatus === 'online' ? '#86efac' : apiStatus === 'offline' ? '#fca5a5' : '#cbd5e1'}`,
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: apiStatus === 'online' ? '#15803d' : apiStatus === 'offline' ? '#b91c1c' : '#475569',
          }}
          title="Backend REST API Status (Live API)"
        >
          <Radio size={13} className={apiStatus === 'checking' ? 'animate-spin' : ''} />
          <span className="api-status-text">
            {apiStatus === 'online' ? 'Connected (Live API)' : apiStatus === 'offline' ? 'Offline' : 'Checking...'}
          </span>
          <span className="api-status-compact">
            {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : '...'}
          </span>
        </div>

        <button
          onClick={checkHealth}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 8px' }}
          title="Refresh connection status"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    </header>
  );
}
