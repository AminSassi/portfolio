$enc  = [System.Text.Encoding]::UTF8
$htmlFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$html = [System.IO.File]::ReadAllText($htmlFile, $enc)

# Replace only the second occurrence of the soundhelix URL (card 2 = Amin/Kadouline)
$testUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
$localUrl = "audio/client2.mp3"

$idx = $html.IndexOf($testUrl)                      # first card
$idx = $html.IndexOf($testUrl, $idx + $testUrl.Length)  # second card
$html = $html.Substring(0, $idx) + $localUrl + $html.Substring($idx + $testUrl.Length)

[System.IO.File]::WriteAllText($htmlFile, $html, $enc)
Write-Host "done"
