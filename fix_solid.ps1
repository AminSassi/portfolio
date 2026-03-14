$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

# 1. Give stack cards a solid background so they are never see-through
$old = ".feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--i) * 18px);
    opacity: 1;
    transform: translateY(0);
    margin-bottom: -12px;
    z-index: calc(10 + var(--i));
    transition: box-shadow 0.3s, background 0.3s;
}"

$new = ".feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    /* solid background — no see-through layering */
    background: #0d1525;
    border-color: rgba(255,255,255,0.12);
    opacity: 1 !important;
    margin-bottom: 1rem;
    z-index: 1;
    transition: box-shadow 0.3s;
}"

$css = $css.Replace($old, $new)
[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
