$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css'
$css = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

$old = '    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 340px;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    perspective: 800px;'

$new = '    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    max-height: 340px;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    perspective: 800px;'

$css = $css.Replace($old, $new)

if ($css -match 'align-items: center') { Write-Output "OK" } else { Write-Output "WARN: not matched" }

[System.IO.File]::WriteAllText($f, $css, [System.Text.Encoding]::UTF8)
