// Tailwind Configuration
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    primary: '#65bd4b',
                    primaryDark: '#52a83b',
                },
                fontFamily: {
                    poppins: ['Poppins', 'sans-serif'],
                },
            }
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Mobile Dropdown Toggle
    document.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const menu = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            if (menu) menu.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('shadow-md', window.scrollY > 50);
        });
    }

    // Scroll Animation Observer
    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => fadeUpObserver.observe(el));

    // Card Sliders
    const initializeCardSlider = (sliderId, viewportId, trackId, prevId, nextId) => {
        const slider = document.getElementById(sliderId);
        const viewport = document.getElementById(viewportId);
        const track = document.getElementById(trackId);
        const prevButton = document.getElementById(prevId);
        const nextButton = document.getElementById(nextId);
        if (!slider || !viewport || !track || !prevButton || !nextButton) return;

        const slides = Array.from(track.children);
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        const getSlidesPerView = () => window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
        const getGap = () => parseFloat(window.getComputedStyle(track).gap || '0');

        const updateSlider = () => {
            const spv = getSlidesPerView();
            const maxIndex = Math.max(0, slides.length - spv);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            if (slides.length <= spv) {
                prevButton.classList.add('hidden');
                nextButton.classList.add('hidden');
                track.style.transform = 'translateX(0)';
                return;
            }

            prevButton.classList.remove('hidden');
            nextButton.classList.remove('hidden');
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * (slideWidth + getGap())}px)`;
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === maxIndex;
        };

        prevButton.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; updateSlider(); } });
        nextButton.addEventListener('click', () => { const max = Math.max(0, slides.length - getSlidesPerView()); if (currentIndex < max) { currentIndex++; updateSlider(); } });

        viewport.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        viewport.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const dist = touchStartX - touchEndX;
            if (Math.abs(dist) < 40) return;
            const max = Math.max(0, slides.length - getSlidesPerView());
            if (dist > 0 && currentIndex < max) currentIndex++;
            else if (dist < 0 && currentIndex > 0) currentIndex--;
            updateSlider();
        }, { passive: true });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    };

    initializeCardSlider('transform-slider', 'transform-viewport', 'transform-track', 'transform-prev', 'transform-next');
    initializeCardSlider('testimonial-slider', 'testimonial-viewport', 'testimonial-track', 'testimonial-prev', 'testimonial-next');

    // FAQ Accordion
    document.querySelectorAll('.faq-trigger').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.faq-accordion-item');
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            const icon = item.querySelector('.faq-icon');
            const isOpen = this.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.faq-accordion-item').forEach(other => {
                if (other !== item) {
                    const otherAnswer = other.querySelector('.faq-answer');
                    const otherTrigger = other.querySelector('.faq-trigger');
                    const otherIcon = other.querySelector('.faq-icon');
                    if (otherAnswer) otherAnswer.classList.add('hidden');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                    if (otherIcon) otherIcon.classList.remove('rotate-180');
                }
            });

            if (isOpen) {
                if (answer) answer.classList.add('hidden');
                this.setAttribute('aria-expanded', 'false');
                if (icon) icon.classList.remove('rotate-180');
            } else {
                if (answer) answer.classList.remove('hidden');
                this.setAttribute('aria-expanded', 'true');
                if (icon) icon.classList.add('rotate-180');
            }
        });
    });

    // Form submission (basic)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }

    // Swiper Initialization (if Swiper is available)
    if (typeof Swiper !== 'undefined') {
        const smartSwiper = document.querySelector('.smart-nutrition-swiper');
        if (smartSwiper) {
            new Swiper('.smart-nutrition-swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                grabCursor: true,
                autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
                navigation: { nextEl: '.smart-nutrition-next', prevEl: '.smart-nutrition-prev' },
                breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } },
            });
        }
    }
});
