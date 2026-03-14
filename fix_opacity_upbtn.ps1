# ── CSS fixes ──
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

# 1. Fix opacity in keyframes
$css = $css.Replace(
    "    to   { transform: scale(0.9) translateY(-8px); opacity: 0.55; }",
    "    to   { transform: scale(0.96) translateY(-6px); opacity: 0.88; }"
)

# 2. Add up-button styles after .fb-scroll-btn.hidden block
$upStyles = @'

.fb-scroll-up {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0 auto 1rem;
    padding: 0.65rem 1.5rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 999px;
    color: rgba(255,255,255,0.65);
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    cursor: none;
    transition: background 0.2s, color 0.2s, transform 0.2s var(--spring), opacity 0.3s;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    pointer-events: none;
}

.fb-scroll-up svg { animation: bounceArrowUp 1.6s ease-in-out infinite; }

@keyframes bounceArrowUp {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-4px); }
}

.fb-scroll-up:hover { background: rgba(255,255,255,0.13); color: #fff; }

.fb-scroll-up.visible { opacity: 1; pointer-events: all; }
'@

$css = $css.Replace(
    ".fb-scroll-btn.hidden {",
    $upStyles + "`n`n.fb-scroll-btn.hidden {"
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "CSS done"

# ── HTML: add up button above the stack ──
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)

$upBtn = '            <button class="fb-scroll-up" id="fbScrollUp" aria-label="Scroll up">' + "`n" +
         '                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="6,15 12,9 18,15"/></svg>' + "`n" +
         '                <span data-en="Back to top" data-tn="للأعلى">Back to top</span>' + "`n" +
         '            </button>' + "`n"

$html = $html.Replace(
    '        <div class="feedback-stack-outer" id="feedbackOuter">',
    '        <div class="feedback-stack-outer" id="feedbackOuter">' + "`n" + $upBtn
)

[System.IO.File]::WriteAllText($htmlFile, $html, [System.Text.Encoding]::UTF8)
Write-Host "HTML done"

# ── JS: update scroll handler to also control up button ──
$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

$oldJS = @'
// -- Feedback Stack Scroll --
(function () {
    const stack  = document.getElementById('feedbackStack');
    const btn    = document.getElementById('fbScrollBtn');
    if (!stack || !btn) return;

    const cards  = Array.from(stack.querySelectorAll('.feedback-card'));
    const cardH  = () => cards[0] ? cards[0].offsetHeight : 220;

    btn.addEventListener('click', () => {
        stack.scrollBy({ top: cardH(), behavior: 'smooth' });
    });

    stack.addEventListener('scroll', () => {
        const atEnd = stack.scrollTop + stack.clientHeight >= stack.scrollHeight - 8;
        btn.classList.toggle('hidden', atEnd);
    }, { passive: true });
})();
'@

$newJS = @'
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

    stack.addEventListener('scroll', () => {
        const atEnd   = stack.scrollTop + stack.clientHeight >= stack.scrollHeight - 8;
        const atStart = stack.scrollTop < 8;
        btnDn.classList.toggle('hidden', atEnd);
        if (btnUp) btnUp.classList.toggle('visible', !atStart);
    }, { passive: true });
})();
'@

$js = $js.Replace($oldJS, $newJS)
[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "JS done"
