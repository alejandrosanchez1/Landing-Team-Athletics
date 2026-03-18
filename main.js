/**
 * Team Atletics V3 - Main JavaScript
 * Mobile-First Interactions, SwiperJS, and Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if(mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
        
        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
            });
        });
    }

    // 2. Initialize SwiperJS Carousel for Success Cases
    const swiper = new Swiper('.success-swiper', {
        // Mobile-first defaults
        slidesPerView: 1.15, // Peeking edge of next slide
        spaceBetween: 20,
        grabCursor: true,
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Responsive breakpoints
        breakpoints: {
            768: {
                slidesPerView: 2.2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3.5, // To create the asymmetric feeling on desktop
                spaceBetween: 40,
            }
        }
    });

    // 3. Initialize Lenis (Smooth Scroll)
    // Disabled smoothTouch so mobile feels 100% native while desktop is buttery smooth
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // 4. Custom Cursor Logic (Desktop Only)
    if (window.innerWidth > 1024) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if(cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        const animateCursor = () => {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;
            outlineX += distX * 0.15;
            outlineY += distY * 0.15;
            
            if(cursorOutline) cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        const hoverElements = document.querySelectorAll('a, button, .v2-card, .success-card, .ig-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 5. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('solid-bg');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('solid-bg');
        }
    });

    // 6. GSAP Animations & ScrollTriggers
    
    // Initial Hero Sequence
    const tlHero = gsap.timeline();
    tlHero.fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 })
          .fromTo('.visual-wrapper', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.6")
          .fromTo('.scroll-down-icon', { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.2");

    // Fade-up Elements
    const fadeUpElements = gsap.utils.toArray('.fade-up');
    fadeUpElements.forEach((el) => {
        // Avoid double animating hero elements
        if(tlHero.isActive() && (el.classList.contains('hero-title') || el.classList.contains('visual-wrapper'))) return;

        let delay = 0;
        if (el.classList.contains('delay-1')) delay = 0.15;
        if (el.classList.contains('delay-2')) delay = 0.3;
        if (el.classList.contains('delay-3')) delay = 0.45;
        if (el.classList.contains('delay-4')) delay = 0.6;
        
        gsap.fromTo(el,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%', // Triggers slightly earlier on mobile
                    toggleActions: 'play none none none' // Play once and stay (better performance on mobile)
                }
            }
        );
    });

    // Parallax Elements (Desktop only to save battery/perf on mobile)
    if (window.innerWidth > 1024) {
        const parallaxElements = gsap.utils.toArray('.parallax-element');
        parallaxElements.forEach((el) => {
            gsap.fromTo(el, 
                { yPercent: -5 },
                {
                    yPercent: 5, ease: 'none',
                    scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
                }
            );
        });

        // Interactive Glass Cards Glow
        const cards = document.querySelectorAll('.v2-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
});
