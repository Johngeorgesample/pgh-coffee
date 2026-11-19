import useShopsStore from '@/stores/coffeeShopsStore'

describe('fetchVisits', () => {
  beforeEach(() => useShopsStore.setState({ visitedUUIDs: null }))
  afterEach(() => vi.restoreAllMocks())

  it('can be retried after a failed request', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ shop: { uuid: 'a' } }])))

    await useShopsStore.getState().fetchVisits()
    await useShopsStore.getState().fetchVisits()

    expect(useShopsStore.getState().visitedUUIDs).toEqual(new Set(['a']))
  })

  it('shares one request between concurrent callers', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response('[]'))
    const { fetchVisits } = useShopsStore.getState()

    await Promise.all([fetchVisits(), fetchVisits()])

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
