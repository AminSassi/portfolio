$enc = [System.Text.Encoding]::UTF8

# ── 1. CSS: remove opacity:0 and transform from .feedback-card base rule ──
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, $enc)

# Remove the opacity:0 and transform:translateY lines from .feedback-card
$css = $css -replace '(\s+opacity: 0;\r?\n\s+transform: translateY\(28px\);)', ''

[System.IO.File]::WriteAllText($cssFile, $css, $enc)
Write-Host "CSS done"

# ── 2. HTML: fix garbled stars and Arabic text ──
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, $enc)

# Fix garbled stars (whatever encoding they became) → proper unicode star x5
# The garbled form varies, replace all feedback-stars content
$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '(<div class="feedback-stars">)[^<]*(</div>)',
    '$1&#9733;&#9733;&#9733;&#9733;&#9733;$2'
)

# Fix garbled Arabic in scroll button
$html = $html -replace 'data-tn="[^"]*مرر[^"]*"', 'data-tn="مرر للمزيد"'
$html = $html -replace 'data-tn="[^"]*للأعلى[^"]*"', 'data-tn="للأعلى"'

[System.IO.File]::WriteAllText($htmlFile, $html, $enc)
Write-Host "HTML done"
