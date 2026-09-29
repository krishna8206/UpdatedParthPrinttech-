'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { api, FRONTEND_URL } from '../lib/api';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HeroSliderTab from '../components/home/HeroSliderTab';
import WhoWeAreTab from '../components/home/WhoWeAreTab';
import MarketsTab from '../components/home/MarketsTab';
import ProductsTab from '../components/home/ProductsTab';
import ClientsTab from '../components/home/ClientsTab';
import TestimonialsTab from '../components/home/TestimonialsTab';
import ValuesTab from '../components/home/ValuesTab';
import ProductsCatalogManager from '../components/products/ProductsCatalogManager';
import AboutManager from '../components/about/AboutManager';
import MarketsPageManager from '../components/markets/MarketsPageManager';
import CareerManager from '../components/career/CareerManager';
import ContactManager from '../components/contact/ContactManager';
import OverviewDashboard from '../components/dashboard/OverviewDashboard';
import {
  Sliders,
  Info,
  Globe,
  Package,
  Users,
  MessageSquare,
  Award,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const VALID_TABS = ['dashboard', 'hero', 'whoweare', 'markets', 'products', 'clients', 'testimonials', 'values', 'products-page', 'about-page', 'markets-page', 'careers-page', 'contact-page'];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore active tab from URL or localStorage on initial page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab') || window.location.hash.replace('#', '');
        const savedTab = localStorage.getItem('parth_admin_active_tab');

        if (tabParam && VALID_TABS.includes(tabParam)) {
          setActiveTab(tabParam);
        } else if (savedTab && VALID_TABS.includes(savedTab)) {
          setActiveTab(savedTab);
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('parth_admin_active_tab', tabId);
        window.history.replaceState(null, '', `?tab=${tabId}`);
      } catch (e) {
        // Ignore
      }
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getHomeData();
      if (res.success && res.data) {
        setHomeData(res.data);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Failed to fetch data from backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (authLoading || (!user && !error)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #cbd5e1', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  const tabsConfig = [
    { id: 'hero', label: 'Hero Video Slider', icon: Sliders, count: homeData?.heroSlides?.length },
    { id: 'whoweare', label: 'Who We Are', icon: Info },
    { id: 'markets', label: 'Markets We Serve', icon: Globe, count: homeData?.markets?.items?.length },
    { id: 'products', label: 'Featured Products', icon: Package, count: homeData?.featuredProducts?.items?.length },
    { id: 'clients', label: 'Clients & Brands', icon: Users, count: homeData?.clients?.items?.length },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, count: homeData?.testimonials?.items?.length },
    { id: 'values', label: 'Our Values', icon: Award, count: homeData?.values?.items?.length },
  ];

  const currentHeaderTitle =
    activeTab === 'dashboard'
      ? 'Executive Overview Dashboard'
      : activeTab === 'contact-page'
      ? 'Contact Page CMS & Customer Inquiries'
      : activeTab === 'careers-page'
      ? 'Careers & Talent Acquisition CMS'
      : activeTab === 'markets-page'
      ? 'Markets & Applications Blueprint Manager'
      : activeTab === 'about-page'
      ? 'About Us Content & Architecture Manager'
      : activeTab === 'products-page'
      ? 'Products Catalog & Spec Sheet Manager'
      : 'Home Page Sections Manager';

  return (
    <div className="admin-container">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="admin-main">
        <Header
          currentTitle={currentHeaderTitle}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <div className="admin-content">
          {activeTab === 'dashboard' ? (
            /* Executive Overview Dashboard */
            <OverviewDashboard onNavigate={handleTabChange} />
          ) : activeTab === 'contact-page' ? (
            /* Dedicated Contact & Inquiries Manager */
            <ContactManager />
          ) : activeTab === 'careers-page' ? (
            /* Dedicated Careers & ATS Manager */
            <CareerManager />
          ) : activeTab === 'markets-page' ? (
            /* Dedicated Standalone Markets We Serve Page Manager */
            <MarketsPageManager />
          ) : activeTab === 'about-page' ? (
            /* Dedicated About Us Page Manager */
            <AboutManager />
          ) : activeTab === 'products-page' ? (
            /* Dedicated Products Page Manager */
            <ProductsCatalogManager />
          ) : (
            /* Home Page Sections Manager */
            <div>
              {/* Actions & Sub-tabs bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div className="tabs-header" style={{ marginBottom: 0, flex: '1 1 auto' }}>
                  {tabsConfig.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={fetchData}
                    className="btn btn-secondary btn-sm"
                    title="Refresh data from server"
                  >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Data
                  </button>
                  <a
                    href={FRONTEND_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <ExternalLink size={14} /> View Live Site
                  </a>
                </div>
              </div>

              {/* Active Tab View */}
              {error ? (
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '32px',
                    textAlign: 'center',
                    margin: '20px 0',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '20px',
                      fontWeight: 800,
                    }}
                  >
                    !
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
                    Backend Server Offline
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '500px', margin: '0 auto 20px' }}>
                    {error}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button onClick={fetchData} className="btn btn-primary">
                      <RefreshCw size={14} /> Retry Connection
                    </button>
                  </div>
                </div>
              ) : isLoading && !homeData ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid #cbd5e1',
                      borderTopColor: 'var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 12px',
                    }}
                  />
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading section data...</p>
                </div>
              ) : (
                <div>
                  {activeTab === 'hero' && (
                    <HeroSliderTab
                      initialSlides={homeData?.heroSlides || []}
                      initialHeroVideo={homeData?.heroVideo || ''}
                      onRefresh={fetchData}
                    />
                  )}

                  {activeTab === 'whoweare' && (
                    <WhoWeAreTab initialData={homeData?.whoWeAre || {}} onRefresh={fetchData} />
                  )}

                  {activeTab === 'markets' && (
                    <MarketsTab initialData={homeData?.markets || {}} onRefresh={fetchData} />
                  )}

                  {activeTab === 'products' && (
                    <ProductsTab initialData={homeData?.featuredProducts || {}} onRefresh={fetchData} />
                  )}

                  {activeTab === 'clients' && (
                    <ClientsTab initialData={homeData?.clients || {}} onRefresh={fetchData} />
                  )}

                  {activeTab === 'testimonials' && (
                    <TestimonialsTab initialData={homeData?.testimonials || {}} onRefresh={fetchData} />
                  )}

                  {activeTab === 'values' && (
                    <ValuesTab initialData={homeData?.values || {}} onRefresh={fetchData} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
