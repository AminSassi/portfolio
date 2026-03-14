$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css'
$css = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# 1. Shrink card padding from 2rem to 1.1rem and add max-width
$old1 = '    border-radius: 24px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    transition: transform 0.35s var(--spring), box-shadow 0.35s, background 0.3s;
}'
$new1 = '    border-radius: 20px;
    padding: 1.1rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    max-width: 340px;
    width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    transition: transform 0.35s var(--spring), box-shadow 0.35s, background 0.3s;
}'
$css = $css.Replace($old1, $new1)

# 2. Shrink voice player padding and cap height
$old2 = '    border-radius: 18px;
    padding: 10px 14px;
    width: 100%;
    margin-top: 0.5rem;
    box-sizing: border-box;
}'
$new2 = '    border-radius: 12px;
    padding: 7px 10px;
    width: 100%;
    margin-top: 0.25rem;
    box-sizing: border-box;
}'
$css = $css.Replace($old2, $new2)

# 3. Shrink waveform height from 44px to 32px
$old3 = '    flex: 1;
    height: 44px;
    overflow: hidden;
}'
$new3 = '    flex: 1;
    height: 32px;
    overflow: hidden;
}'
$css = $css.Replace($old3, $new3)

# 4. Shrink play button from 36px to 28px
$old4 = '    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;'
$new4 = '    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;'
$css = $css.Replace($old4, $new4)

# 5. Cap bar heights to match new 32px container (scale down from 44px max)
$old5 = '.voice-waveform span:nth-child(8)  { height: 44px; }'
$new5 = '.voice-waveform span:nth-child(8)  { height: 30px; }'
$css = $css.Replace($old5, $new5)

# Scale all bar heights proportionally (44->30, ratio ~0.68)
$heights = @{
    1=8; 2=10; 3=16; 4=22; 5=12; 6=26; 7=18; 8=30; 9=20; 10=24;
    11=10; 12=30; 13=22; 14=16; 15=30; 16=24; 17=18; 18=30; 19=12; 20=22;
    21=26; 22=16; 23=20; 24=30; 25=10; 26=24; 27=18; 28=12; 29=8; 30=6
}

foreach ($n in 1..30) {
    $h = $heights[$n]
    # match any existing height for this nth-child
    $pattern = "\.voice-waveform span:nth-child\($n\) \{ height: \d+px; \}"
    $replacement = ".voice-waveform span:nth-child($n) { height: ${h}px; }"
    $css = [System.Text.RegularExpressions.Regex]::Replace($css, $pattern, $replacement)
}

[System.IO.File]::WriteAllText($f, $css, [System.Text.Encoding]::UTF8)
Write-Output "Done"
