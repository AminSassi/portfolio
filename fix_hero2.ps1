$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html'
$html = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Remove the Designer span and the &amp; span entirely
$html = [System.Text.RegularExpressions.Regex]::Replace(
    $html,
    '(?s)\s*<span data-en="Designer"[^>]*>Designer</span>\s*<span class="hero-amp">&amp;</span>',
    ''
)

if ($html -match 'Designer') { Write-Output "WARN: Designer still present" } else { Write-Output "OK" }
[System.IO.File]::WriteAllText($f, $html, [System.Text.Encoding]::UTF8)
