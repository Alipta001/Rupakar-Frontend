const assert = require('node:assert/strict')
const { test } = require('node:test')

// State machine helper modeling CollectionsGrid and CollectionSlugPage state logic
function computeCollectionUIState({
  isPending,
  isLoading,
  isFetching,
  isError,
  itemsCount,
}) {
  const isInitialOrCategoryLoading = isPending || (isLoading && itemsCount === 0)

  if (isInitialOrCategoryLoading) {
    return 'SHOW_SKELETON'
  }
  if (isError && itemsCount === 0) {
    return 'SHOW_ERROR_STATE'
  }
  if (itemsCount === 0) {
    return 'SHOW_EMPTY_STATE'
  }
  return isFetching ? 'SHOW_DATA_UPDATING' : 'SHOW_DATA'
}

// React Query key builder modeling deterministic collection query keys
function getCollectionQueryKey(slug, category) {
  if (slug) {
    return ['collection-products', slug]
  }
  return ['collection-products', 'browse', category || 'All']
}

test('1. Initial collection load: Skeleton -> Data, never shows false EmptyState', () => {
  // Step 1: Initial mount before data arrives
  const initialState = computeCollectionUIState({
    isPending: true,
    isLoading: true,
    isFetching: true,
    isError: false,
    itemsCount: 0,
  })
  assert.equal(initialState, 'SHOW_SKELETON', 'Initial load must show SKELETON')

  // Step 2: Data arrives successfully (e.g. 12 products)
  const loadedState = computeCollectionUIState({
    isPending: false,
    isLoading: false,
    isFetching: false,
    isError: false,
    itemsCount: 12,
  })
  assert.equal(loadedState, 'SHOW_DATA', 'Data arrival must show DATA')
  assert.notEqual(initialState, 'SHOW_EMPTY_STATE', 'Never show EmptyState before a successful response')
})

test('2. Empty collection: Successful zero results -> EmptyState', () => {
  // Successful query with 0 results
  const emptyState = computeCollectionUIState({
    isPending: false,
    isLoading: false,
    isFetching: false,
    isError: false,
    itemsCount: 0,
  })
  assert.equal(emptyState, 'SHOW_EMPTY_STATE', 'Finished response with 0 items must show EmptyState')
})

test('3. Category filtering: Correct query parameters for All vs Category', () => {
  function buildCategoryQueryParams(activeCategory, limit = 40) {
    return {
      category: activeCategory === 'All' ? undefined : activeCategory,
      limit,
    }
  }

  // All category omits category filter to load all products
  assert.deepEqual(buildCategoryQueryParams('All'), { category: undefined, limit: 40 })

  // Specific categories pass their exact category name
  assert.deepEqual(buildCategoryQueryParams('Terracotta'), { category: 'Terracotta', limit: 40 })
  assert.deepEqual(buildCategoryQueryParams('Folk Art'), { category: 'Folk Art', limit: 40 })
  assert.deepEqual(buildCategoryQueryParams('Decor'), { category: 'Decor', limit: 40 })
})

test('4. Correct query keys: Deterministic React Query keys never share incorrect cached data', () => {
  const allKey = getCollectionQueryKey(null, 'All')
  const terracottaKey = getCollectionQueryKey(null, 'Terracotta')
  const folkArtKey = getCollectionQueryKey(null, 'Folk Art')
  const slugKey = getCollectionQueryKey('terracotta', null)

  assert.deepEqual(allKey, ['collection-products', 'browse', 'All'])
  assert.deepEqual(terracottaKey, ['collection-products', 'browse', 'Terracotta'])
  assert.deepEqual(folkArtKey, ['collection-products', 'browse', 'Folk Art'])
  assert.deepEqual(slugKey, ['collection-products', 'terracotta'])

  // Ensure keys do not collide
  assert.notDeepEqual(allKey, terracottaKey)
  assert.notDeepEqual(terracottaKey, folkArtKey)
  assert.notDeepEqual(terracottaKey, slugKey)
})

test('5. Stale request protection & Rapid category switching (All -> A -> B -> All)', async () => {
  // Simulate rapid switching with an in-memory client
  class QuerySimulation {
    constructor() {
      this.cache = new Map()
      this.activeSignal = null
      this.currentCategory = null
    }

    async selectCategory(category, mockApiFn) {
      if (this.activeSignal) {
        this.activeSignal.aborted = true
      }
      const signal = { aborted: false }
      this.activeSignal = signal
      this.currentCategory = category

      const key = JSON.stringify(getCollectionQueryKey(null, category))
      if (this.cache.has(key)) {
        return { fromCache: true, category, data: this.cache.get(key) }
      }

      const data = await mockApiFn(category, signal)
      if (signal.aborted) {
        // Stale request discarded
        return { discarded: true, category }
      }
      this.cache.set(key, data)
      return { fromCache: false, category, data }
    }
  }

  const client = new QuerySimulation()

  // Rapid switching simulation with staggered delays:
  // All -> Terracotta (slow) -> Folk Art (faster) -> All (instant cached)
  let responses = []

  const pTerracotta = client.selectCategory('Terracotta', (cat, signal) =>
    new Promise((resolve) => setTimeout(() => resolve(signal.aborted ? null : ['terracotta-1']), 50))
  )
  const pFolkArt = client.selectCategory('Folk Art', (cat, signal) =>
    new Promise((resolve) => setTimeout(() => resolve(signal.aborted ? null : ['folk-art-1']), 30))
  )
  const pAll = client.selectCategory('All', (cat, signal) =>
    new Promise((resolve) => setTimeout(() => resolve(signal.aborted ? null : ['all-1', 'all-2']), 10))
  )

  const [res1, res2, res3] = await Promise.all([pTerracotta, pFolkArt, pAll])

  // Inactive earlier requests were discarded
  assert.equal(res1.discarded, true)
  assert.equal(res2.discarded, true)
  assert.equal(res3.category, 'All')
  assert.deepEqual(res3.data, ['all-1', 'all-2'])
  assert.equal(client.currentCategory, 'All')
})

test('6. No false empty state: Never Skeleton -> Empty -> Products', () => {
  const steps = []

  function recordTransition(stateProps) {
    steps.push(computeCollectionUIState(stateProps))
  }

  // 1. Initial mount
  recordTransition({ isPending: true, isLoading: true, isFetching: true, isError: false, itemsCount: 0 })
  // 2. Fetch completes with data
  recordTransition({ isPending: false, isLoading: false, isFetching: false, isError: false, itemsCount: 8 })

  // Verify transition sequence is directly Skeleton -> Data
  assert.deepEqual(steps, ['SHOW_SKELETON', 'SHOW_DATA'])
  assert.ok(!steps.includes('SHOW_EMPTY_STATE'), 'Must never flash empty state between skeleton and data')
})

test('7. No unnecessary duplicate requests: Cached category re-use with staleTime', () => {
  let fetchCount = 0
  const cache = new Map()

  function fetchCategoryWithCache(category, staleTimeMs = 60000) {
    const key = category
    const cached = cache.get(key)
    const now = Date.now()

    if (cached && now - cached.timestamp < staleTimeMs) {
      return { data: cached.data, fetched: false }
    }

    fetchCount++
    const data = [`${category}-item`]
    cache.set(key, { data, timestamp: now })
    return { data, fetched: true }
  }

  // Initial fetch for Terracotta
  const res1 = fetchCategoryWithCache('Terracotta')
  assert.equal(res1.fetched, true)
  assert.equal(fetchCount, 1)

  // Switch to Folk Art
  const res2 = fetchCategoryWithCache('Folk Art')
  assert.equal(res2.fetched, true)
  assert.equal(fetchCount, 2)

  // Switch back to Terracotta within staleTime -> served from cache without extra fetch
  const res3 = fetchCategoryWithCache('Terracotta')
  assert.equal(res3.fetched, false)
  assert.deepEqual(res3.data, ['Terracotta-item'])
  assert.equal(fetchCount, 2, 'Must not duplicate request for fresh cached category')
})

test('8. Real error state -> ErrorState + Retry, never empty state', () => {
  const errorState = computeCollectionUIState({
    isPending: false,
    isLoading: false,
    isFetching: false,
    isError: true,
    itemsCount: 0,
  })
  assert.equal(errorState, 'SHOW_ERROR_STATE', 'Real error must show ErrorState')
  assert.notEqual(errorState, 'SHOW_EMPTY_STATE', 'Error must never be converted to empty state')
})
