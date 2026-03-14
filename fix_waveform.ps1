$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css'
$css = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# 1. Fix .voice-player — single row
$old = '.voice-player {
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
}'
$new = '.voice-player {
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
}'
$css = $css.Replace($old, $new)

# 2. Fix .voice-controls — no width:100%, flex-shrink:0
$old2 = '.voice-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
}'
$new2 = '.voice-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}'
$css = $css.Replace($old2, $new2)

# 3. Fix .voice-waveform — flex:1, no width:100%
$old3 = '.voice-waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}'
$new3 = '.voice-waveform {
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 1;
    height: 44px;
    overflow: hidden;
}'
$css = $css.Replace($old3, $new3)

# 4. Fix .voice-waveform span — thin bars, 3px wide, border-radius 2px
$old4 = '.voice-waveform span {
    flex: 1;
    border-radius: 999px;
    background: rgba(255,255,255,0.25);
    height: 4px;
    transition: background 0.15s;
    min-width: 0;
}'
$new4 = '.voice-waveform span {
    width: 3px;
    flex-shrink: 0;
    border-radius: 2px;
    background: rgba(255,255,255,0.22);
    transition: background 0.15s;
}'
$css = $css.Replace($old4, $new4)

[System.IO.File]::WriteAllText($f, $css, [System.Text.Encoding]::UTF8)
Write-Output "Done"
