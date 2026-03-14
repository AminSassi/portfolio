$enc  = [System.Text.Encoding]::UTF8
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, $enc)

$html = $html.Replace(
    'data-src="audio/client2.mp3"',
    'data-src="https://res.cloudinary.com/dldy0enia/video/upload/v1773528536/kadolinevs_hscsky.mp3"'
)

[System.IO.File]::WriteAllText($htmlFile, $html, $enc)
Write-Host "done"
