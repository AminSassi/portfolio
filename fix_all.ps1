$html = [System.IO.File]::ReadAllText('c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html', [System.Text.Encoding]::UTF8)
$css  = [System.IO.File]::ReadAllText('c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css',  [System.Text.Encoding]::UTF8)

# ── 1. Add SVG favicon to <head> ──────────────────────────────────────────────
$faviconTag = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27><rect width=%27100%27 height=%27100%27 rx=%2718%27 fill=%27%230a1830%27/><text x=%2750%27 y=%2768%27 text-anchor=%27middle%27 font-family=%27Arial Black,Arial,sans-serif%27 font-size=%2742%27 font-weight=%27900%27 fill=%27%2360b8ff%27>AS</text></svg>">'
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "$faviconTag`r`n    <link rel=`"stylesheet`" href=`"style.css`">")

# ── 2. Fix voice player HTML — wrap btn in .voice-controls, expand to 30 spans ─
$waveSpans30 = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>'
$waveSpans15 = '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>'

# Fix each voice-player block: wrap btn+duration in .voice-controls, fix waveform spans
$oldVP = '<button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform">' + $waveSpans15 + '</div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="metadata"></audio>'

$newVP = '<div class="voice-controls"><button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <span class="voice-duration">0:00</span></div>
                        <div class="voice-waveform">' + $waveSpans30 + '</div>
                        <audio preload="metadata"></audio>'

# Replace all 6 occurrences
$count = 0
while ($html.Contains($oldVP)) {
    $html = $html.Replace($oldVP, $newVP)
    $count++
    if ($count -gt 10) { break }
}
Write-Output "Voice player blocks fixed: $count"

[System.IO.File]::WriteAllText('c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html', $html, [System.Text.Encoding]::UTF8)

# ── 3. Fix CSS — remove stray broken keyframe fragment + duplicate card rule + stray } ──
# Remove the stray broken fragment between the two duplicate .feedback-stack .feedback-card blocks
$css = $css.Replace(
'    to   { transform: scale(0.94) translateY(-10px); opacity: 0.75; }
}


.feedback-stack .feedback-card {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    flex-shrink: 0;
    background: #0d1525 !important;
    border-color: rgba(255,255,255,0.12);
    opacity: 1 !important;
    margin-bottom: 1rem;
    z-index: 1;
    transition: box-shadow 0.3s;
}',
'')

# Remove the stray closing } at the very end of the file
$css = $css.TrimEnd()
if ($css.EndsWith('}')) {
    # check if it's the extra one after the media query
    $lastMedia = $css.LastIndexOf('@media (max-width: 600px)')
    $lastBrace = $css.LastIndexOf('}')
    $secondLast = $css.LastIndexOf('}', $lastBrace - 1)
    # The media query block ends at secondLast, the extra } is at lastBrace
    $css = $css.Substring(0, $lastBrace).TrimEnd() + "`n"
}

[System.IO.File]::WriteAllText('c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css', $css, [System.Text.Encoding]::UTF8)
Write-Output "CSS fixed"
