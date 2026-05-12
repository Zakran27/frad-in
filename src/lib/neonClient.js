import { neon } from '@neondatabase/serverless'

let _client = null
function getClient() {
  if (!_client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _client = neon(process.env.DATABASE_URL)
  }
  return _client
}

export const sql = new Proxy(function () {}, {
  apply(_target, _thisArg, args) {
    return getClient()(...args)
  },
  get(_target, prop) {
    return getClient()[prop]
  },
})
