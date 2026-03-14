$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css'
$css = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Replace the entire voice-player + voice-controls + waveform + span block in one shot
# Use regex with SINGLELINE so . matches newlines
$pattern = '(?s)/\* ── Voice Player ──.*?\.voice-play-btn:hover \{.*?\}'

$replacement = @'
/* ── Voice Player ── */
.voice-player {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 10px 14px;
    width: 100%;
    margin-top: 0.5rem;
    box-sizing: border-box;
}

.voice-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.voice-play-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;
    background: rgba(96,184,255,0.2);
    border: 1px solid rgba(96,184,255,0.4);
    color: #60b8ff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: none;
    transition: background 0.2s, transform 0.2s var(--spring);
    padding: 0;
}

.voice-play-btn:hover {
    background: rgba(96,184,255,0.35);
    transform: scale(1.1);
}
'@

$css2 = [System.Text.RegularExpressions.Regex]::Replace($css, $pattern, $replacement)

if ($css2 -eq $css) {
    Write-Output "WARN: voice-player block not matched"
} else {
    Write-Output "OK: voice-player block replaced"
}

# Now replace the waveform block
$pattern2 = '(?s)/\* ── Waveform ──.*?\.voice-waveform span \{.*?\}'

$replacement2 = @'
/* ── Waveform ── */
.voice-waveform {
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    height: 44px;
    overflow: hidden;
}

.voice-waveform span {
    width: 3px;
    flex-shrink: 0;
    border-radius: 2px;
    background: rgba(255,255,255,0.22);
    transition: background 0.15s;
}
'@

$css3 = [System.Text.RegularExpressions.Regex]::Replace($css2, $pattern2, $replacement2)

if ($css3 -eq $css2) {
    Write-Output "WARN: waveform block not matched"
} else {
    Write-Output "OK: waveform block replaced"
}

[System.IO.File]::WriteAllText($f, $css3, [System.Text.Encoding]::UTF8)
Write-Output "File written"
