$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

$css = $css.Replace(
    "    /* scroll-driven: shrink + fade as card scrolls out the top */`r`n    animation: stackCard linear both;`r`n    animation-timeline: view();`r`n    animation-range: exit-crossing 0% exit-crossing 40%;`r`n",
    ""
)
$css = $css.Replace(
    "    /* scroll-driven: shrink + fade as card scrolls out the top */`n    animation: stackCard linear both;`n    animation-timeline: view();`n    animation-range: exit-crossing 0% exit-crossing 40%;`n",
    ""
)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
