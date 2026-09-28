'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Package,
  Globe,
  Info,
  PhoneCall,
  Sparkles,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Clock,
  Mail,
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function OverviewDashboard({ onNavigate }) {
  const { user } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    productsCount: 0,
    rolesCount: 0,
    activeRolesCount: 0,
    applicationsCount: 0,
    newApplicationsCount: 0,
    inquiriesCount: 0,
    newInquiriesCount: 0,
    marketsCount: 0,
    slidesCount: 0,
    recentApplications: [],
    recentInquiries: []
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parallel fetch across modules
      const [homeRes, productsRes, careerRes, contactRes, marketsRes] = await Promise.allSettled([
        api.getHomeData(),
        api.getProducts(),
        api.getCareerAdminData(),
        api.getContactAdminData(),
        api.getMarketsPageData()
      ]);

      const homeData = homeRes.status === 'fulfilled' && homeRes.value?.success ? homeRes.value.data : null;
      const productsData = productsRes.status === 'fulfilled' && productsRes.value?.success ? productsRes.value.data : null;
      const careerData = careerRes.status === 'fulfilled' && careerRes.value?.success ? careerRes.value.data : null;
      const contactData = contactRes.status === 'fulfilled' && contactRes.value?.success ? contactRes.value.data : null;
      const marketsData = marketsRes.status === 'fulfilled' && marketsRes.value?.success ? marketsRes.value.data : null;

      // Extract metrics
      const productsCount = Array.isArray(productsData?.products)
        ? productsData.products.length
        : Array.isArray(productsData)
        ? productsData.length
        : (homeData?.featuredProducts?.items || []).length || 6;
      const roles = careerData?.roles || [];
      const rolesCount = roles.length || 9;
      const activeRolesCount = roles.filter(r => r.isActive !== false).length || rolesCount;
      const applications = careerData?.applications || [];
      const applicationsCount = applications.length;
      const newApplicationsCount = applications.filter(a => a.status === 'New').length;

      const inquiries = contactData?.inquiries || [];
      const inquiriesCount = inquiries.length;
      const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

      const marketsCount = (marketsData?.markets || []).length || (homeData?.markets?.items || []).length || 9;
      const slidesCount = (homeData?.heroSlides || []).length || 6;

      setMetrics({
        productsCount,
        rolesCount,
        activeRolesCount,
        applicationsCount,
        newApplicationsCount,
        inquiriesCount,
        newInquiriesCount,
        marketsCount,
        slidesCount,
        recentApplications: applications.slice(0, 4),
        recentInquiries: inquiries.slice(0, 4)
      });
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const currentDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return { bg: '#e0f2fe', color: '#0284c7' };
      case 'In Progress': return { bg: '#fef3c7', color: '#d97706' };
      case 'Shortlisted':
      case 'Contacted': return { bg: '#f3e8ff', color: '#9333ea' };
      case 'Hired':
      case 'Resolved': return { bg: '#dcfce7', color: '#16a34a' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #cbd5e1',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Loading Executive Dashboard...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Gathering real-time CMS metrics and recent activity across all sections.</p>
      </div>
    );
  }

  return (
    <div>
      {/* 1. Executive Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1e36 0%, #009fe3 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 12px 30px -8px rgba(0, 159, 227, 0.35)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
              }}
            >
              Enterprise CMS Console
            </span>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>• {currentDateStr}</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Welcome back, {user?.name || 'Super Admin'} 👋
          </h1>
          <p style={{ fontSize: '13.5px', opacity: 0.9, marginTop: '6px', maxWidth: '650px', lineHeight: 1.5 }}>
            Here is your live high-level overview of customer inquiries, ATS candidate submissions, product catalogs, and website content status.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchDashboardData}
            className="btn btn-secondary"
            style={{ background: '#ffffff', color: 'var(--text-main)', fontWeight: 700, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <RefreshCw size={15} /> Refresh Overview
          </button>
        </div>
      </div>

      {/* 2. Key Metrics KPI Grid (6 Top Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Metric 1: Customer Inquiries */}
        <div
          className="card"
          onClick={() => onNavigate('contact-page')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #009fe3',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f4fc', color: '#009fe3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} />
            </div>
            {metrics.newInquiriesCount > 0 && (
              <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {metrics.newInquiriesCount} New
              </span>
            )}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.inquiriesCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Customer Leads / Inquiries</div>
        </div>

        {/* Metric 2: Candidate Applications */}
        <div
          className="card"
          onClick={() => onNavigate('careers-page')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #9333ea',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            {metrics.newApplicationsCount > 0 && (
              <span style={{ fontSize: '11px', background: '#f3e8ff', color: '#9333ea', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {metrics.newApplicationsCount} New
              </span>
            )}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.applicationsCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>ATS Applicants Received</div>
        </div>

        {/* Metric 3: Active Job Postings */}
        <div
          className="card"
          onClick={() => onNavigate('careers-page')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #16a34a',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} />
            </div>
            <span style={{ fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Hiring Live
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.activeRolesCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Active Open Positions</div>
        </div>

        {/* Metric 4: Products Catalog */}
        <div
          className="card"
          onClick={() => onNavigate('products-page')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #e11d48',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Catalog
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.productsCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Engineered Products</div>
        </div>

        {/* Metric 5: Markets Blueprints */}
        <div
          className="card"
          onClick={() => onNavigate('markets-page')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #0284c7',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} />
            </div>
            <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Sectors
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.marketsCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Industry Markets Served</div>
        </div>

        {/* Metric 6: Home Hero Slides */}
        <div
          className="card"
          onClick={() => onNavigate('hero')}
          style={{
            padding: '20px',
            cursor: 'pointer',
            borderTop: '4px solid #d97706',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              Video Slides
            </span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>{metrics.slidesCount}</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>Home Hero Slides</div>
        </div>
      </div>

      {/* 3. Section Manager Quick Jump Hub (6 Cards Grid) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Website Modules & Section Managers
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Direct access to calibrate all published pages and dynamic content.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Card 1: Home Page */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#e0f4fc', color: '#009fe3', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 01
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Home Page Manager
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Hero video carousel, Who We Are story, featured products preview, client brand logos, and testimonials.
              </p>
            </div>
            <button
              onClick={() => onNavigate('hero')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>Manage Home Content</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: Products Page */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#ffe4e6', color: '#e11d48', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 02
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Products Catalog Manager
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Full catalog of PVC shrink sleeves, BOPP wrap labels, PETG films, category filters, and detailed technical specifications.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products-page')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>Manage Products ({metrics.productsCount})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: About Us */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#e0f2fe', color: '#0284c7', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 03
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                About Us Page Manager
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Corporate story, precision vision & mission statements, leadership profiles, timeline milestones, and certifications.
              </p>
            </div>
            <button
              onClick={() => onNavigate('about-page')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>Manage About Us</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 4: Markets We Serve */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 04
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Markets & Sectors Manager
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Sector blueprints for Beverages, Pharma, Dairy, Lubricants, Paints, Cosmetics, and agricultural packaging.
              </p>
            </div>
            <button
              onClick={() => onNavigate('markets-page')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>Manage Markets ({metrics.marketsCount})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 5: Careers & ATS */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#f3e8ff', color: '#9333ea', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 05
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Careers & Candidate ATS
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Hero 3-card mockup, culture pillars, hiring roadmap, open job listings, and real-time candidate pipeline tracker.
              </p>
            </div>
            <button
              onClick={() => onNavigate('careers-page')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>Open Careers & ATS ({metrics.rolesCount} Roles)</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 6: Contact & Leads */}
          <div
            className="card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#e0f4fc', color: '#009fe3', padding: '3px 8px', borderRadius: '4px' }}>
                  PAGE 06
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>● Live</span>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Contact & Inquiries CRM
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Direct contact methods, response time card, factory address, interactive map coordinates, and customer lead inbox.
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact-page')}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px', justifyContent: 'space-between', width: '100%', fontWeight: 700 }}
            >
              <span>View Leads ({metrics.inquiriesCount})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Feeds (Split 2-Column Section) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
        {/* Left Column: Recent Customer Inquiries */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="card-title">
                <MessageSquare size={18} color="var(--primary)" /> Recent Customer Inquiries
              </h3>
              <p className="card-subtitle">Latest messages submitted via the Contact Us form.</p>
            </div>
            <button
              onClick={() => onNavigate('contact-page')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', fontWeight: 700 }}
            >
              View All ({metrics.inquiriesCount})
            </button>
          </div>

          {metrics.recentInquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No inquiries received yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.recentInquiries.map((inq, idx) => {
                const badge = getStatusBadge(inq.status);
                return (
                  <div
                    key={inq.id || idx}
                    onClick={() => onNavigate('contact-page')}
                    style={{
                      background: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{inq.fullName}</span>
                        <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '10px', background: badge.bg, color: badge.color, fontWeight: 700 }}>
                          {inq.status || 'New'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inq.subject} • {inq.email}
                      </div>
                    </div>

                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent ATS Candidate Submissions */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 className="card-title">
                <Users size={18} color="#9333ea" /> Recent Job Applications
              </h3>
              <p className="card-subtitle">Latest candidates applying for open manufacturing roles.</p>
            </div>
            <button
              onClick={() => onNavigate('careers-page')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', fontWeight: 700 }}
            >
              View All ({metrics.applicationsCount})
            </button>
          </div>

          {metrics.recentApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No applications submitted yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.recentApplications.map((app, idx) => {
                const badge = getStatusBadge(app.status);
                return (
                  <div
                    key={app.id || idx}
                    onClick={() => onNavigate('careers-page')}
                    style={{
                      background: '#f8fafc',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{app.fullName}</span>
                        <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '10px', background: badge.bg, color: badge.color, fontWeight: 700 }}>
                          {app.status || 'New'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.role} • {app.experience || 'Experienced'}
                      </div>
                    </div>

                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
