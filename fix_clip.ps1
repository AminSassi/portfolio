$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

$css = $css.Replace(
    "    padding-bottom: 2rem;",
    "    padding-top: 12px;`r`n    padding-bottom: 2rem;"
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
