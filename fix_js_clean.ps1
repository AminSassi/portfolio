$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

# Remove the cards.forEach block that sets opacity/transform
$js = [System.Text.RegularExpressions.Regex]::Replace(
    $js,
    '\s+// JS fallback for scroll-driven stack effect\s+cards\.forEach\(card => \{[\s\S]+?card\.style\.opacity\s+=\s+"1";\s+\}\);',
    ''
)

[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "done"
