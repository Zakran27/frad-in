// node src/lib/media.check.mjs : hôtes autorisés pour les médias talaref / flops
import assert from 'node:assert/strict'
import { safeMediaUrl, isBlobUrl, tweetId } from './media.js'

assert.equal(safeMediaUrl('javascript:alert(1)'), null)
assert.equal(safeMediaUrl('http://www.youtube.com/embed/x'), null)
assert.equal(safeMediaUrl('https://www.youtube.com/embed/abc'), 'https://www.youtube.com/embed/abc')
assert.equal(safeMediaUrl('https://evil.example/x'), null)
assert.equal(safeMediaUrl('https://www.youtube.com.evil.example/x'), null)
assert.equal(isBlobUrl('https://abc.public.blob.vercel-storage.com/a.png'), true)
assert.equal(isBlobUrl('https://www.youtube.com/embed/abc'), false)
assert.equal(tweetId('https://x.com/user/status/123'), '123')
assert.equal(tweetId('https://twitter.com/user/status/456?s=20'), '456')
assert.equal(tweetId('https://x.com/user'), null)
console.log('media.check OK')
