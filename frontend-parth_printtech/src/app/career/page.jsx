"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import CareerHero from '@/components/Career/CareerHero';
import CareerCulture from '@/components/Career/CareerCulture';
import CareerProcess from '@/components/Career/CareerProcess';
import CareerOpenRoles from '@/components/Career/CareerOpenRoles';
import CareerApply from '@/components/Career/CareerApply';
import Footer from '@/components/Footer/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const [careerData, setCareerData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/career`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCareerData(json.data);
          }
        }
      } catch (err) {
        // Use default fallbacks inside components
      }
    }
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <CareerHero
          heroData={careerData?.hero}
          activeRolesCount={careerData?.roles?.length || 12}
        />
        <CareerCulture
          cultureData={careerData?.culture}
        />
        <CareerProcess
          processData={careerData?.process}
        />
        <CareerOpenRoles
          rolesData={careerData?.roles}
          onSelectRole={setSelectedRole}
        />
        <CareerApply
          contactData={careerData?.contact}
          rolesList={careerData?.roles}
          selectedRole={selectedRole}
          onChangeRole={setSelectedRole}
        />
      </main>
      <Footer />
    </>
  );
}


