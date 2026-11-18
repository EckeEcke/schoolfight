const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const vm = require('node:vm')
const beatmap = require('../js_schoolfight/dance-beatmap.js')
const onsets = require('./fixtures/dance-onsets.json')
const { timing, closestNote, judgeHit } = require('../js_schoolfight/rhythm.js')

test('recorded audio measurements belong to the current music asset', () => {
    const bytes = fs.readFileSync(path.join(__dirname, '../sounds_schoolfight/117bpm.mp3'))
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), onsets.audioSha256)
})

test('all playable notes align with measured audio onsets inside the perfect window', () => {
    assert.equal(beatmap.notes.length, 62)
    const measurements = new Map(onsets.measurements.map(measurement => [measurement.beat, measurement]))
    for (const note of beatmap.notes) {
        const measurement = measurements.get(note.beat)
        assert.ok(measurement, `Missing audio measurement for beat ${note.beat}`)
        assert.ok(measurement.strength >= onsets.onsetThreshold)
        const offset = Math.abs(note.timeMs - measurement.onsetMs)
        assert.ok(offset <= 40, `Beat ${note.beat} differs from its onset by ${offset} ms`)
        assert.equal(judgeHit(offset).label, 'Perfect!')
    }
})

test('the chart contains ordered, distinct targets with playable gaps and an outro without notes', () => {
    assert.equal(new Set(beatmap.notes.map(note => note.beat)).size, beatmap.notes.length)
    for (const [index, note] of beatmap.notes.entries()) {
        assert.ok(Number.isFinite(note.timeMs) && note.timeMs > 0)
        assert.ok(note.timeMs + 150 < beatmap.durationMs)
        if (index > 0) assert.ok(note.timeMs - beatmap.notes[index - 1].timeMs >= 500)
        assert.equal(closestNote(beatmap.notes.map(data => ({ ...data, perfectHitTimeMs: data.timeMs })), note.timeMs).beat, note.beat)
    }
    assert.ok(beatmap.durationMs <= onsets.audioDurationMs)
    assert.ok(beatmap.durationMs >= 45000 && beatmap.durationMs <= 65000)
    assert.ok(Math.abs(beatmap.durationMs - 28 * 4 * 60000 / 115) < 0.001)
    assert.ok(beatmap.fadeOutMs > 0 && beatmap.fadeOutMs < 1000)
})

test('notes stay on the main pulse without switching to half beats after the intro', () => {
    const beatDuration = 60000 / timing.bpm
    for (const note of beatmap.notes) {
        assert.ok(Number.isInteger(note.beat))
        const pulse = (note.timeMs - timing.beatOffsetMs) / beatDuration
        assert.ok(Math.abs(pulse - note.beat) < 0.00001)
    }
    assert.deepEqual(beatmap.notes.filter(note => note.timeMs >= 9000 && note.timeMs < 13000).map(note => note.timeMs),
        [9913.043, 10434.783, 10956.522, 12000])
})

test('the chart loads directly in a browser without Node or a build', () => {
    const browser = vm.createContext({})
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js_schoolfight/dance-beatmap.js'), 'utf8'), browser)
    assert.equal(vm.runInContext('SchoolFightDanceBeatmap.notes.length', browser), beatmap.notes.length)
})
