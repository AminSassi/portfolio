// Language Switcher
const langButtons = document.querySelectorAll('.lang-btn');
const body = document.body;

function switchLanguage(lang) {
    // Update all elements with language data attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });

    // Change direction for Tunisian
    if (lang === 'tn') {
        body.setAttribute('dir', 'rtl');
    } else {
        body.setAttribute('dir', 'ltr');
    }

    // Update active button
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // Save preference (may be blocked in strict privacy modes)
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (err) {
        /* ignore */
    }
}

// Add click listeners to language buttons
langButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchLanguage(button.dataset.lang);
    });
});

// Load saved language preference (might be blocked by privacy settings)
let savedLang = 'en';
try {
    savedLang = localStorage.getItem('preferredLanguage') || 'en';
} catch (err) {
    /* ignore */
}
switchLanguage(savedLang);

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navRight = document.getElementById('navRight');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navRight.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navRight.classList.remove('active');
    });
});

// Scroll updates (throttled via requestAnimationFrame)
let lastScroll = 0;
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

let latestScrollY = 0;
let scrollTicking = false;
const onScroll = () => {
    latestScrollY = window.pageYOffset;

    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
            const scrolled = latestScrollY;
            const parallaxSpeed = 0.3;

            // Parallax background
            document.documentElement.style.setProperty('--scroll-offset', `${scrolled * parallaxSpeed}px`);

            // Sticky nav (hide on scroll down)
            if (scrolled <= 0) {
                navbar.classList.remove('hidden');
            } else if (scrolled > lastScroll && scrolled > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }

            // Back-to-top button
            if (scrolled > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            lastScroll = scrolled;
            scrollTicking = false;
        });
    }
};

window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Using mailto as a basic fallback
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:aminsassi267@gmail.com?subject=${subject}&body=${body}`;
    
    // Show success message
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const successMessage = currentLang === 'en' 
        ? 'Thank you for your message! I will get back to you soon.' 
        : 'شكراً على رسالتك! باش نرجعلك بالإجابة قريب.';
    alert(successMessage);
    contactForm.reset();
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ── Optimised Cursor (RAF only on move, not infinite loop) ──
const cursor = document.getElementById('glassCursor');
const ring   = document.getElementById('glassCursorRing');
let mx = 0, my = 0, rx = 0, ry = 0, rafId = null;
function stepRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    if (Math.abs(mx-rx) > 0.5 || Math.abs(my-ry) > 0.5) rafId = requestAnimationFrame(stepRing);
    else rafId = null;
}
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    if (!rafId) rafId = requestAnimationFrame(stepRing);
}, { passive: true });

// ── Ripple on click ──
const rs = document.createElement('style');
rs.textContent = '@keyframes glassRipple { to { transform:translate(-50%,-50%) scale(16); opacity:0; } }';
document.head.appendChild(rs);
document.addEventListener('click', e => {
    const r = document.createElement('div');
    Object.assign(r.style, {
        position:'fixed', borderRadius:'50%', width:'6px', height:'6px',
        left:e.clientX+'px', top:e.clientY+'px',
        transform:'translate(-50%,-50%) scale(0)',
        border:'1.5px solid rgba(255,255,255,0.45)',
        pointerEvents:'none', zIndex:'99997',
        animation:'glassRipple 0.55s ease-out forwards'
    });
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
});

// ── Video modal: click preview → play full video in modal ──
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.video-wrapper[data-video]').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
        const src = wrapper.dataset.video;

        // Stop preview videos while the modal is open to reduce CPU/GPU load
        document.querySelectorAll('.video-preview').forEach(v => v.pause());

        modalVideo.src = src;
        modalVideo.play();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    });
});

function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');

    // Resume preview videos after closing the modal
    document.querySelectorAll('.video-preview').forEach(v => {
        v.play().catch(() => {
            // Some browsers may block autoplay; it's ok.
        });
    });
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Only play preview videos when they are visible on-screen.
// This reduces CPU/GPU load when many previews exist offscreen.
const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.video-preview').forEach(video => {
    previewObserver.observe(video);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.portfolio-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${i*0.08}s, transform 0.6s ease ${i*0.08}s`;
    observer.observe(item);
});
document.querySelectorAll('.skill-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = `opacity 0.5s ease ${i*0.07}s, transform 0.5s ease ${i*0.07}s`;
    observer.observe(item);
});
document.querySelectorAll('.stat-card').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transition = `opacity 0.5s ease ${i*0.1}s, transform 0.5s ease ${i*0.1}s`;
    observer.observe(item);
});
