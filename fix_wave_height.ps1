$enc = [System.Text.Encoding]::UTF8
$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, $enc)

# Make player taller
$css = $css.Replace(
    "    padding: 10px 16px;",
    "    padding: 14px 16px;"
)

# Make waveform fill full height
$css = $css.Replace(
    "    gap: 2px;`r`n    height: 32px;`r`n    min-width: 0;",
    "    gap: 2px;`r`n    height: 44px;`r`n    min-width: 0;`r`n    align-self: stretch;"
)
$css = $css.Replace(
    "    gap: 2px;`n    height: 32px;`n    min-width: 0;",
    "    gap: 2px;`n    height: 44px;`n    min-width: 0;`n    align-self: stretch;"
)

# Make bars fill full height of waveform container
$css = $css.Replace(
    "    flex: 1;`r`n    min-width: 2px;`r`n    max-width: 6px;`r`n    border-radius: 999px;`r`n    background: rgba(255,255,255,0.25);`r`n    height: 6px;`r`n    transition: background 0.15s;",
    "    flex: 1;`r`n    min-width: 2px;`r`n    max-width: 6px;`r`n    border-radius: 999px;`r`n    background: rgba(255,255,255,0.25);`r`n    height: 4px;`r`n    transition: background 0.15s;"
)
$css = $css.Replace(
    "    flex: 1;`n    min-width: 2px;`n    max-width: 6px;`n    border-radius: 999px;`n    background: rgba(255,255,255,0.25);`n    height: 6px;`n    transition: background 0.15s;",
    "    flex: 1;`n    min-width: 2px;`n    max-width: 6px;`n    border-radius: 999px;`n    background: rgba(255,255,255,0.25);`n    height: 4px;`n    transition: background 0.15s;"
)

# Scale bar heights proportionally to fill the 44px container
$heights = @(10,16,24,34,20,40,28,44,32,38,18,44,34,24,44,38,28,44,20,34,40,24,32,44,18,38,28,20,14,8)
for ($i = 0; $i -lt $heights.Length; $i++) {
    $n = $i + 1
    # replace old height with new
    $css = [System.Text.RegularExpressions.Regex]::Replace(
        $css,
        "\.voice-waveform span:nth-child\($n\) \{ height: \d+px; \}",
        ".voice-waveform span:nth-child($n) { height: $($heights[$i])px; }"
    )
}

[System.IO.File]::WriteAllText($cssFile, $css, $enc)
Write-Host "done"
