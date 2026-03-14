// Language Switcher
const body = document.body;
const translatableElements = Array.from(document.querySelectorAll('[data-en]'));

function updateLanguageUI(lang) {
    document.querySelectorAll('.lang-picker .lang').forEach(el => el.classList.remove('chosen'));
    const next = document.querySelector(`.lang-picker .${lang}-lang`);
    if (next) next.classList.add('chosen');
}

function switchLanguage(lang) {
    // Update all elements with language data attributes
    translatableElements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });

    // Change direction for Tunisian and ensure the HTML root is updated too
    if (lang === 'tn') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        body.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        body.setAttribute('dir', 'ltr');
    }

    // Update the picker UI
    updateLanguageUI(lang);

    // Save preference (may be blocked in strict privacy modes)
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (err) {
        /* ignore */
    }
}

// Language picker toggle
function changeLang(lang) {
    switchLanguage(lang);
    langDropdown.classList.remove('open');
    langTrigger.setAttribute('aria-expanded', 'false');
}

// Load saved language preference (might be blocked by privacy settings)
let savedLang = 'en';
try {
    savedLang = localStorage.getItem('preferredLanguage') || 'en';
} catch (err) {
    /* ignore */
}
switchLanguage(savedLang);

// Lang dropdown toggle
const langTrigger = document.getElementById('langTrigger');
const langDropdown = document.getElementById('langDropdown');

langTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.toggle('open');
    langTrigger.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', () => {
    langDropdown.classList.remove('open');
    langTrigger.setAttribute('aria-expanded', 'false');
});

langDropdown.addEventListener('click', e => e.stopPropagation());

// Footer year auto-update
const footerYear = document.querySelector('footer p');
if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace(/\d{4}/, year);
}

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
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        position: 'fixed', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(30,40,60,0.95)', color: '#fff',
        padding: '0.85rem 1.6rem', borderRadius: '8px',
        fontSize: '0.95rem', zIndex: '99999',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        transition: 'opacity 0.4s ease'
    });
    toast.textContent = successMessage;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
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

// Testimonials carousel
(function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentIndex = 0;

    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    if (isRTL) track.style.flexDirection = 'row-reverse';

    function updateCarousel() {
        const container = track.parentElement;
        const containerWidth = container.clientWidth;
        const maxOffset = Math.max(0, track.scrollWidth - containerWidth);

        const effectiveIndex = isRTL ? cards.length - 1 - currentIndex : currentIndex;
        const activeCard = cards[effectiveIndex];
        const cardCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;

        // Center the active card in the visible area (allow whitespace at ends)
        const desired = cardCenter - containerWidth / 2;
        const clamped = Math.max(0, Math.min(maxOffset, desired));
        track.style.transform = `translateX(-${clamped}px)`;

        cards.forEach((card, idx) => {
            card.classList.toggle('active', idx === effectiveIndex);
        });
    }

    function clampIndex(idx) {
        if (idx < 0) return cards.length - 1;
        if (idx >= cards.length) return 0;
        return idx;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = clampIndex(currentIndex + (isRTL ? 1 : -1));
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = clampIndex(currentIndex + (isRTL ? -1 : 1));
        updateCarousel();
    });

    // Resize-aware transform update
    window.addEventListener('resize', () => {
        requestAnimationFrame(updateCarousel);
    });

    // Start with first card active
    updateCarousel();
})();

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
        // Reset to the start frame so the modal doesn't briefly show the previous clip.
        try { modalVideo.currentTime = 0.01; } catch (err) {}
        modalVideo.load();
        modalVideo.play().catch(() => {});
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
            // Always start from the first frame so the preview matches the source.
            try { video.currentTime = 0.01; } catch (err) {}
            video.play().catch(() => {});
        } else {
            // Reset to the beginning so the thumbnail doesn't show a random ending frame.
            try { video.currentTime = 0.01; } catch (err) {}
            video.pause();
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.video-preview').forEach(video => {
    // Ensure the preview stays hidden until it has at least one frame ready.
    const markLoaded = () => {
        // Seek just past the start so we get the first decoded frame (often a keyframe).
        try { video.currentTime = 0.01; } catch (err) {}
        video.classList.add('loaded');
        video.pause();
    };

    if (video.readyState >= 3) {
        markLoaded();
    } else {
        video.addEventListener('loadeddata', markLoaded, { once: true });
    }

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

// Voice Players
(function () {
    let activePair = null; // { audio, player, bars }

    function fmt(s) {
        if (!isFinite(s) || s < 0) return '0:00';
        return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    function setWave(bars, progress) {
        var filled = Math.floor(progress * bars.length);
        bars.forEach(function(bar, i) {
            if (i < filled) {
                bar.style.background = '#60b8ff';
                bar.style.animationName = 'none';
            } else if (i === filled) {
                bar.style.background = '#60b8ff';
                bar.style.animationName = 'waveBar';
                bar.style.animationDuration = '0.7s';
                bar.style.animationTimingFunction = 'ease-in-out';
                bar.style.animationIterationCount = 'infinite';
            } else {
                bar.style.background = 'rgba(255,255,255,0.25)';
                bar.style.animationName = 'none';
            }
        });
    }

    function resetWave(bars) {
        bars.forEach(function(bar) {
            bar.style.background = 'rgba(255,255,255,0.25)';
            bar.style.animationName = 'none';
        });
    }

    function stopActive() {
        if (!activePair) return;
        activePair.audio.pause();
        activePair.player.querySelector('.icon-play').style.display = '';
        activePair.player.querySelector('.icon-pause').style.display = 'none';
        resetWave(activePair.bars);
        activePair = null;
    }

    document.querySelectorAll('.voice-player').forEach(function(player) {
        var btn       = player.querySelector('.voice-play-btn');
        var iconPlay  = player.querySelector('.icon-play');
        var iconPause = player.querySelector('.icon-pause');
        var durEl     = player.querySelector('.voice-duration');
        var bars      = Array.from(player.querySelectorAll('.voice-waveform span'));
        var audio     = player.querySelector('audio');
        var src       = player.getAttribute('data-src');

        // set src directly
        audio.src = src;

        audio.addEventListener('loadedmetadata', function() {
            durEl.textContent = fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', function() {
            durEl.textContent = fmt(audio.duration - audio.currentTime);
            if (audio.duration > 0) setWave(bars, audio.currentTime / audio.duration);
        });

        audio.addEventListener('ended', function() {
            iconPlay.style.display  = '';
            iconPause.style.display = 'none';
            durEl.textContent = fmt(audio.duration);
            resetWave(bars);
            activePair = null;
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // clicking the active player = pause it
            if (activePair && activePair.audio === audio) {
                stopActive();
                return;
            }

            // stop whatever else is playing
            stopActive();

            // play this one
            audio.play().catch(function(err) { console.warn('play failed', err); });
            iconPlay.style.display  = 'none';
            iconPause.style.display = '';
            activePair = { audio: audio, player: player, bars: bars };
        });
    });
})();


// -- Feedback Stack Scroll --
(function () {
    const stack  = document.getElementById('feedbackStack');
    const btnDn  = document.getElementById('fbScrollBtn');
    const btnUp  = document.getElementById('fbScrollUp');
    if (!stack || !btnDn) return;

    const cards  = Array.from(stack.querySelectorAll('.feedback-card'));
    const cardH  = () => cards[0] ? cards[0].offsetHeight : 220;

    btnDn.addEventListener('click', () => stack.scrollBy({ top:  cardH(), behavior: 'smooth' }));
    if (btnUp) btnUp.addEventListener('click', () => stack.scrollBy({ top: -cardH(), behavior: 'smooth' }));

    function updateStack() {
        const scrollTop  = stack.scrollTop;
        const viewH      = stack.clientHeight;
        const atEnd      = scrollTop + viewH >= stack.scrollHeight - 8;
        const atStart    = scrollTop < 8;

        btnDn.classList.toggle('hidden', atEnd);
        if (btnUp) btnUp.classList.toggle('visible', !atStart);
    }

    stack.addEventListener('scroll', updateStack, { passive: true });
    updateStack();
})();
