import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: { use: vi.fn() },
      },
    })),
    interceptors: {
      response: { use: vi.fn() },
    },
  }
  return { default: mockAxios }
})

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports API_BASE from lib/axios', async () => {
    const { API_BASE } = await import('@/lib/axios')
    expect(API_BASE).toContain('localhost')
  })

  it('exports sendChatMessage function', async () => {
    const api = await import('@/services/api')
    expect(typeof api.sendChatMessage).toBe('function')
  })

  it('exports streamChatMessage generator', async () => {
    const api = await import('@/services/api')
    expect(typeof api.streamChatMessage).toBe('function')
  })
})
