$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

# Fix the card animation block - use view() timeline so each card animates as it enters/exits the scroll viewport
$old = ".feedback-stack .feedback-card {
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
}"

$new = ".feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--i) * 18px);
    /* scroll-driven: shrink + fade as card scrolls out the top */
    animation: stackCard linear both;
    animation-timeline: view();
    animation-range: exit-crossing 0% exit-crossing 40%;
    opacity: 1;
    transform: translateY(0);
    margin-bottom: -12px;
    z-index: calc(10 + var(--i));
    transition: box-shadow 0.3s, background 0.3s;
}"

$css = $css.Replace($old, $new)

# Fix keyframe - cards that scroll behind should scale down slightly and stay very visible
$css = $css.Replace(
    "    to   { transform: scale(0.96) translateY(-6px); opacity: 0.88; }",
    "    to   { transform: scale(0.94) translateY(-10px); opacity: 0.75; }"
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "CSS fixed"
