(function (root) {
    'use strict'

    const songBpm = 115

    const timing = Object.freeze({
        approachMs: 1500,
        hitWindowMs: 150,
        perfectMs: 40,
        goodMs: 60,
        okayMs: 80,
        bpm: songBpm,
        beatOffsetMs: 60000 / songBpm,
    })

    function notePosition(hitTimeMs, songTimeMs, startY, hitLineY) {
        const progress = Math.max(0, (songTimeMs - hitTimeMs + timing.approachMs) / timing.approachMs)
        return startY + (hitLineY - startY) * progress
    }

    function inputSongTime({ currentTimeSec, playbackRate = 1, eventTimestamp, now, timeOrigin = 0 }) {
        const timestamp = timeOrigin > 0 && eventTimestamp >= timeOrigin ? eventTimestamp - timeOrigin : eventTimestamp
        const age = Number.isFinite(timestamp) ? Math.max(0, now - timestamp) : 0
        return Math.max(0, currentTimeSec * 1000 - age * playbackRate)
    }

    function closestNote(notes, songTimeMs) {
        let closest = null
        let smallestDifference = Infinity
        for (const note of notes) {
            if (note.hit || note.missed) continue
            const difference = Math.abs(songTimeMs - note.perfectHitTimeMs)
            if (difference <= timing.hitWindowMs && difference < smallestDifference) {
                closest = note
                smallestDifference = difference
            }
        }
        return closest
    }

    function judgeHit(differenceMs) {
        const difference = Math.abs(differenceMs)
        if (difference > timing.hitWindowMs) return null
        if (difference <= timing.perfectMs) return { label: 'Perfect!', score: 100, color: '#00FF00', damage: 0 }
        if (difference <= timing.goodMs) return { label: 'Good!', score: 50, color: '#FFFF00', damage: 0 }
        if (difference <= timing.okayMs) return { label: 'Okay.', score: 20, color: '#FFA500', damage: 0 }
        return { label: 'Poor!', score: 5, color: '#FF4500', damage: 2 }
    }

    function isMissed(hitTimeMs, songTimeMs) {
        return songTimeMs - hitTimeMs > timing.hitWindowMs
    }

    const rhythm = { timing, notePosition, inputSongTime, closestNote, judgeHit, isMissed }
    if (typeof module !== 'undefined' && module.exports) module.exports = rhythm
    else root.SchoolFightRhythm = rhythm
})(globalThis)
