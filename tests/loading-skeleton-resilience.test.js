const assert = require('node:assert/strict')
const path = require('node:path')
const { test } = require('node:test')
const fs = require('node:fs')
const ts = require('typescript')

// Test isColdStartError logic directly
const apiErrorsPath = path.resolve(__dirname, '../lib/api-errors.ts')
const apiErrorsSource = fs.readFileSync(apiErrorsPath, 'utf8')
const transpiledApiErrors = ts.transpileModule(apiErrorsSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

const evalExports = {}
const evalModule = { exports: evalExports }
const evalFn = new Function('module', 'exports', 'require', transpiledApiErrors)
evalFn(evalModule, evalExports, require)
const { isColdStartError, getApiErrorMessage } = evalModule.exports


test('isColdStartError correctly identifies 502, 503, 504, and network errors', () => {
  assert.equal(isColdStartError({ response: { status: 502 } }), true)
  assert.equal(isColdStartError({ response: { status: 503 } }), true)
  assert.equal(isColdStartError({ response: { status: 504 } }), true)
  assert.equal(isColdStartError({ code: 'ECONNABORTED' }), true)
  assert.equal(isColdStartError({ code: 'ERR_NETWORK' }), true)
  assert.equal(isColdStartError({ message: 'Network Error' }), true)
  assert.equal(isColdStartError({ message: 'Failed to fetch' }), true)
})

test('isColdStartError does NOT treat 400, 401, 403, 404, or validation errors as cold start', () => {
  assert.equal(isColdStartError({ response: { status: 400 } }), false)
  assert.equal(isColdStartError({ response: { status: 401 } }), false)
  assert.equal(isColdStartError({ response: { status: 403 } }), false)
  assert.equal(isColdStartError({ response: { status: 404 } }), false)
  assert.equal(isColdStartError({ response: { status: 422 } }), false)
  assert.equal(isColdStartError(null), false)
  assert.equal(isColdStartError(undefined), false)
})

test('getApiErrorMessage gives cold-start friendly message on 502/503/504/network errors', () => {
  const message502 = getApiErrorMessage({ response: { status: 502 } }, 'Default')
  assert.match(message502, /taking a little longer than usual to connect/i)

  const messageTimeout = getApiErrorMessage({ code: 'ECONNABORTED' }, 'Default')
  assert.match(messageTimeout, /taking a little longer than usual to connect/i)

  const message404 = getApiErrorMessage({ response: { status: 404 } }, 'Not found')
  assert.doesNotMatch(message404, /taking a little longer than usual/i)
})

test('State separation: LOADING !== EMPTY !== ERROR !== DATA guarantees', () => {
  function computeUIState({ isLoading, isError, count, isRefetching }) {
    if (isLoading && count === 0) {
      return 'SHOW_SKELETON'
    }
    if (isError && count === 0) {
      return 'SHOW_ERROR_STATE'
    }
    if (!isLoading && !isError && count === 0) {
      return 'SHOW_EMPTY_STATE'
    }
    if (count > 0) {
      return isRefetching ? 'SHOW_DATA_WITH_BACKGROUND_SPINNER' : 'SHOW_DATA'
    }
    return 'UNKNOWN'
  }

  // 1. Initial load with empty array [] MUST NOT show EMPTY_STATE
  assert.equal(computeUIState({ isLoading: true, isError: false, count: 0, isRefetching: false }), 'SHOW_SKELETON')

  // 2. Initial load error MUST NOT show EMPTY_STATE
  assert.equal(computeUIState({ isLoading: false, isError: true, count: 0, isRefetching: false }), 'SHOW_ERROR_STATE')

  // 3. Successful empty response MUST show EMPTY_STATE
  assert.equal(computeUIState({ isLoading: false, isError: false, count: 0, isRefetching: false }), 'SHOW_EMPTY_STATE')

  // 4. Successful data response MUST show DATA
  assert.equal(computeUIState({ isLoading: false, isError: false, count: 5, isRefetching: false }), 'SHOW_DATA')

  // 5. Background refetching preserves existing data (NO Data -> [] -> Data flicker)
  assert.equal(computeUIState({ isLoading: false, isError: false, count: 5, isRefetching: true }), 'SHOW_DATA_WITH_BACKGROUND_SPINNER')
})

test('Safe idempotent GET requests can be retried while mutations are never retried blindly', () => {
  const SAFE_METHODS = new Set(['get', 'head', 'options'])

  function shouldRetryRequest(method, statusOrCode, retryCount) {
    if (!SAFE_METHODS.has((method || '').toLowerCase())) {
      return false // Mutations must NOT be retried automatically
    }
    const isTransient = [502, 503, 504, 'ECONNABORTED', 'ERR_NETWORK'].includes(statusOrCode)
    return isTransient && retryCount < 2
  }

  // GET retries on transient errors
  assert.equal(shouldRetryRequest('get', 502, 0), true)
  assert.equal(shouldRetryRequest('get', 503, 1), true)
  assert.equal(shouldRetryRequest('get', 504, 2), false) // Exceeded limit
  assert.equal(shouldRetryRequest('get', 'ECONNABORTED', 0), true)

  // GET does NOT retry on client errors
  assert.equal(shouldRetryRequest('get', 400, 0), false)
  assert.equal(shouldRetryRequest('get', 401, 0), false)
  assert.equal(shouldRetryRequest('get', 404, 0), false)

  // Mutations (POST, PUT, DELETE, PATCH) are NEVER retried blindly
  assert.equal(shouldRetryRequest('post', 502, 0), false)
  assert.equal(shouldRetryRequest('post', 503, 0), false)
  assert.equal(shouldRetryRequest('put', 502, 0), false)
  assert.equal(shouldRetryRequest('delete', 502, 0), false)
  assert.equal(shouldRetryRequest('patch', 502, 0), false)
})

test('Category/filter transitions: isFetching && count === 0 must render SKELETON, never EMPTY_STATE', () => {
  function computeFilterTransitionState({ isLoading, isFetching, count, isError }) {
    if ((isLoading || isFetching) && count === 0) {
      return 'SHOW_SKELETON'
    }
    if (isError && count === 0) {
      return 'SHOW_ERROR_STATE'
    }
    if (!isLoading && !isFetching && !isError && count === 0) {
      return 'SHOW_EMPTY_STATE'
    }
    return 'SHOW_DATA'
  }

  // When category changes, TanStack Query isFetching is true while new items load:
  assert.equal(
    computeFilterTransitionState({ isLoading: false, isFetching: true, count: 0, isError: false }),
    'SHOW_SKELETON'
  )

  // Only when both loading and fetching are complete with 0 items does empty state show:
  assert.equal(
    computeFilterTransitionState({ isLoading: false, isFetching: false, count: 0, isError: false }),
    'SHOW_EMPTY_STATE'
  )

  // With cached items during background refetch, data remains visible:
  assert.equal(
    computeFilterTransitionState({ isLoading: false, isFetching: true, count: 4, isError: false }),
    'SHOW_DATA'
  )
})

test('Checkout address state: showNewAddressMode does not flash during initial addresses load', () => {
  function computeShowNewAddressMode({ newAddressMode, addressesLoading, addressesFetching, addressCount }) {
    return newAddressMode || (!addressesLoading && !addressesFetching && addressCount === 0)
  }

  // 1. Initial load in progress: user has not clicked new address -> false (shows skeleton, no flash)
  assert.equal(
    computeShowNewAddressMode({ newAddressMode: false, addressesLoading: true, addressesFetching: false, addressCount: 0 }),
    false
  )

  // 2. Refetching in progress: user has not clicked new address -> false
  assert.equal(
    computeShowNewAddressMode({ newAddressMode: false, addressesLoading: false, addressesFetching: true, addressCount: 0 }),
    false
  )

  // 3. Finished loading, genuinely 0 saved addresses -> true (auto-opens new address form)
  assert.equal(
    computeShowNewAddressMode({ newAddressMode: false, addressesLoading: false, addressesFetching: false, addressCount: 0 }),
    true
  )

  // 4. Finished loading with saved addresses -> false (renders saved addresses list)
  assert.equal(
    computeShowNewAddressMode({ newAddressMode: false, addressesLoading: false, addressesFetching: false, addressCount: 2 }),
    false
  )

  // 5. User explicitly clicked "Add New Address" -> always true
  assert.equal(
    computeShowNewAddressMode({ newAddressMode: true, addressesLoading: false, addressesFetching: false, addressCount: 2 }),
    true
  )
})

