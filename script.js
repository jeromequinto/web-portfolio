document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. THEME TOGGLE (LIGHT/DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    /* ==========================================================================
       2. MOBILE NAVIGATION MENU (hamburger + slide-in panel + scroll lock)
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const navItems = document.querySelectorAll('.nav-links a');

    function openMobileNav() {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileNav() {
        if (navLinks.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    hamburger.addEventListener('click', toggleMobileNav);
    // Keyboard accessibility since the hamburger is a div with role="button"
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileNav();
        }
    });

    navOverlay.addEventListener('click', closeMobileNav);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });

    navItems.forEach(item => {
        item.addEventListener('click', closeMobileNav);
    });

    // Close the mobile menu automatically if the viewport grows back to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) closeMobileNav();
    });

    /* ==========================================================================
       3. FEATURED PROJECTS (Swiper Config & Background Sync)
       ========================================================================== */
    const swiper = new Swiper('.swiper', {
        direction: "horizontal",
        loop: true, // Now works flawlessly because HTML slides were duplicated
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: -30,

        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: -10 },
            768: { slidesPerView: 1.8, spaceBetween: -10 },
            1024: { slidesPerView: 3, spaceBetween: -30 }
        }
    });

    function updateMainBackground() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        const mainContainer = document.querySelector('.main-slides');

        if (activeSlide && mainContainer) {
            const bgImage = activeSlide.style.background;
            if (bgImage) {
                mainContainer.style.background = bgImage;
                mainContainer.style.backgroundSize = 'cover';
                mainContainer.style.backgroundPosition = 'center';
            }
        }
    }

    swiper.on('slideNextTransitionStart', updateMainBackground);
    swiper.on('slidePrevTransitionStart', updateMainBackground);
    updateMainBackground();

    /* ==========================================================================
       4. NAVBAR SCROLL EFFECT
       ========================================================================== */
    const header = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
    }, { passive: true });

    /* ==========================================================================
       5. SCROLL REVEAL ANIMATIONS (For Mobile and Desktop)
       ========================================================================== */
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => scrollObserver.observe(el));

    /* ==========================================================================
       6. VIEW ALL PROJECTS — SMOOTH EXPAND / COLLAPSE
       ========================================================================== */
    const viewAllBtn = document.getElementById('viewAllBtn');
    const allProjectsGrid = document.getElementById('allProjectsGrid');

    if (viewAllBtn && allProjectsGrid) {
        viewAllBtn.addEventListener('click', () => {
            const isExpanded = allProjectsGrid.classList.toggle('expanded');
            viewAllBtn.classList.toggle('active', isExpanded);
            viewAllBtn.setAttribute('aria-expanded', String(isExpanded));
            viewAllBtn.querySelector('span').textContent = isExpanded ? 'Hide Projects' : 'View All Projects';

            if (isExpanded) {
                // Smoothly bring the newly revealed grid into view
                setTimeout(() => {
                    allProjectsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 200);
            }
        });
    }

    /* ==========================================================================
       7. ABOUT STATS — ANIMATED COUNT-UP (triggers once, on scroll into view)
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const duration = 1400;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    }

    if (statNumbers.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    /* ==========================================================================
       8. SKILL CARDS — DESKTOP CURSOR TILT + GLOW / MOBILE TAP-FLIP + AUTO-GLOW
       Desktop: the card tilts toward the cursor and a soft glow follows the
       pointer. Touch devices have no cursor, so tapping flips the card (like
       the desktop hover) and every card gets its own slow auto-traveling
       glow so it still feels alive.
       ========================================================================== */
    const skillCards = document.querySelectorAll('.skill-card');
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // Inject the mirror-light shine layer into every card face
    skillCards.forEach(card => {
        const face = card.querySelector('.skill-card-3d');
        if (face && !face.querySelector('.card-shine')) {
            const shine = document.createElement('span');
            shine.className = 'card-shine';
            face.appendChild(shine);
        }
    });

    if (isTouchDevice) {
        skillCards.forEach((card, index) => {
            const face = card.querySelector('.skill-card-3d');
            if (face) {
                face.classList.add('auto-glow');
                face.style.animationDelay = `${(index % 6) * 0.6}s`;
            }
            card.addEventListener('click', (e) => {
                const alreadyFlipped = card.classList.contains('is-flipped');
                skillCards.forEach(c => c.classList.remove('is-flipped'));
                if (!alreadyFlipped) card.classList.add('is-flipped');
                e.stopPropagation();
            });
        });
        document.addEventListener('click', () => {
            skillCards.forEach(c => c.classList.remove('is-flipped'));
        });
    } else {
        skillCards.forEach(card => {
            const face = card.querySelector('.skill-card-3d');
            if (!face) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width;   // 0 -> 1
                const relY = (e.clientY - rect.top) / rect.height;   // 0 -> 1

                const tiltX = (relX - 0.5) * 24;   // -12deg .. 12deg
                const tiltY = (0.5 - relY) * 20;   // -10deg .. 10deg

                face.style.setProperty('--tiltX', tiltX.toFixed(2));
                face.style.setProperty('--tiltY', tiltY.toFixed(2));
                face.style.setProperty('--glow-x', `${(relX * 100).toFixed(1)}%`);
                face.style.setProperty('--glow-y', `${(relY * 100).toFixed(1)}%`);
            });

            card.addEventListener('mouseleave', () => {
                face.style.setProperty('--tiltX', 0);
                face.style.setProperty('--tiltY', 0);
            });
        });
    }

    /* ==========================================================================
       9. HERO NAME — STAGGERED LETTER-REVEAL MOTION
       ========================================================================== */
    const nameEl = document.querySelector('.name');
    if (nameEl) {
        const words = nameEl.textContent.trim().split(/\s+/);
        nameEl.textContent = '';
        nameEl.classList.add('letter-reveal');

        let charIndex = 0;
        words.forEach((word, wi) => {
            // Each word is wrapped in its own atomic, non-wrapping box. This is
            // what actually stops the browser from breaking mid-word (it was
            // previously free to insert a line break between ANY two adjacent
            // letter spans, which is why "Jerome Quinto" was splitting into
            // "Jerome Q" / "uinto" on narrow screens).
            const wordSpan = document.createElement('span');
            wordSpan.className = 'name-word';

            [...word].forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                charSpan.style.animationDelay = `${0.35 + charIndex * 0.045}s`;
                charIndex++;
                wordSpan.appendChild(charSpan);
            });

            nameEl.appendChild(wordSpan);

            if (wi < words.length - 1) {
                // Forced break: hidden (display:none) on desktop/tablet so the
                // words simply sit on one line separated by a normal space;
                // revealed at the mobile breakpoint so "Jerome" always stacks
                // cleanly above "Quinto" instead of relying on wherever the
                // text happens to wrap.
                const lineBreak = document.createElement('br');
                lineBreak.className = 'name-break';
                lineBreak.setAttribute('aria-hidden', 'true');
                nameEl.appendChild(lineBreak);
                nameEl.appendChild(document.createTextNode(' '));
            }
        });

        // Each letter now carries its own gradient background-clip (see style.css).
        // Position every letter's gradient slice using a running cumulative offset
        // (not its actual on-screen x/y) so the gradient reads as ONE continuous
        // gold-to-grey / violet-to-blue sweep across "Jerome Quinto" — identical
        // whether the name renders on one line (desktop) or wraps to two lines
        // (mobile, "Jerome" / "Quinto").
        const positionNameGradient = () => {
            const chars = [...nameEl.querySelectorAll('.char')];
            if (!chars.length) return;
            const widths = chars.map(span => span.getBoundingClientRect().width);
            const totalWidth = widths.reduce((sum, w) => sum + w, 0);
            if (!totalWidth) return;
            let cumulative = 0;
            chars.forEach((span, i) => {
                span.style.backgroundSize = `${totalWidth}px 100%`;
                span.style.backgroundPositionX = `${-cumulative}px`;
                cumulative += widths[i];
            });
        };

        positionNameGradient();
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(positionNameGradient);
        }

        let nameResizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(nameResizeTimer);
            nameResizeTimer = setTimeout(positionNameGradient, 150);
        });
    }

    /* ==========================================================================
       10. MAGNETIC BUTTONS (desktop pointer only — skipped on touch for perf)
       ========================================================================== */
    if (!isTouchDevice) {
        const magneticEls = document.querySelectorAll('.btn-primary, .btn-outline, .btn-view-all, .btn-submit-form');
        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                el.style.setProperty('--mx', (relX * 0.18).toFixed(2));
                el.style.setProperty('--my', (relY * 0.28).toFixed(2));
            });
            el.addEventListener('mouseleave', () => {
                el.style.setProperty('--mx', 0);
                el.style.setProperty('--my', 0);
            });
        });
    }

    /* ==========================================================================
       11. RIPPLE MICRO-INTERACTION ON CLICK
       ========================================================================== */
    const rippleTargets = document.querySelectorAll(
        '.btn, .btn-view-all, .btn-submit-form, .btn-slide-action, .social-touch-box, .contact-card-link'
    );
    rippleTargets.forEach(el => {
        el.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    /* ==========================================================================
       12. AMBIENT FLOATING PARTICLES IN HERO (lightweight, GPU-only)
       ========================================================================== */
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        const particleCount = window.innerWidth < 480 ? 8 : 16;
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('span');
            const left = Math.random() * 100;
            const duration = 10 + Math.random() * 10;
            const delay = Math.random() * 10;
            const size = 3 + Math.random() * 4;
            p.style.left = `${left}%`;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.animationDuration = `${duration}s`;
            p.style.animationDelay = `${delay}s`;
            heroParticles.appendChild(p);
        }
    }

    /* ==========================================================================
       13. ABOUT ME — EXTENDED CONTENT
       Generic 3D tilt+glow cards (Quick Info / Core Values / Beyond Coding),
       the Development Philosophy line-stagger reveal, the My Workflow
       scroll-progressive timeline, and the ambient background dots.
       ========================================================================== */

    // -- Generic tilt cards (desktop cursor tilt+glow, mobile tap-flip) --
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        const inner = card.querySelector('.tilt-card-inner');
        if (!inner) return;

        if (isTouchDevice) {
            card.addEventListener('click', (e) => {
                const wasFlipped = card.classList.contains('is-flipped');
                tiltCards.forEach(c => c.classList.remove('is-flipped'));
                if (!wasFlipped) card.classList.add('is-flipped');
                e.stopPropagation();
            });
        } else {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / rect.width;
                const relY = (e.clientY - rect.top) / rect.height;
                inner.style.setProperty('--tiltX', ((relX - 0.5) * 16).toFixed(2));
                inner.style.setProperty('--tiltY', ((0.5 - relY) * 14).toFixed(2));
                inner.style.setProperty('--glow-x', `${(relX * 100).toFixed(1)}%`);
                inner.style.setProperty('--glow-y', `${(relY * 100).toFixed(1)}%`);
            });
            card.addEventListener('mouseleave', () => {
                inner.style.setProperty('--tiltX', 0);
                inner.style.setProperty('--tiltY', 0);
            });
        }
    });
    if (isTouchDevice && tiltCards.length) {
        document.addEventListener('click', () => {
            tiltCards.forEach(c => c.classList.remove('is-flipped'));
        });
    }

    // -- Development Philosophy: split into sentence-level lines + reveal on scroll --
    const philosophyPanel = document.querySelector('.philosophy-panel');
    if (philosophyPanel) {
        const textEl = philosophyPanel.querySelector('.philosophy-text');
        if (textEl) {
            const sentences = textEl.textContent.trim().split(/(?<=\.)\s+/).filter(Boolean);
            textEl.innerHTML = sentences.map(s => `<span class="phil-line">${s} </span>`).join('');
        }
        const philObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    philosophyPanel.classList.add('show');
                    philObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        philObserver.observe(philosophyPanel);
    }

    // -- My Workflow: activate each step (and grow the connecting line) as it scrolls into view --
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const workflowFill = document.querySelector('.workflow-line-fill');
    if (workflowSteps.length) {
        const totalSteps = workflowSteps.length;
        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    const stepNum = parseInt(entry.target.getAttribute('data-step'), 10) || 1;
                    if (workflowFill) {
                        const pct = (stepNum / totalSteps) * 100;
                        const isVertical = window.innerWidth <= 768;
                        if (isVertical) {
                            workflowFill.style.height = `${pct}%`;
                        } else {
                            workflowFill.style.width = `${pct}%`;
                        }
                    }
                    workflowObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        workflowSteps.forEach(step => workflowObserver.observe(step));
    }

    // -- Ambient background dots for the About section (lightweight, GPU-only) --
    const ambientDotsContainer = document.getElementById('aboutAmbientDots');
    if (ambientDotsContainer) {
        const dotCount = window.innerWidth < 480 ? 10 : 22;
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'ambient-dot';
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.animationDuration = `${6 + Math.random() * 8}s`;
            dot.style.animationDelay = `${Math.random() * 6}s`;
            ambientDotsContainer.appendChild(dot);
        }
    }

    // -- Subtle parallax drift for the ambient background while About is in view --
    const aboutAmbientBg = document.querySelector('.about-ambient-bg');
    const aboutSection = document.getElementById('about');
    if (aboutAmbientBg && aboutSection && !prefersReducedMotion) {
        let aboutInView = false;
        new IntersectionObserver((entries) => {
            entries.forEach(entry => { aboutInView = entry.isIntersecting; });
        }, { threshold: 0 }).observe(aboutSection);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!aboutInView || ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = aboutSection.getBoundingClientRect();
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const offset = (progress - 0.5) * 40;
                aboutAmbientBg.style.transform = `translateY(${offset.toFixed(1)}px)`;
                ticking = false;
            });
        }, { passive: true });
    }

    /* ==========================================================================
       14. PARTICLE DISSOLVE / REASSEMBLE HEADING TEXT
       Renders the given heading's text as sampled particles on a canvas
       overlay, then loops: hold assembled -> explode outward -> hold
       dispersed -> reassemble -> repeat. The real text stays in the DOM
       (transparent, not hidden) for accessibility and SEO; the effect is
       skipped entirely for prefers-reduced-motion.
       ========================================================================== */

    function wrapCanvasText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let current = words[0] || '';
        for (let i = 1; i < words.length; i++) {
            const test = current + ' ' + words[i];
            if (ctx.measureText(test).width > maxWidth && current) {
                lines.push(current);
                current = words[i];
            } else {
                current = test;
            }
        }
        if (current) lines.push(current);
        return lines;
    }

    function initParticleHeading(headingEl) {
        if (!headingEl || prefersReducedMotion || typeof window.CanvasRenderingContext2D === 'undefined') return;

        const MOBILE_BREAKPOINT = 640;
        let canvas = null;
        let ctx = null;
        let rafId = null;
        let ioInstance = null;

        function isMobile() { return window.innerWidth < MOBILE_BREAKPOINT; }
        function isVerySmall() { return window.innerWidth < 400; }

        const text = headingEl.getAttribute('data-particle-text') || headingEl.textContent.trim();
        let particles = [];
        let boxWidth = 0;
        let boxHeight = 0;
        let visible = true;

        function build() {
            const rect = headingEl.getBoundingClientRect();
            boxWidth = Math.max(rect.width, 10);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            const cs = getComputedStyle(headingEl);
            const fontSize = parseFloat(cs.fontSize);
            const fontWeight = cs.fontWeight;
            const fontFamily = cs.fontFamily;
            const lineHeight = fontSize * 1.25;
            const font = `${fontWeight} ${fontSize}px ${fontFamily}`;

            // Measure + word-wrap to fit the heading's real width
            const measureCanvas = document.createElement('canvas');
            const mctx = measureCanvas.getContext('2d');
            mctx.font = font;
            const lines = wrapCanvasText(mctx, text, boxWidth);
            boxHeight = Math.max(lines.length * lineHeight, fontSize * 1.4);

            canvas.width = boxWidth * dpr;
            canvas.height = boxHeight * dpr;
            canvas.style.width = boxWidth + 'px';
            canvas.style.height = boxHeight + 'px';
            headingEl.style.minHeight = boxHeight + 'px';

            // Draw the wrapped text to an offscreen canvas to sample particle origins
            const off = document.createElement('canvas');
            off.width = canvas.width;
            off.height = canvas.height;
            const octx = off.getContext('2d', { willReadFrequently: true });
            octx.setTransform(dpr, 0, 0, dpr, 0, 0);
            octx.font = font;
            octx.fillStyle = '#fff';
            octx.textBaseline = 'alphabetic';
            octx.textAlign = 'center';
            lines.forEach((line, i) => {
                octx.fillText(line, boxWidth / 2, lineHeight * (i + 0.85));
            });

            const imgData = octx.getImageData(0, 0, canvas.width, canvas.height).data;
            // Denser sampling on smaller screens keeps the assembled state crisp
            // instead of speckled, so it reads as real letterforms, not noise.
            const gap = Math.max(1.1, Math.round((isVerySmall() ? 1.1 : isMobile() ? 1.5 : 2.4) * dpr));
            particles = [];
            for (let y = 0; y < canvas.height; y += gap) {
                for (let x = 0; x < canvas.width; x += gap) {
                    const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                    if (alpha > 120) {
                        const angle = Math.random() * Math.PI * 2;
                        // Shorter scatter radius on mobile so dispersed particles
                        // never drift into a neighboring line of wrapped text.
                        const maxDist = isVerySmall() ? Math.min(11, lineHeight * 0.28) : isMobile() ? Math.min(18, lineHeight * 0.4) : 100;
                        const minDist = isMobile() ? 3 : 30;
                        const dist = minDist + Math.random() * (maxDist - minDist);
                        particles.push({
                            ox: x / dpr,
                            oy: y / dpr,
                            sx: Math.cos(angle) * dist,
                            sy: Math.sin(angle) * dist,
                            size: (gap / dpr) * 0.9,
                        });
                    }
                }
            }
        }

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        const HOLD_ASSEMBLED = () => (isVerySmall() ? 5000 : isMobile() ? 4200 : 2800);
        const DISPERSE = () => (isMobile() ? 500 : 900);
        const HOLD_DISPERSED = 650;
        const REASSEMBLE = () => (isMobile() ? 600 : 1000);

        let phase = 'assembled';
        let phaseStart = performance.now();
        let accentColor = '#3b82f6';

        function refreshColor() {
            const varName = headingEl.closest('#hero') ? '--accent-hero' : '--accent-about';
            const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            accentColor = value || getComputedStyle(document.documentElement).getPropertyValue('--accent-hero').trim() || '#3b82f6';
        }

        function draw(now) {
            if (!visible) {
                rafId = requestAnimationFrame(draw);
                return;
            }
            const elapsed = now - phaseStart;
            let t = 0;

            if (phase === 'assembled') {
                if (elapsed > HOLD_ASSEMBLED()) { phase = 'dispersing'; phaseStart = now; refreshColor(); }
            } else if (phase === 'dispersing') {
                t = Math.min(elapsed / DISPERSE(), 1);
                if (t >= 1) { phase = 'dispersed'; phaseStart = now; }
            } else if (phase === 'dispersed') {
                t = 1;
                if (elapsed > HOLD_DISPERSED) { phase = 'reassembling'; phaseStart = now; }
            } else if (phase === 'reassembling') {
                t = 1 - Math.min(elapsed / REASSEMBLE(), 1);
                if (elapsed >= REASSEMBLE()) { phase = 'assembled'; phaseStart = now; }
            }

            const eased = easeInOutCubic(t);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dpr = canvas.width / boxWidth;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = accentColor;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const px = p.ox + p.sx * eased;
                const py = p.oy + p.sy * eased;
                ctx.globalAlpha = 1 - eased * 0.2;
                ctx.fillRect(px, py, p.size, p.size);
            }
            ctx.globalAlpha = 1;

            rafId = requestAnimationFrame(draw);
        }

        function enableParticles() {
            if (canvas) return; // already active
            canvas = document.createElement('canvas');
            canvas.className = 'particle-text-canvas';
            canvas.setAttribute('aria-hidden', 'true');
            headingEl.appendChild(canvas);
            headingEl.classList.add('particle-active');
            ctx = canvas.getContext('2d', { willReadFrequently: true });

            refreshColor();
            build();
            rafId = requestAnimationFrame(draw);

            ioInstance = new IntersectionObserver(entries => {
                entries.forEach(entry => { visible = entry.isIntersecting; });
            }, { threshold: 0 });
            ioInstance.observe(headingEl);
        }

        // Particles stay on at every screen size (including small phones) —
        // build() already samples a denser/tighter field on narrow viewports
        // so the assembled phase reads as real letterforms, not noise.
        enableParticles();

        // Rebuild particle field on resize (debounced) so density/travel
        // re-tunes correctly if the viewport crosses the mobile breakpoint.
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(build, 250);
        });
        const themeObserver = new MutationObserver(refreshColor);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    document.querySelectorAll('.particle-heading').forEach(initParticleHeading);

    /* ==========================================================================
       15. CONTACT FORM — RESTORED FORMSPREE SUBMISSION LOGIC
       Ported from the previous working version: same endpoint, same field
       behavior (validate, disable + spinner while sending, success/error
       message, reset on success, re-enable button afterward).
       ========================================================================== */
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        const statusEl = document.getElementById('form-status');
        const submitBtn = portfolioForm.querySelector('.btn-submit-form');
        const submitBtnDefaultHTML = submitBtn ? submitBtn.innerHTML : '';

        portfolioForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!portfolioForm.checkValidity()) {
                portfolioForm.reportValidity();
                return;
            }

            const data = new FormData(portfolioForm);

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
            }
            if (statusEl) {
                statusEl.textContent = '';
                statusEl.className = 'form-status';
            }

            try {
                const response = await fetch(portfolioForm.action, {
                    method: portfolioForm.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (statusEl) {
                        statusEl.textContent = "Message sent successfully! I'll get back to you soon.";
                        statusEl.className = 'form-status success';
                    }
                    portfolioForm.reset();
                } else {
                    if (statusEl) {
                        statusEl.textContent = 'Something went wrong. Please try again or email me directly.';
                        statusEl.className = 'form-status error';
                    }
                }
            } catch (error) {
                if (statusEl) {
                    statusEl.textContent = 'Network error. Please check your connection and try again.';
                    statusEl.className = 'form-status error';
                }
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnDefaultHTML;
            }
        });
    }

});


/* ==========================================================================
   TYPING EFFECT (About Me section)
   ========================================================================== */
const words = ["Web Developer", "System Programmer", "Full Stack Developer"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function () {
        if (word.length > 0) {
            document.getElementById('typing').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000); // How long the word stays visible
            return false;
        }
        timer = setTimeout(loopTyping, 100); // Typing speed
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function () {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typing').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            setTimeout(typingEffect, 500); // Delay before next word starts typing
            return false;
        }
        timer = setTimeout(loopDeleting, 50); // Deleting speed
    };
    loopDeleting();
}

// Start the typing animation once the page loads
document.addEventListener("DOMContentLoaded", typingEffect);
// ============ SPECIAL SYSTEM PROJECTS — expand modal ============
(function () {
    const projectData = {
        redwood: {
            status: 'Completed · Successfully Defended Thesis · Production Ready',
            title: 'Reservation Management System for Redwood Cabin',
            meta: 'Balingasay, Bolinao, Pangasinan · Capstone / Thesis System',
            overview: 'A comprehensive reservation management platform developed for Redwood Cabin in Balingasay, Bolinao, Pangasinan. The system streamlines reservation handling, customer management, payment monitoring, booking schedules, and administrative reporting through a centralized digital solution — replacing manual, paper-based processes, minimizing booking conflicts, and providing a more seamless experience for both customers and administrators.',
            image: "url('assets/img/redwood-preview.jpg')",
            media: null,
            highlights: [
                'Online Reservation Management', 'Half-Day & AM/PM Booking', 'Guest Information Management',
                'Food Ordering Integration', 'Reservation Calendar', 'Email Notification System',
                'Payment Tracking', 'Cancellation & Penalty Monitoring', 'Booking Availability Checker',
                'Sales Analytics', 'Reports Generation', 'Receipt Generation',
                'Administrator Dashboard', 'Customer Management', 'Secure Authentication', 'Responsive User Interface'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'C#', '.NET', 'SQL Server', 'Email Integration', 'GitHub'],
            challenges: ['Manual reservation conflicts', 'Paper-based records', 'Scheduling overlaps', 'Payment tracking complexity'],
            solutions: ['Automated reservation validation', 'Centralized database', 'Real-time availability checks', 'Integrated payment monitoring']
        },
        kiosk: {
            status: 'NC III Assessment Project · Completed',
            title: 'Restaurant Ordering Kiosk System',
            meta: 'Malasiqui, Pangasinan · NC III Assessment Project',
            overview: 'A self-service restaurant kiosk system developed as part of the NC III Assessment. The system modernizes food ordering by allowing customers to browse menus, customize orders, manage carts, and complete transactions through an intuitive digital interface — improving ordering efficiency, reducing waiting time, and giving staff organized order management.',
            image: "url('images/kioskSystem.jpg')",
            media: { type: 'video', src: 'assets/video/kiosk-demo.mp4' },
            highlights: [
                'Interactive Digital Menu', 'Product Categories', 'Search & Filter', 'Shopping Cart',
                'Quantity Management', 'Order Summary', 'Checkout', 'Kitchen Queue',
                'Receipt Generation', 'Sales Reports', 'Product Management', 'Inventory Display',
                'Admin Dashboard', 'Responsive Kiosk Interface', 'Modern POS Experience'
            ],
            tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap', 'GitHub'],
            challenges: ['Order management inefficiency', 'Long wait times at the counter', 'Manual receipt handling'],
            solutions: ['Digital self-service ordering', 'Real-time kitchen order queue', 'Automated receipt generation']
        },
        couplesTherapy: {
            status: 'Solo Developed · Android Game · Personal Project',
            title: 'Mobile Game: Couples Therapy — Till Undeath Do Us Part',
            meta: 'Android Mobile Game · Special System Project',
            overview: 'A 2D zombie-shooter mobile game developed entirely solo in Android Studio, combining fast-paced shooting mechanics with a romantic storyline inspired by real life. The player controls two characters fighting through waves of zombies with increasing difficulty, animated environments, and a final boss fight. Every part of the game — gameplay programming, sprite animation, UI, effects, and game logic — was built from scratch by a single developer.',
            image: "url('assets/img/special-couples-therapy-2.jpg')",
            media: { type: 'slideshow', images: ['assets/img/special-couples-therapy-1.jpg', 'assets/img/special-couples-therapy-2.jpg'], interval: 2000 },
            highlights: [
                'Developed Entirely in Android Studio', 'Built Independently — Single Developer', 'Custom Game Mechanics',
                'Full Gameplay System Design', '2D Sprite Animation', 'Enemy AI',
                'Boss Fight Mechanics', 'Custom UI & Animation', 'Optimized for Android Devices',
                'Shooting Mechanics', 'Collision Detection', 'Health System',
                'Sound Effects', 'Game Progression Design', 'Visual Effects', 'Built Entirely From Scratch'
            ],
            tech: ['Android Studio', 'Java', 'XML', 'Sprite Animation', 'Game Logic', 'Collision Detection', 'Sound Effects', 'UI Animation'],
            challenges: ['Solo-developing an entire game', 'Smooth 2D sprite animation on mobile', 'Balancing difficulty across waves', 'Mobile performance optimization'],
            solutions: ['Modular gameplay architecture', 'Custom sprite animation system', 'Progressive difficulty scaling', 'Optimized rendering for Android devices']
        }
    };

    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalImage = document.getElementById('modalImage');
    const modalStatus = document.getElementById('modalStatus');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalMedia = document.getElementById('modalMedia');
    const modalOverview = document.getElementById('modalOverview');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalTech = document.getElementById('modalTech');
    const modalChallenges = document.getElementById('modalChallenges');
    const modalSolutions = document.getElementById('modalSolutions');

    let slideshowTimer = null;

    function clearMedia() {
        if (slideshowTimer) { clearInterval(slideshowTimer); slideshowTimer = null; }
        const existingVideo = modalMedia.querySelector('video');
        if (existingVideo) { existingVideo.pause(); existingVideo.removeAttribute('src'); existingVideo.load(); }
        modalMedia.innerHTML = '';
        modalMedia.style.display = 'none';
    }

    function buildMedia(media) {
        clearMedia();
        if (!media) return;

        if (media.type === 'slideshow' && media.images && media.images.length) {
            modalMedia.style.display = 'block';
            const wrap = document.createElement('div');
            wrap.className = 'modal-slideshow';
            media.images.forEach((src, i) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = '';
                img.loading = 'eager';
                img.className = 'modal-slideshow-img' + (i === 0 ? ' is-active' : '');
                wrap.appendChild(img);
            });
            modalMedia.appendChild(wrap);

            const imgs = wrap.querySelectorAll('.modal-slideshow-img');
            let idx = 0;
            slideshowTimer = setInterval(() => {
                imgs[idx].classList.remove('is-active');
                idx = (idx + 1) % imgs.length;
                imgs[idx].classList.add('is-active');
            }, media.interval || 1000);
        } else if (media.type === 'video' && media.src) {
            modalMedia.style.display = 'block';
            const video = document.createElement('video');
            video.src = media.src;
            video.className = 'modal-video';
            video.muted = true;
            video.autoplay = true;
            video.loop = true;
            video.controls = true;
            video.playsInline = true;
            modalMedia.appendChild(video);
        }
    }

    function openProjectModal(key) {
        const data = projectData[key];
        if (!data) return;

        modalImage.style.backgroundImage = data.image || 'linear-gradient(160deg, rgba(59,130,246,0.25), rgba(15,23,42,0.6))';
        modalStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + data.status;
        modalTitle.textContent = data.title;
        modalMeta.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + data.meta;
        buildMedia(data.media);
        modalOverview.textContent = data.overview;

        modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
        modalTech.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');
        modalChallenges.innerHTML = data.challenges.map(c => `<li>${c}</li>`).join('');
        modalSolutions.innerHTML = data.solutions.map(s => `<li>${s}</li>`).join('');

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.project-modal-content').scrollTop = 0;
    }

    function closeProjectModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        clearMedia();
    }

    document.querySelectorAll('[data-open-project]').forEach(btn => {
        btn.addEventListener('click', () => openProjectModal(btn.getAttribute('data-open-project')));
    });
    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeProjectModal);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeProjectModal();
    });
})();
