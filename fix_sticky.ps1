$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

$css = [System.Text.RegularExpressions.Regex]::Replace(
    $css,
    '\.feedback-stack \.feedback-card \{[^}]+\}',
    '.feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    background: #0d1525 !important;
    border-color: rgba(255,255,255,0.12);
    opacity: 1 !important;
    margin-bottom: 1rem;
    z-index: 1;
    transition: box-shadow 0.3s;
}'
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
