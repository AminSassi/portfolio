$enc  = [System.Text.Encoding]::UTF8
$html = [System.IO.File]::ReadAllText("c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html", $enc)

# Test MP3 - a real publicly hosted short audio file
$testMp3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

# Replace every  data-src="audio/clientN.mp3"  AND the empty <audio preload="none"></audio>
# with a direct <audio> src so the browser can actually load it
for ($i = 1; $i -le 6; $i++) {
    $html = $html.Replace(
        "data-src=""audio/client$i.mp3""",
        "data-src=""$testMp3"""
    )
}

# Make sure every <audio preload="none"></audio> becomes <audio preload="metadata"></audio>
$html = $html.Replace('<audio preload="none"></audio>', '<audio preload="metadata"></audio>')

[System.IO.File]::WriteAllText("c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html", $html, $enc)
Write-Host "HTML done"

# ── Rewrite voice player JS completely ──
$jsPath = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsPath, $enc)

# Find and replace the entire voice players block
$blockStart = $js.IndexOf("// Voice Players")
$blockEnd   = $js.IndexOf("})();", $blockStart) + 5

$newBlock = @'
// Voice Players
(function () {
    let activePair = null; // { audio, player, bars }

    function fmt(s) {
        if (!isFinite(s) || s < 0) return '0:00';
        return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    function setWave(bars, progress) {
        var filled = Math.floor(progress * bars.length);
        bars.forEach(function(bar, i) {
            if (i < filled) {
                bar.style.background = '#60b8ff';
                bar.style.animationName = 'none';
            } else if (i === filled) {
                bar.style.background = '#60b8ff';
                bar.style.animationName = 'waveBar';
                bar.style.animationDuration = '0.7s';
                bar.style.animationTimingFunction = 'ease-in-out';
                bar.style.animationIterationCount = 'infinite';
            } else {
                bar.style.background = 'rgba(255,255,255,0.25)';
                bar.style.animationName = 'none';
            }
        });
    }

    function resetWave(bars) {
        bars.forEach(function(bar) {
            bar.style.background = 'rgba(255,255,255,0.25)';
            bar.style.animationName = 'none';
        });
    }

    function stopActive() {
        if (!activePair) return;
        activePair.audio.pause();
        activePair.player.querySelector('.icon-play').style.display = '';
        activePair.player.querySelector('.icon-pause').style.display = 'none';
        resetWave(activePair.bars);
        activePair = null;
    }

    document.querySelectorAll('.voice-player').forEach(function(player) {
        var btn       = player.querySelector('.voice-play-btn');
        var iconPlay  = player.querySelector('.icon-play');
        var iconPause = player.querySelector('.icon-pause');
        var durEl     = player.querySelector('.voice-duration');
        var bars      = Array.from(player.querySelectorAll('.voice-waveform span'));
        var audio     = player.querySelector('audio');
        var src       = player.getAttribute('data-src');

        // set src directly
        audio.src = src;

        audio.addEventListener('loadedmetadata', function() {
            durEl.textContent = fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', function() {
            durEl.textContent = fmt(audio.duration - audio.currentTime);
            if (audio.duration > 0) setWave(bars, audio.currentTime / audio.duration);
        });

        audio.addEventListener('ended', function() {
            iconPlay.style.display  = '';
            iconPause.style.display = 'none';
            durEl.textContent = fmt(audio.duration);
            resetWave(bars);
            activePair = null;
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // clicking the active player = pause it
            if (activePair && activePair.audio === audio) {
                stopActive();
                return;
            }

            // stop whatever else is playing
            stopActive();

            // play this one
            audio.play().catch(function(err) { console.warn('play failed', err); });
            iconPlay.style.display  = 'none';
            iconPause.style.display = '';
            activePair = { audio: audio, player: player, bars: bars };
        });
    });
})();
'@

$js = $js.Substring(0, $blockStart) + $newBlock + $js.Substring($blockEnd)
[System.IO.File]::WriteAllText($jsPath, $js, $enc)
Write-Host "JS done"
