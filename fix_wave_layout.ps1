$enc = [System.Text.Encoding]::UTF8

# ── CSS: make voice-player a column, waveform full width on top ──
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, $enc)

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-player \{[^}]+\}',
'.voice-player {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 12px 14px;
    width: 100%;
    margin-top: 0.5rem;
    cursor: pointer;
}')

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-waveform \{[^}]+\}',
'.voice-waveform {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2px;
    height: 44px;
}')

# Add a .voice-controls row rule if not present
if (-not ($css -match '\.voice-controls')) {
    $css = $css.Replace(
        '.voice-play-btn {',
        '.voice-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.voice-play-btn {'
    )
}

[System.IO.File]::WriteAllText($cssFile, $css, $enc)
Write-Host "CSS done"

# ── HTML: wrap play-btn + duration in .voice-controls div ──
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, $enc)

# Move waveform before controls, wrap btn+duration in .voice-controls
# Pattern: inside each .voice-player:
#   <button class="voice-play-btn">...</button>
#   <div class="voice-waveform">...</div>
#   <span class="voice-duration">...</span>
# Becomes:
#   <div class="voice-waveform">...</div>
#   <div class="voice-controls">
#     <button>...</button>
#     <span class="voice-duration">...</span>
#   </div>

$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '(<button class="voice-play-btn"[\s\S]+?</button>\s*)((<div class="voice-waveform">)[\s\S]+?(</div>)\s*)(<span class="voice-duration">[^<]*</span>)',
    '$2<div class="voice-controls">$1$5</div>'
)

[System.IO.File]::WriteAllText($htmlFile, $html, $enc)
Write-Host "HTML done"
