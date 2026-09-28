"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CareerProcess.module.css";

gsap.registerPlugin(ScrollTrigger);

const defaultSteps = [
  {
    num: "01",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Submit Application",
    desc: "Fill out our online form with your resume and a brief cover message. We accept rolling applications year-round.",
    tag: "Step 01",
  },
  {
    num: "02",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Initial Screening",
    desc: "Our HR team reviews every application carefully. Shortlisted candidates receive an email within 3–5 business days.",
    tag: "Step 02",
  },
  {
    num: "03",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Interview Rounds",
    desc: "A structured 1–2 round interview process — technical, culture-fit, and a practical assignment for senior roles.",
    tag: "Step 03",
  },
  {
    num: "04",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: "Offer & Onboarding",
    desc: "Selected candidates receive a competitive offer. Our onboarding program ensures you're set up for success from day one.",
    tag: "Step 04",
  },
];

const getStepIcon = (index) => {
  return defaultSteps[index % defaultSteps.length].icon;
};

const CareerProcess = ({ processData = {} }) => {
  const sectionRef = useRef(null);

  const title = processData?.title || "Our Hiring";
  const titleHighlight = processData?.titleHighlight || "Process";
  const description = processData?.description || "A straightforward, transparent process designed to find the best mutual fit — for you and for us.";
  const steps = processData?.steps && processData.steps.length > 0 ? processData.steps : defaultSteps;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-header",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".process-header", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".process-step",
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".process-step", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.blueprintOverlay}></div>
      <div className={styles.container}>
        <div className={`${styles.header} process-header`}>
          <h2 className={styles.title}>
            {title} <span className={styles.accentText}>{titleHighlight}</span>
          </h2>
          <p className={styles.description}>
            {description}
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div key={step.id || i} className={`${styles.step} process-step`} id={`process-step-${i + 1}`}>
              <span className={styles.stepNumber}>{step.num || `0${i + 1}`}</span>
              <div className={styles.stepIconCircle}>{step.icon || getStepIcon(i)}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              <span className={styles.stepTag}>{step.tag || `Step 0${i + 1}`}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerProcess;
