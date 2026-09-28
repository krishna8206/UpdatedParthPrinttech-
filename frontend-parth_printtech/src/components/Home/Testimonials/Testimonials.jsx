"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Testimonials.module.css";

const row1Testimonials = [
  {
    id: 1,
    client: "Aisha Sharma",
    role: "Brand Director",
    company: "Aura Cosmetics",
    quote: "The spot UV finishing and gold hot foil stamping on our custom mono cartons are absolutely flawless. Parth Printtech elevated our shelf presence.",
    rating: 5,
    avatarColor: "#ff7a00"
  },
  {
    id: 2,
    client: "Rajesh Patel",
    role: "Operations Head",
    company: "Veda Organics",
    quote: "Finding moisture-resistant labels that survive condensation was a challenge. Their wet glue labels have solved our refrigeration issues completely.",
    rating: 5,
    avatarColor: "#009fe3"
  },
  {
    id: 3,
    client: "Samantha D'Souza",
    role: "Supply Chain Lead",
    company: "NutriFoods India",
    quote: "Excellent barrier properties on the stand-up pouches. The zip locks are robust and oxygen-barrier laminates keep our organic coffee perfectly fresh.",
    rating: 5,
    avatarColor: "#4caf50"
  },
  {
    id: 4,
    client: "Dr. Vikram Mehta",
    role: "QA Director",
    company: "Zenith Pharmaceuticals",
    quote: "Regulatory compliance printing demands absolute precision. Parth's automated advanced gravure printing presses guarantee zero-defect medicine boxes.",
    rating: 5,
    avatarColor: "#00bcd4"
  }
];

const row2Testimonials = [
  {
    id: 5,
    client: "Meera Sen",
    role: "Marketing Manager",
    company: "Urban Retail Group",
    quote: "Their toolless assembly standees are a massive hit in retail stores. Sturdy sunboard structure and vivid direct UV prints that pop under store lights.",
    rating: 5,
    avatarColor: "#e91e63"
  },
  {
    id: 6,
    client: "Kabir Malhotra",
    role: "Plant Manager",
    company: "Apex Lubricants",
    quote: "Industrial grease canisters need labels that resist chemicals and oils. Parth's high-tack drum stickers endure harsh handling and rough weather.",
    rating: 5,
    avatarColor: "#607d8b"
  },
  {
    id: 7,
    client: "Neha Gupta",
    role: "Founder",
    company: "Bloom Botanicals",
    quote: "The custom textured rigid boxes with magnetic closures look stunning. Our luxury gift boxes feel incredibly premium, and customers love them.",
    rating: 5,
    avatarColor: "#9c27b0"
  },
  {
    id: 8,
    client: "Arjun Reddy",
    role: "Logistics Manager",
    company: "Krishi Fertilizers",
    quote: "We ordered high-volume heavy-duty Kraft liner cases. Crushing resistance is top-tier; not a single package collapsed during transit.",
    rating: 5,
    avatarColor: "#ff5722"
  }
];

const Testimonials = ({ data }) => {
  const containerRef = useRef(null);

  const title = data?.title || "What Our Partners";
  const titleHighlight = data?.titleHighlight || "Say";
  const description = data?.description || "Read reviews from leading cosmetic, pharmaceutical, food, and industrial brands that trust our precision printing and custom packaging operations.";

  const allItems = (data?.items && data.items.length > 0)
    ? data.items
    : [...row1Testimonials, ...row2Testimonials];

  const mid = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, mid);
  const row2 = allItems.slice(mid);

  return (
    <section ref={containerRef} className={styles.section}>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {title} <span className={styles.outlinedText}>{titleHighlight}</span>
          </h2>
          <p className={styles.description}>
            {description}
          </p>
        </div>

        {/* Marquees Container */}
        <div className={styles.marqueesWrapper}>
          
          {/* Row 1: Left to Right */}
          <div className={styles.marqueeContainer}>
            <div className={`${styles.marquee} ${styles.marqueeLeft}`}>
              {row1.map((item, idx) => (
                <div key={`${item.id || idx}-r1-a`} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <div className={styles.avatar} style={{ backgroundColor: item.avatarColor || "#009fe3" }}>
                        {item.client ? item.client[0] : "C"}
                      </div>
                      <div>
                        <h4 className={styles.clientName}>{item.client}</h4>
                        <p className={styles.clientMeta}>{item.role}, <span className={styles.companyName}>{item.company}</span></p>
                      </div>
                    </div>
                    <div className={styles.stars}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ff7a00" stroke="#ff7a00" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                  <div className={styles.cmykCorner}>
                    <span className={styles.dotCyan}></span>
                    <span className={styles.dotMagenta}></span>
                    <span className={styles.dotYellow}></span>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles.marquee} ${styles.marqueeLeft}`} aria-hidden="true">
              {row1.map((item, idx) => (
                <div key={`${item.id || idx}-r1-b`} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <div className={styles.avatar} style={{ backgroundColor: item.avatarColor || "#009fe3" }}>
                        {item.client ? item.client[0] : "C"}
                      </div>
                      <div>
                        <h4 className={styles.clientName}>{item.client}</h4>
                        <p className={styles.clientMeta}>{item.role}, <span className={styles.companyName}>{item.company}</span></p>
                      </div>
                    </div>
                    <div className={styles.stars}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ff7a00" stroke="#ff7a00" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                  <div className={styles.cmykCorner}>
                    <span className={styles.dotCyan}></span>
                    <span className={styles.dotMagenta}></span>
                    <span className={styles.dotYellow}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          {row2.length > 0 && (
            <div className={styles.marqueeContainer}>
              <div className={`${styles.marquee} ${styles.marqueeRight}`}>
                {row2.map((item, idx) => (
                  <div key={`${item.id || idx}-r2-a`} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.avatar} style={{ backgroundColor: item.avatarColor || "#009fe3" }}>
                          {item.client ? item.client[0] : "C"}
                        </div>
                        <div>
                          <h4 className={styles.clientName}>{item.client}</h4>
                          <p className={styles.clientMeta}>{item.role}, <span className={styles.companyName}>{item.company}</span></p>
                        </div>
                      </div>
                      <div className={styles.stars}>
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ff7a00" stroke="#ff7a00" strokeWidth="1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                    <div className={styles.cmykCorner}>
                      <span className={styles.dotCyan}></span>
                      <span className={styles.dotMagenta}></span>
                      <span className={styles.dotYellow}></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${styles.marquee} ${styles.marqueeRight}`} aria-hidden="true">
                {row2.map((item, idx) => (
                  <div key={`${item.id || idx}-r2-b`} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <div className={styles.avatar} style={{ backgroundColor: item.avatarColor || "#009fe3" }}>
                          {item.client ? item.client[0] : "C"}
                        </div>
                        <div>
                          <h4 className={styles.clientName}>{item.client}</h4>
                          <p className={styles.clientMeta}>{item.role}, <span className={styles.companyName}>{item.company}</span></p>
                        </div>
                      </div>
                      <div className={styles.stars}>
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ff7a00" stroke="#ff7a00" strokeWidth="1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                    <div className={styles.cmykCorner}>
                      <span className={styles.dotCyan}></span>
                      <span className={styles.dotMagenta}></span>
                      <span className={styles.dotYellow}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
