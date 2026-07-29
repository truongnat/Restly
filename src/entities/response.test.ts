import { describe, expect, it } from 'vitest'

import { httpExchangeResultSchema, RESPONSE_CONTRACT_VERSION } from '@/entities/response'

const exactFixture = {
  version: RESPONSE_CONTRACT_VERSION,
  status: 200,
  statusText: 'OK',
  headers: {
    'content-encoding': 'gzip',
    'content-type': 'application/json',
  },
  body: '{"message":"hello"}',
  timings: {
    dnsMs: null,
    connectMs: null,
    tlsMs: null,
    ttfbMs: 12.25,
    downloadMs: 3.75,
    totalMs: 16,
  },
  sizes: {
    encodedBodyBytes: 38,
    decodedBodyBytes: 19,
    downloadedBytes: 251,
  },
}

describe('httpExchangeResultSchema', () => {
  it('preserves exact timing and byte fixture values', () => {
    expect(httpExchangeResultSchema.parse(exactFixture)).toEqual(exactFixture)
  })

  it('accepts null for every unavailable metric', () => {
    const parsed = httpExchangeResultSchema.parse({
      ...exactFixture,
      timings: {
        dnsMs: null,
        connectMs: null,
        tlsMs: null,
        ttfbMs: null,
        downloadMs: null,
        totalMs: null,
      },
      sizes: {
        encodedBodyBytes: null,
        decodedBodyBytes: null,
        downloadedBytes: null,
      },
    })

    expect(parsed.timings.dnsMs).toBeNull()
    expect(parsed.sizes.encodedBodyBytes).toBeNull()
  })

  it('does not fabricate omitted unknown metrics', () => {
    const result = httpExchangeResultSchema.safeParse({
      ...exactFixture,
      timings: {
        connectMs: null,
        tlsMs: null,
        ttfbMs: null,
        downloadMs: null,
        totalMs: null,
      },
    })

    expect(result.success).toBe(false)
  })

  it('rejects fractional, negative, and non-finite byte counts', () => {
    for (const decodedBodyBytes of [-1, 1.5, Number.POSITIVE_INFINITY]) {
      expect(
        httpExchangeResultSchema.safeParse({
          ...exactFixture,
          sizes: { ...exactFixture.sizes, decodedBodyBytes },
        }).success,
      ).toBe(false)
    }
  })

  it('rejects an unsupported response contract version', () => {
    expect(
      httpExchangeResultSchema.safeParse({
        ...exactFixture,
        version: 2,
      }).success,
    ).toBe(false)
  })
})
