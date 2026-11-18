(function (root) {
    'use strict'

    function playAudio(audio) {
        return audio.play().catch(error => {
            if (error.name !== 'AbortError') console.warn('Audio playback failed:', error)
        })
    }

    if (typeof module !== 'undefined' && module.exports) module.exports = { playAudio }
    else root.SchoolFightAudio = { playAudio }
})(globalThis)
