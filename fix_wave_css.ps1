$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

# Remove the bulk .voice-player.playing .voice-waveform span rules
$css = [System.Text.RegularExpressions.Regex]::Replace(
    $css,
    '\.voice-player\.playing \.voice-waveform span \{[^}]+\}\s*\.voice-player\.playing \.voice-waveform span:nth-child\(odd\)[^}]+\}\s*\.voice-player\.playing \.voice-waveform span:nth-child\(even\)[^}]+\}\s*\.voice-player\.playing \.voice-waveform span:nth-child\(3n\)[^}]+\}',
    '/* waveform progress controlled by JS */'
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
