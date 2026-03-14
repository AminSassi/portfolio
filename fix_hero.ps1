$f = 'c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html'
$html = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

$old = '                        <span data-en="Designer" data-tn="????\">Designer</span>
                        <span class="hero-amp">&amp;</span>
                        <span data-en="Video Editor" data-tn="?????? ?????\">Video Editor</span>'

$new = '                        <span data-en="Video Editor" data-tn="?????? ?????\">Video Editor</span>'

$result = $html.Replace($old, $new)
if ($result -eq $html) { Write-Output "WARN: not matched" } else { Write-Output "OK" }
[System.IO.File]::WriteAllText($f, $result, [System.Text.Encoding]::UTF8)
