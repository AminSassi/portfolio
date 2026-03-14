$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

$old = @'
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

$new = @'
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

        // JS fallback for scroll-driven stack effect
        cards.forEach(card => {
            const cardTop    = card.offsetTop - scrollTop;
            const cardBottom = cardTop + card.offsetHeight;
            // how far the card has scrolled past the top of the container
            const exitRatio  = Math.max(0, Math.min(1, -cardTop / (card.offsetHeight * 0.4)));
            const scale      = 1 - exitRatio * 0.06;
            const opacity    = 1 - exitRatio * 0.25;
            const ty         = exitRatio * -10;
            card.style.transform = `scale(${scale}) translateY(${ty}px)`;
            card.style.opacity   = opacity;
        });
    }

    stack.addEventListener('scroll', updateStack, { passive: true });
    updateStack();
})();
'@

$js = $js.Replace($old, $new)
[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "JS done"
