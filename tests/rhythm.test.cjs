const { test } = require('node:test')
const assert = require('node:assert/strict')
const { timing, notePosition, inputSongTime, closestNote, judgeHit, isMissed } = require('../js_schoolfight/rhythm.js')

test('notes reach the hit line at their exact musical time for every canvas height', () => {
    for (const height of [314, 500, 700]) {
        const line = height - 50
        assert.equal(notePosition(4000, 4000, -50, line), line)
        assert.equal(notePosition(4000, 4000 - timing.approachMs, -50, line), -50)
    }
})

test('hit windows are symmetric and preserve the existing accuracy thresholds', () => {
    for (const sign of [-1, 1]) {
        for (const [difference, label] of [[0, 'Perfect!'], [40, 'Perfect!'], [41, 'Good!'], [60, 'Good!'],
            [61, 'Okay.'], [80, 'Okay.'], [81, 'Poor!'], [150, 'Poor!']]) {
            assert.equal(judgeHit(sign * difference).label, label)
        }
        assert.equal(judgeHit(sign * 151), null)
    }
})

test('a note expires only after its late hit window, independently of geometry', () => {
    assert.equal(isMissed(4000, 3850), false)
    assert.equal(isMissed(4000, 4150), false)
    assert.equal(isMissed(4000, 4151), true)
})

test('the nearest unjudged note wins even when its last drawn position is stale', () => {
    const first = { perfectHitTimeMs: 4000, y: -50 }
    const second = { perfectHitTimeMs: 4250, y: -50 }
    assert.equal(closestNote([first, second], 4000), first)
    assert.equal(closestNote([first, second], 4140), second)
    second.hit = true
    assert.equal(closestNote([first, second], 4140), first)
    first.missed = true
    assert.equal(closestNote([first, second], 4140), null)
    assert.equal(closestNote([{ perfectHitTimeMs: 4000 }], 3800), null)
})

test('queued input uses the original event time rather than delayed handler time', () => {
    assert.ok(Math.abs(inputSongTime({ currentTimeSec: 4.06, eventTimestamp: 1000, now: 1060 }) - 4000) < 0.000001)
    assert.ok(Math.abs(inputSongTime({ currentTimeSec: 4.06, eventTimestamp: 1000, now: 1030, playbackRate: 2 }) - 4000) < 0.000001)
})

test('input timestamps support epoch-based events and guard invalid or future values', () => {
    const timeOrigin = 1700000000000
    assert.ok(Math.abs(inputSongTime({ currentTimeSec: 4.06, eventTimestamp: timeOrigin + 1000, now: 1060, timeOrigin }) - 4000) < 0.000001)
    assert.equal(inputSongTime({ currentTimeSec: 4, eventTimestamp: undefined, now: 1060 }), 4000)
    assert.equal(inputSongTime({ currentTimeSec: 4, eventTimestamp: 1100, now: 1060 }), 4000)
    assert.equal(inputSongTime({ currentTimeSec: 4, eventTimestamp: 1100, now: 1060, timeOrigin }), 4000)
    assert.equal(inputSongTime({ currentTimeSec: 0, eventTimestamp: 1000, now: 1060 }), 0)
})
