$file = "c:\Users\ma267\Documents\Github Projects\Portfelio SiteWeb\index.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$newSection = @'
    <!-- Client Feedback Section -->
    <section id="testimonials" class="feedback-section">
        <h2 data-en="Client Feedback" data-tn="آراء العملاء">Client Feedback</h2>
        <p class="section-subtitle" data-en="Hear directly from the brands I've worked with" data-tn="اسمع مباشرة من عملائي">Hear directly from the brands I've worked with</p>

        <div class="feedback-stack-outer" id="feedbackOuter">
            <div class="feedback-stack" id="feedbackStack">

                <div class="feedback-card" style="--i:0">
                    <div class="feedback-avatar">K</div>
                    <div class="feedback-name">Karim</div>
                    <div class="feedback-company">Digipress</div>
                    <div class="voice-player" data-src="audio/client1.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

                <div class="feedback-card" style="--i:1">
                    <div class="feedback-avatar">A</div>
                    <div class="feedback-name">Amin</div>
                    <div class="feedback-company">Kadouline</div>
                    <div class="voice-player" data-src="audio/client2.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

                <div class="feedback-card" style="--i:2">
                    <div class="feedback-avatar">S</div>
                    <div class="feedback-name">Salim</div>
                    <div class="feedback-company">Rabhani</div>
                    <div class="voice-player" data-src="audio/client3.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

                <div class="feedback-card" style="--i:3">
                    <div class="feedback-avatar">Am</div>
                    <div class="feedback-name">Amina</div>
                    <div class="feedback-company">AM Fashion</div>
                    <div class="voice-player" data-src="audio/client4.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

                <div class="feedback-card" style="--i:4">
                    <div class="feedback-avatar">O</div>
                    <div class="feedback-name">Osama</div>
                    <div class="feedback-company">SOS Village d'enfants</div>
                    <div class="voice-player" data-src="audio/client5.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

                <div class="feedback-card" style="--i:5">
                    <div class="feedback-avatar">Sn</div>
                    <div class="feedback-name">Sana</div>
                    <div class="feedback-company">Rouayam Voyage Sfax</div>
                    <div class="voice-player" data-src="audio/client6.mp3">
                        <button class="voice-play-btn" aria-label="Play">
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,3 20,12 6,21"/></svg>
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                        <div class="voice-waveform"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                        <span class="voice-duration">0:00</span>
                        <audio preload="none"></audio>
                    </div>
                    <div class="feedback-stars">★★★★★</div>
                </div>

            </div>

            <button class="fb-scroll-btn" id="fbScrollBtn" aria-label="Scroll to next">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><polyline points="6,9 12,15 18,9"/></svg>
                <span data-en="Scroll for more" data-tn="مرر للمزيد">Scroll for more</span>
            </button>
        </div>
    </section>
'@

# Find the start marker
$startMarker = '    <!-- Client Feedback Section -->'
$endMarker = '</section>'

# Find the testimonials section boundaries
$startIdx = $content.IndexOf($startMarker)
# Find the closing </section> after the start
$endIdx = $content.IndexOf($endMarker, $startIdx) + $endMarker.Length

$before = $content.Substring(0, $startIdx)
$after = $content.Substring($endIdx)

$newContent = $before + $newSection + $after
[System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "Done"
