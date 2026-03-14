$jsFile = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\script.js"
$js = [System.IO.File]::ReadAllText($jsFile, [System.Text.Encoding]::UTF8)

# Replace the entire Voice Players IIFE
$startMarker = "// " + [char]0x2500 + [char]0x2500 + " Voice Players " + [char]0x2500 + [char]0x2500
$start = $js.IndexOf($startMarker)
if ($start -lt 0) { $start = $js.IndexOf("Voice Players") - 3 }

# find the closing })(); of that IIFE
$iife_end = $js.IndexOf("})();", $start) + 5

$newVoice = @'
// Voice Players
(function () {
    let activePlayer = null;
    let activeAudio  = null;

    function fmt(s) {
        const m = Math.floor(s / 60);
        return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    }

    function updateWaveform(bars, audio) {
        if (!audio.duration || !isFinite(audio.duration)) return;
        const progress = audio.currentTime / audio.duration;
        const filled   = Math.floor(progress * bars.length);
        bars.forEach((bar, i) => {
            if (i < filled) {
                bar.style.background = '#60b8ff';
                bar.style.animation  = 'none';
            } else if (i === filled) {
                bar.style.background = '#60b8ff';
                bar.style.animation  = 'waveBar 0.7s ease-in-out infinite';
                bar.style.animationDelay = '0s';
            } else {
                bar.style.background = 'rgba(255,255,255,0.25)';
                bar.style.animation  = 'none';
            }
        });
    }

    function resetWaveform(bars) {
        bars.forEach(bar => {
            bar.style.background = 'rgba(255,255,255,0.25)';
            bar.style.animation  = 'none';
        });
    }

    document.querySelectorAll('.voice-player').forEach(player => {
        const btn      = player.querySelector('.voice-play-btn');
        const iconPlay = btn.querySelector('.icon-play');
        const iconPause= btn.querySelector('.icon-pause');
        const durEl    = player.querySelector('.voice-duration');
        const bars     = Array.from(player.querySelectorAll('.voice-waveform span'));
        const audio    = player.querySelector('audio');

        audio.src     = player.dataset.src;
        audio.preload = 'none';

        audio.addEventListener('loadedmetadata', () => {
            if (isFinite(audio.duration)) durEl.textContent = fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            if (isFinite(audio.duration)) {
                durEl.textContent = fmt(audio.duration - audio.currentTime);
                updateWaveform(bars, audio);
            }
        });

        audio.addEventListener('ended', () => {
            player.classList.remove('playing');
            iconPlay.style.display  = '';
            iconPause.style.display = 'none';
            durEl.textContent = fmt(audio.duration || 0);
            resetWaveform(bars);
            activePlayer = null;
            activeAudio  = null;
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (activeAudio && activeAudio !== audio) {
                activeAudio.pause();
                activePlayer.classList.remove('playing');
                activePlayer.querySelector('.icon-play').style.display  = '';
                activePlayer.querySelector('.icon-pause').style.display = 'none';
                resetWaveform(Array.from(activePlayer.querySelectorAll('.voice-waveform span')));
                activePlayer = null;
                activeAudio  = null;
            }

            if (audio.paused) {
                audio.play().catch(() => {});
                player.classList.add('playing');
                iconPlay.style.display  = 'none';
                iconPause.style.display = '';
                activePlayer = player;
                activeAudio  = audio;
            } else {
                audio.pause();
                player.classList.remove('playing');
                iconPlay.style.display  = '';
                iconPause.style.display = 'none';
                activePlayer = null;
                activeAudio  = null;
            }
        });
    });

    // fade-in cards on scroll
    const fbObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                fbObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.feedback-card').forEach(card => fbObserver.observe(card));
})();
'@

$js = $js.Substring(0, $start) + $newVoice + $js.Substring($iife_end)
[System.IO.File]::WriteAllText($jsFile, $js, [System.Text.Encoding]::UTF8)
Write-Host "done"
