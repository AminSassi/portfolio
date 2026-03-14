$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

$old = '            const scale      = 1 - exitRatio * 0.06;
            const opacity    = 1 - exitRatio * 0.25;
            const ty         = exitRatio * -10;
            card.style.transform = `scale(${scale}) translateY(${ty}px)`;
            card.style.opacity   = opacity;'

$new = '            const scale = 1 - exitRatio * 0.05;
            const ty    = exitRatio * -10;
            card.style.transform = `scale(${scale}) translateY(${ty}px)`;
            card.style.opacity   = "1";'

$js = $js.Replace($old, $new)
[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "done"
