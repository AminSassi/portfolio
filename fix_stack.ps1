# ── CSS: replace carousel block with stack block ──
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

$startMarker = "/* -- Feedback Carousel --"
$idx = $css.IndexOf("/* `u2500`u2500 Feedback Carousel `u2500`u2500 */")
if ($idx -lt 0) {
    # try with actual unicode dashes
    $idx = $css.IndexOf([char]0x2F + [char]0x2A + " " + [char]0x2500 + [char]0x2500 + " Feedback Carousel")
}
if ($idx -lt 0) {
    # fallback: search for the unique class name
    $idx = $css.IndexOf(".feedback-carousel-wrapper {")
    # walk back to find the comment line start
    $commentStart = $css.LastIndexOf("/*", $idx)
    if ($commentStart -ge 0) { $idx = $commentStart }
}

# find end: last rule in the block ends with the mobile override closing brace
# search for ".fb-nav { width: 36px" then find its closing }
$endSearch = ".fb-nav { width: 36px"
$endIdx = $css.IndexOf($endSearch, $idx)
# find the closing } after that
$endIdx = $css.IndexOf("}", $endIdx) + 1

$newCSS = @'

/* -- Feedback Vertical Stack Scroll -- */
.feedback-stack-outer {
    position: relative;
    margin-top: 2.5rem;
}

.feedback-stack {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 340px;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    perspective: 800px;
    padding-bottom: 2rem;
}

.feedback-stack::-webkit-scrollbar { display: none; }

.feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--i) * 18px);
    animation: stackCard linear both;
    animation-timeline: scroll(self);
    animation-range: entry 0% exit 30%;
    opacity: 1;
    transform: translateY(0);
    margin-bottom: -12px;
    z-index: calc(10 + var(--i));
    transition: box-shadow 0.3s, background 0.3s;
}

@keyframes stackCard {
    from { transform: scale(1) translateY(0);    opacity: 1; }
    to   { transform: scale(0.9) translateY(-8px); opacity: 0.55; }
}

.fb-scroll-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 1.4rem auto 0;
    padding: 0.65rem 1.5rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 999px;
    color: rgba(255,255,255,0.65);
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    cursor: none;
    transition: background 0.2s, color 0.2s, transform 0.2s var(--spring);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.fb-scroll-btn svg {
    animation: bounceArrow 1.6s ease-in-out infinite;
}

@keyframes bounceArrow {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(4px); }
}

.fb-scroll-btn:hover {
    background: rgba(255,255,255,0.13);
    color: #fff;
    transform: translateY(-2px);
}

.fb-scroll-btn.hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(6px);
    transition: opacity 0.3s, transform 0.3s;
}

@media (max-width: 600px) {
    .feedback-stack { max-height: 300px; }
}
'@

$css = $css.Substring(0, $idx) + $newCSS + $css.Substring($endIdx)
[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "CSS done"

# ── JS: replace carousel IIFE ──
$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

$jsStart = $js.IndexOf("// -- Feedback Carousel --")
if ($jsStart -lt 0) {
    $jsStart = $js.IndexOf([char]0x2F + [char]0x2F + " " + [char]0x2500 + [char]0x2500 + " Feedback Carousel")
}
if ($jsStart -lt 0) {
    $jsStart = $js.IndexOf("(function () {" + [char]10 + "    const track   = document.getElementById('feedbackTrack')")
    if ($jsStart -lt 0) {
        $jsStart = $js.IndexOf("const track   = document.getElementById('feedbackTrack')")
        $jsStart = $js.LastIndexOf("(function", $jsStart)
    }
}

# find the closing })(); of that IIFE
$jsEnd = $js.IndexOf("})();", $jsStart) + 5

$newJS = @'

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

$js = $js.Substring(0, $jsStart) + $newJS + $js.Substring($jsEnd)
[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "JS done"
