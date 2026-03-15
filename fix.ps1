$content = [System.IO.File]::ReadAllText('index.html')
$idx = $content.IndexOf('feedbackStack')
$chunk = $content.Substring($idx, 2500)
[System.IO.File]::WriteAllText('chunk.txt', $chunk)
