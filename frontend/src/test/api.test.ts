import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/axios', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      response: { use: vi.fn() },
    },
  }
  return {
    default: mockClient,
    API_BASE: 'http://localhost:8000/api/v1',
  }
})

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports streamChatMessage as a generator function', async () => {
    const api = await import('@/services/api')
    expect(typeof api.streamChatMessage).toBe('function')
    const gen = api.streamChatMessage({ message: 'hello' })
    expect(typeof gen.next).toBe('function')
    expect(typeof gen.return).toBe('function')
    expect(typeof gen.throw).toBe('function')
  })

  it('exports sendChatMessage function', async () => {
    const api = await import('@/services/api')
    expect(typeof api.sendChatMessage).toBe('function')
  })

  it('exports listConversations function', async () => {
    const api = await import('@/services/api')
    expect(typeof api.listConversations).toBe('function')
  })

  it('exports sendAgentMessage function', async () => {
    const api = await import('@/services/api')
    expect(typeof api.sendAgentMessage).toBe('function')
  })

  it('exports knowledge API functions', async () => {
    const api = await import('@/services/api')
    expect(typeof api.indexRepository).toBe('function')
    expect(typeof api.searchKnowledge).toBe('function')
    expect(typeof api.getKnowledgeStatus).toBe('function')
  })
})
