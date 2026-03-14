$enc = [System.Text.Encoding]::UTF8

# ── 1. Fix CSS ──
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, $enc)

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-player \{[^}]+\}',
'.voice-player {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 12px 14px;
    width: 100%;
    margin-top: 0.5rem;
    box-sizing: border-box;
}')

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-controls \{[^}]+\}',
'.voice-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}')

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-waveform \{[^}]+\}',
'.voice-waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}')

$css = [System.Text.RegularExpressions.Regex]::Replace($css,
    '\.voice-waveform span \{[^}]+\}',
'.voice-waveform span {
    flex: 1;
    border-radius: 999px;
    background: rgba(255,255,255,0.25);
    height: 4px;
    transition: background 0.15s;
    min-width: 0;
}')

[System.IO.File]::WriteAllText($cssFile, $css, $enc)
Write-Host "CSS done"

# ── 2. Fix HTML: move waveform AFTER voice-controls in every card ──
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, $enc)

# Current order: waveform div THEN voice-controls div
# Target order:  voice-controls div THEN waveform div
$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '(<div class="voice-waveform">(?:<span></span>)+</div>\s*)(<div class="voice-controls">[\s\S]+?</div>)',
    '$2' + "`n                        " + '$1'
)

[System.IO.File]::WriteAllText($htmlFile, $html, $enc)
Write-Host "HTML done"
