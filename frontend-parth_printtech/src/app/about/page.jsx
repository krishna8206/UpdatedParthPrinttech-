"use client";

import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import AboutHero from '@/components/About/AboutHero';
import AboutFounders from '@/components/About/AboutFounders';
import AboutVisionMission from '@/components/About/AboutVisionMission';
import AboutHistory from '@/components/About/AboutHistory';
import Footer from '@/components/Footer/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <AboutHero />
        <AboutFounders />
        <AboutVisionMission />
        <AboutHistory />
      </main>
      <Footer />
    </>
  );
}

