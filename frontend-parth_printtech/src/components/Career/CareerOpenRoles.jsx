"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CareerOpenRoles.module.css";

gsap.registerPlugin(ScrollTrigger);

const defaultRoles = [
  {
    id: "1",
    title: "Senior Print Production Technician",
    dept: "Production",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "4–7 yrs",
    isNew: true,
  },
  {
    id: "2",
    title: "Packaging Design Engineer",
    dept: "Design",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "2–5 yrs",
    isNew: false,
  },
  {
    id: "3",
    title: "Quality Control & Inspection Lead",
    dept: "QC",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "3–6 yrs",
    isNew: true,
  },
  {
    id: "4",
    title: "Sales Executive – Print & Packaging",
    dept: "Sales",
    location: "Gujarat / Remote",
    type: "Full-time",
    experience: "2–4 yrs",
    isNew: false,
  },
  {
    id: "5",
    title: "Gravure Press Operator",
    dept: "Production",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "3–8 yrs",
    isNew: false,
  },
  {
    id: "6",
    title: "Graphic Design Specialist (Pre-press)",
    dept: "Design",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "1–3 yrs",
    isNew: true,
  },
  {
    id: "7",
    title: "Supply Chain & Procurement Manager",
    dept: "Operations",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "5–9 yrs",
    isNew: false,
  },
  {
    id: "8",
    title: "HR & Talent Acquisition Executive",
    dept: "HR",
    location: "Gujarat, India",
    type: "Full-time",
    experience: "1–3 yrs",
    isNew: true,
  },
  {
    id: "9",
    title: "Junior Sales Intern – B2B",
    dept: "Sales",
    location: "Remote",
    type: "Internship",
    experience: "0–1 yr",
    isNew: true,
  },
];

const CareerOpenRoles = ({ rolesData, onSelectRole }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useRef(null);

  const roles = rolesData && Array.isArray(rolesData) && rolesData.length > 0 ? rolesData : defaultRoles;

  // Extract distinct departments
  const availableDepts = ["All", ...Array.from(new Set(roles.map((r) => r.dept).filter(Boolean)))];

  const filteredRoles =
    activeFilter === "All"
      ? roles
      : roles.filter((r) => r.dept === activeFilter);

  const getCount = (dept) =>
    dept === "All" ? roles.length : roles.filter((r) => r.dept === dept).length;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".roles-header",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".roles-header", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="open-roles">
      <div className={styles.blueprintOverlay}></div>
      <div className={styles.container}>
        <div className={`${styles.header} roles-header`}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              Open <span className={styles.accentText}>Roles</span>
            </h2>
            <span className={styles.roleCount}>
              <span className={styles.roleCountNum}>{filteredRoles.length}</span> position{filteredRoles.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterRow}>
          {availableDepts.map((dept) => (
            <button
              key={dept}
              className={`${styles.filterBtn} ${activeFilter === dept ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveFilter(dept)}
              id={`career-filter-${dept.toLowerCase()}`}
            >
              {dept}
              <span className={styles.filterCount}>{getCount(dept)}</span>
            </button>
          ))}
        </div>

        {/* Roles List */}
        <div className={styles.rolesList}>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <div key={role.id} className={styles.roleCard} id={`role-card-${role.id}`}>
                <div className={styles.roleLeft}>
                  <div className={styles.roleIconBox}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div className={styles.roleInfo}>
                    <span className={styles.roleTitle}>{role.title}</span>
                    <div className={styles.roleMeta}>
                      <span className={styles.roleMetaItem}>
                        <svg className={styles.metaIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {role.location || "Gujarat, India"}
                      </span>
                      <span className={styles.roleMetaItem}>
                        <svg className={styles.metaIcon} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {role.experience || "1–3 yrs"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.tagList}>
                  <span className={styles.tag + " " + styles.tagDept}>{role.dept}</span>
                  <span className={styles.tag + " " + styles.tagType}>{role.type || "Full-time"}</span>
                  {role.isNew && <span className={styles.tag + " " + styles.tagNew}>New</span>}
                </div>

                <a
                  href="#career-apply"
                  className={styles.applyBtn}
                  id={`apply-btn-${role.id}`}
                  onClick={() => onSelectRole && onSelectRole(role.title)}
                >
                  Apply Now
                  <svg className={styles.applyBtnIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>No roles found in this category currently. Check back soon.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CareerOpenRoles;
