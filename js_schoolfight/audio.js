(function (root) {
    'use strict'

    function playAudio(audio) {
        return audio.play().catch(error => {
            // Restarting or stopping a sound can cancel an outstanding play request.
            if (error.name !== 'AbortError') console.warn('Audio playback failed:', error)
        })
    }

    if (typeof module !== 'undefined' && module.exports) module.exports = { playAudio }
    else root.SchoolFightAudio = { playAudio }
})(globalThis)
