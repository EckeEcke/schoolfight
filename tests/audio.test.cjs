const { test } = require('node:test')
const assert = require('node:assert/strict')
const { playAudio } = require('../js_schoolfight/audio.js')

test('interrupted playback is handled even when the sound is restarted rapidly', async () => {
    let cancel
    const audio = {
        play() {
            if (cancel) cancel(Object.assign(new Error('Interrupted by pause'), { name: 'AbortError' }))
            return new Promise((resolve, reject) => { cancel = reject })
        },
    }
    const first = playAudio(audio)
    const second = playAudio(audio)
    cancel(Object.assign(new Error('Interrupted by pause'), { name: 'AbortError' }))
    await Promise.all([first, second])
})

test('successful playback completes normally', async () => {
    let calls = 0
    await playAudio({ play() { calls += 1; return Promise.resolve() } })
    assert.equal(calls, 1)
})

test('other playback failures stay visible without an unhandled rejection', async t => {
    const warning = t.mock.method(console, 'warn', () => {})
    const error = Object.assign(new Error('Unsupported source'), { name: 'NotSupportedError' })
    await playAudio({ play: () => Promise.reject(error) })
    assert.equal(warning.mock.callCount(), 1)
    assert.equal(warning.mock.calls[0].arguments[1], error)
})
