$cssFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\style.css"
$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

# Remove the @keyframes stackCard block
$start = $css.IndexOf("@keyframes stackCard {")
$end   = $css.IndexOf("}", $start) + 1
$css   = $css.Substring(0, $start) + $css.Substring($end)

# Also make sure .feedback-card base has no opacity/transform that could interfere
# The existing .feedback-card rule has opacity:0 + transform for the fade-in observer
# Override it for cards inside the stack
$extra = "`n.feedback-stack .feedback-card { opacity: 1 !important; }`n"
$insertAt = $css.IndexOf(".fb-scroll-btn {")
$css = $css.Substring(0, $insertAt) + $extra + $css.Substring($insertAt)

[System.IO.File]::WriteAllText($cssFile, $css, [System.Text.Encoding]::UTF8)
Write-Host "done"
