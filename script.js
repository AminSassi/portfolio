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

// Lang dropdown toggle
const langTrigger = document.getElementById('langTrigger');
const langDropdown = document.getElementById('langDropdown');

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

// ── Unified Scroll Handler ──
let lastScroll = 0;
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
let scrollTicking = false;
const bgLogos = document.querySelectorAll('.bg-logo');

const onScroll = () => {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Parallax background
            document.documentElement.style.setProperty('--scroll-offset', (scrolled * 0.3) + 'px');

            // Sticky nav
            if (scrolled <= 0) {
                navbar.classList.remove('hidden');
            } else if (scrolled > lastScroll && scrolled > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }

            // Back-to-top
            backToTop.classList.toggle('visible', scrolled > 300);

            // Background logos parallax
            bgLogos.forEach(function(logo, i) {
                logo.style.transform = 'translateY(' + (scrolled * (0.02 + i * 0.008)) + 'px)';
            });

            // Hero icons scroll parallax
            heroIcons.forEach(function(icon, i) {
                icon.style.marginTop = (scrolled * (0.05 + i * 0.03)) + 'px';
            });

            // Hero scroll zoom-out
            var hero = document.querySelector('.hero-cinematic');
            if (hero) {
                var maxScroll = window.innerHeight * 0.6;
                var progress = Math.min(scrolled / maxScroll, 1);
                var portrait = hero.querySelector('.hero-portrait');
                if (portrait) portrait.style.transform = 'translateX(-50%) scale(' + (1.15 - 0.15 * progress) + ')';
                var overlay = hero.querySelector('.hero-overlay-text');
                if (overlay) {
                    overlay.style.opacity = 1 - (progress * 1.5);
                    overlay.style.transform = 'translateY(' + (progress * 30) + 'px)';
                }
                if (scrolled > 20) hero.classList.add('scrolled');
                else hero.classList.remove('scrolled');
            }

            // Dynamic Island
            var island = document.getElementById('dynamicIsland');
            var sectionLabel = document.getElementById('diSection');
            if (island && sectionLabel) {
                island.classList.toggle('visible', scrolled > 300);
                var sections = document.querySelectorAll('section[id]');
                var current = 'home';
                sections.forEach(function(sec) { if (scrolled >= sec.offsetTop - 200) current = sec.id; });
                if (current !== lastIslandSection) {
                    lastIslandSection = current;
                    var lang = localStorage.getItem('preferredLanguage') || 'en';
                    var names = { en: { home: 'Home', about: 'About', tools: 'Tools', experience: 'Journey', portfolio: 'Portfolio', testimonials: 'Feedback', youtube: 'YouTube', contact: 'Contact' }, tn: { home: 'الرئيسية', about: 'من أنا', tools: 'الأدوات', experience: 'الرحلة', portfolio: 'أعمالي', testimonials: 'آراء', youtube: 'يوتيوب', contact: 'تواصل' } };
                    sectionLabel.textContent = (names[lang] || names.en)[current] || current;
                }
            }

            lastScroll = scrolled;
            scrollTicking = false;
        });
    }
};

let lastIslandSection = '';
window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const successMessage = currentLang === 'en'
            ? 'Thank you for your message! I will get back to you soon.'
            : 'شكراً على رسالتك! باش نرجعلك بالإجابة قريب.';
        const errorMessage = currentLang === 'en'
            ? 'Something went wrong. Please try again.'
            : 'فيه مشكلة صارت. حاول مرة أخرى.';

        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)',
            background: result.success ? 'rgba(30,40,60,0.95)' : 'rgba(60,30,30,0.95)',
            color: '#fff',
            padding: '0.85rem 1.6rem', borderRadius: '8px',
            fontSize: '0.95rem', zIndex: '99999',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            transition: 'opacity 0.4s ease'
        });
        toast.textContent = result.success ? successMessage : errorMessage;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
        contactForm.reset();
    } catch (err) {
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';
        const errorMessage = currentLang === 'en'
            ? 'Something went wrong. Please try again.'
            : 'فيه مشكلة صارت. حاول مرة أخرى.';
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', bottom: '2rem', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(60,30,30,0.95)', color: '#fff',
            padding: '0.85rem 1.6rem', borderRadius: '8px',
            fontSize: '0.95rem', zIndex: '99999',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            transition: 'opacity 0.4s ease'
        });
        toast.textContent = errorMessage;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
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

// ── Unified Animation Loop ──
const cursor = document.getElementById('glassCursor');
const ring   = document.getElementById('glassCursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let spotX = 0, spotY = 0, scx = 0, scy = 0;
let heroMx = 0, heroMy = 0;
const heroIcons = document.querySelectorAll('.hero-icon');
const heroCurrentX = [0, 0, 0], heroCurrentY = [0, 0, 0];
let spotlight = document.getElementById('mouseSpotlight');
let unifiedRafActive = false;

function unifiedTick() {
    // Cursor ring smooth follow
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    ring.style.transform   = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';

    // Spotlight smooth follow
    scx += (spotX - scx) * 0.1;
    scy += (spotY - scy) * 0.1;
    if (spotlight) spotlight.style.transform = 'translate(' + scx + 'px,' + scy + 'px) translate(-50%,-50%)';

    // Hero icon parallax
    heroIcons.forEach(function(icon, i) {
        var speed = 0.03 + i * 0.015;
        heroCurrentX[i] += (heroMx - heroCurrentX[i]) * speed;
        heroCurrentY[i] += (heroMy - heroCurrentY[i]) * speed;
        var bx = heroCurrentX[i] * (15 + i * 8);
        var by = heroCurrentY[i] * (10 + i * 6);
        icon.style.translate = bx + 'px ' + by + 'px';
    });

    // Check if anything still needs animating
    var ringMoving = Math.abs(mx - rx) > 0.5 || Math.abs(my - ry) > 0.5;
    var spotMoving = Math.abs(spotX - scx) > 0.5 || Math.abs(spotY - scy) > 0.5;
    var heroMoving = heroIcons.length > 0 && (heroMx !== 0 || heroMy !== 0);
    if (ringMoving || spotMoving || heroMoving) {
        unifiedRafActive = true;
        requestAnimationFrame(unifiedTick);
    } else {
        unifiedRafActive = false;
    }
}

function startUnifiedLoop() {
    if (!unifiedRafActive) {
        unifiedRafActive = true;
        requestAnimationFrame(unifiedTick);
    }
}

document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    spotX = e.clientX; spotY = e.clientY;
    if (spotlight) spotlight.classList.add('active');
    startUnifiedLoop();
}, { passive: true });

// Hero icon parallax on mousemove
var heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mousemove', function(e) {
        var rect = heroSection.getBoundingClientRect();
        heroMx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        heroMy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        startUnifiedLoop();
    }, { passive: true });
    heroSection.addEventListener('mouseleave', function() { heroMx = 0; heroMy = 0; }, { passive: true });
}

document.addEventListener('mouseleave', function() {
    if (spotlight) spotlight.classList.remove('active');
});

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

// Use event delegation so it works for dynamically added videos
document.addEventListener('click', function(e) {
    var wrapper = e.target.closest('.video-wrapper[data-video]');
    if (!wrapper) return;
    e.preventDefault();
    e.stopPropagation();

    var src = wrapper.dataset.video;
    document.querySelectorAll('.video-preview').forEach(function(v) { v.pause(); });

    modalVideo.src = src;
    modalVideo.muted = true;
    try { modalVideo.currentTime = 0.01; } catch (err) {}
    modalVideo.load();
    modalVideo.play().then(function() {
        setTimeout(function() { modalVideo.muted = false; }, 300);
    }).catch(function() {});
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
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
var previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            try { video.currentTime = 0.01; } catch (err) {}
            video.play().catch(() => {});
        } else {
            try { video.currentTime = 0.01; } catch (err) {}
            video.pause();
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.video-preview').forEach(video => {
    video.classList.add('loaded');
    previewObserver.observe(video);
});

var observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

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

// Voice Players (event delegation for dynamic content)
(function () {
    var activePair = null;
    var inited = new WeakSet();

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

    function initPlayer(player) {
        if (inited.has(player)) return;
        inited.add(player);

        var btn       = player.querySelector('.voice-play-btn');
        var iconPlay  = player.querySelector('.icon-play');
        var iconPause = player.querySelector('.icon-pause');
        var durEl     = player.querySelector('.voice-duration');
        var bars      = Array.from(player.querySelectorAll('.voice-waveform span'));
        var audio     = player.querySelector('audio');
        var src       = player.getAttribute('data-src');

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

            if (activePair && activePair.audio === audio) {
                stopActive();
                return;
            }

            stopActive();
            audio.load();
            audio.play().then(function() {
                iconPlay.style.display  = 'none';
                iconPause.style.display = '';
                activePair = { audio: audio, player: player, bars: bars };
            }).catch(function(err) { console.warn('play failed', err); });
        });
    }

    // Watch for dynamically added voice players
    var obs = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
            m.addedNodes.forEach(function(node) {
                if (node.nodeType !== 1) return;
                if (node.classList && node.classList.contains('voice-player')) initPlayer(node);
                if (node.querySelectorAll) node.querySelectorAll('.voice-player').forEach(initPlayer);
            });
        });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Init any already in DOM
    document.querySelectorAll('.voice-player').forEach(initPlayer);
})();


// ── Feedback Stack Scroll ──
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

// ── Animated Stat Counters ──
(function () {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var animated = new Set();

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animated.add(entry.target);
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-target'));
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 1500;
                var startTime = null;

                function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

                function animate(now) {
                    if (!startTime) startTime = now;
                    var progress = Math.min((now - startTime) / duration, 1);
                    var value = Math.floor(easeOutCubic(progress) * target);
                    el.textContent = value + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                    else el.textContent = target + suffix;
                }

                requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { counterObserver.observe(c); });
})();

// ── Section Reveal on Scroll ──
(function () {
    var revealSections = document.querySelectorAll('section:not(.hero)');
    revealSections.forEach(function(sec) { sec.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealSections.forEach(function(sec) { revealObserver.observe(sec); });
})();

// ── Cursor Hover Classes (replaces body:has() for performance) ──
(function () {
    var cursorMap = {
        '.video-wrapper': 'cursor-video',
        '.tool-item': 'cursor-tool',
        '.cta-button': 'cursor-cta',
        '.cta-secondary': 'cursor-cta',
        '.timeline-content': 'cursor-timeline',
        '.feedback-card': 'cursor-feedback',
        'a': 'cursor-link',
        'button': 'cursor-link'
    };
    var currentClass = '';
    document.addEventListener('mouseover', function(e) {
        var el = e.target;
        while (el && el !== document.body) {
            for (var sel in cursorMap) {
                if (el.matches(sel)) {
                    if (currentClass !== cursorMap[sel]) {
                        if (currentClass) document.body.classList.remove(currentClass);
                        currentClass = cursorMap[sel];
                        document.body.classList.add(currentClass);
                    }
                    return;
                }
            }
            el = el.parentElement;
        }
        if (currentClass) { document.body.classList.remove(currentClass); currentClass = ''; }
    }, { passive: true });
    document.addEventListener('mouseout', function(e) {
        if (e.target === document.body || !e.relatedTarget) {
            if (currentClass) { document.body.classList.remove(currentClass); currentClass = ''; }
        }
    }, { passive: true });
})();
