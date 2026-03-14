Add-Type -AssemblyName System.Runtime.InteropServices

$sampleRate = 44100
$duration   = 5        # seconds
$freq       = 440      # Hz (A4 tone)
$amplitude  = 0.3

$numSamples = $sampleRate * $duration
$samples    = New-Object short[] $numSamples

for ($i = 0; $i -lt $numSamples; $i++) {
    $t = $i / $sampleRate
    # fade in/out to avoid clicks
    $env = 1.0
    if ($t -lt 0.05) { $env = $t / 0.05 }
    elseif ($t -gt ($duration - 0.05)) { $env = ($duration - $t) / 0.05 }
    $samples[$i] = [short]([Math]::Sin(2 * [Math]::PI * $freq * $t) * $amplitude * 32767 * $env)
}

$outFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\audio\test.wav"

$stream = [System.IO.File]::OpenWrite($outFile)
$writer = New-Object System.IO.BinaryWriter($stream)

# WAV header
$dataSize   = $numSamples * 2
$writer.Write([System.Text.Encoding]::ASCII.GetBytes("RIFF"))
$writer.Write([int]($dataSize + 36))
$writer.Write([System.Text.Encoding]::ASCII.GetBytes("WAVE"))
$writer.Write([System.Text.Encoding]::ASCII.GetBytes("fmt "))
$writer.Write([int]16)           # chunk size
$writer.Write([short]1)          # PCM
$writer.Write([short]1)          # mono
$writer.Write([int]$sampleRate)
$writer.Write([int]($sampleRate * 2))  # byte rate
$writer.Write([short]2)          # block align
$writer.Write([short]16)         # bits per sample
$writer.Write([System.Text.Encoding]::ASCII.GetBytes("data"))
$writer.Write([int]$dataSize)
foreach ($s in $samples) { $writer.Write($s) }
$writer.Close()
$stream.Close()

Write-Host "WAV created: $outFile"

# Copy as all 6 client files
$base = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\audio"
1..6 | ForEach-Object {
    Copy-Item "$base\test.wav" "$base\client$_.mp3" -Force
    Write-Host "Copied client$_.mp3"
}
