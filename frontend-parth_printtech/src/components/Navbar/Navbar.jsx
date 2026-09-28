"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className={`${styles.navbarWrapper} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navbarInner}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logoLink} onClick={closeMenu}>
                        <Image
                            src="/logo/world_map_blueprint.png"
                            alt="Parth Printtech Logo"
                            className={styles.logoImageRaw}
                            width={240}
                            height={48}
                            priority
                        />
                    </Link>
                </div>

                <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksActive : ''}`}>
                    <li>
                        <Link href="/" className={styles.navLink} onClick={closeMenu}>
                            Home
                        </Link>
                    </li>
                  
                    <li>
                        <Link href="/products" className={styles.navLink} onClick={closeMenu}>
                            Product
                        </Link>
                    </li>
                      <li>
                        <Link href="/about" className={styles.navLink} onClick={closeMenu}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/markets-we-serve" className={styles.navLink} onClick={closeMenu}>
                            Markets We Serve
                        </Link>
                    </li>
                    <li>
                        <Link href="/career" className={styles.navLink} onClick={closeMenu}>
                            Career
                        </Link>
                    </li>
                    <li className={styles.mobileOnly}>
                        <Link href="/contact" className={styles.mobileContactBtn} onClick={closeMenu}>
                            Talk to Us
                        </Link>
                    </li>
                </ul>

                <div className={styles.buttonContainer}>
                    <Link href="/contact" className={styles.contactBtn}>
                        <span className={styles.btnText}>Talk to Us</span>
                        <div className={styles.btnIcon}>
                            <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Hamburger Toggle */}
                <button
                    className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;