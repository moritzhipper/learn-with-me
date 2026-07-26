import * as assert from 'node:assert'
import { test } from 'node:test'
import { build } from '../helper'

test('returns the custom response for invalid bank query parameters', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/banks?sortBy=new&limit=not-a-number',
    headers: {
      'x-user-id': '00000000-0000-4000-8000-000000000000'
    }
  })

  assert.strictEqual(response.statusCode, 400)
  assert.deepStrictEqual(response.json(), {
    message: 'Larry could not process your request.'
  })
})
