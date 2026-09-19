const assert = require('node:assert/strict')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')
const { test } = require('node:test')
const ts = require('typescript')

const axiosSourcePath = path.resolve(__dirname, '../api/axios/axios.ts')

function loadAxiosModule(refreshRequest) {
  const source = fs.readFileSync(axiosSourcePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: axiosSourcePath,
  }).outputText
  const client = (request) => {
    client.retriedRequests.push(request)
    return Promise.resolve({ data: { retried: true } })
  }
  client.retriedRequests = []
  client.interceptors = {
    request: { use: () => undefined },
    response: { use: (_fulfilled, rejected) => { client.reject = rejected } },
  }
  const axios = {
    __esModule: true,
    default: {
      create: () => client,
      post: refreshRequest,
    },
  }
  const originalLoad = Module._load
  const originalWindow = global.window
  const storage = new Map()
  global.window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  }
  Module._load = function load(request, parent, isMain) {
    if (request === 'axios') return axios
    return originalLoad.call(this, request, parent, isMain)
  }

  try {
    const moduleInstance = new Module(axiosSourcePath, module)
    moduleInstance.filename = axiosSourcePath
    moduleInstance.paths = Module._nodeModulePaths(path.dirname(axiosSourcePath))
    moduleInstance._compile(compiled, axiosSourcePath)
    return { client, exports: moduleInstance.exports }
  } finally {
    Module._load = originalLoad
    global.window = originalWindow
  }
}

test('retries the original request after an expired access token is refreshed', async () => {
  let refreshCalls = 0
  const { client } = loadAxiosModule(async () => {
    refreshCalls += 1
    return { data: { data: { accessToken: 'fresh-access-token' } } }
  })

  await client.reject({
    config: { url: '/orders', headers: {} },
    response: { status: 401 },
  })

  assert.equal(refreshCalls, 1)
  assert.equal(client.retriedRequests.length, 1)
  assert.equal(client.retriedRequests[0].headers.Authorization, 'Bearer fresh-access-token')
})

test('shares one refresh request across simultaneous 401 responses', async () => {
  let refreshCalls = 0
  let releaseRefresh
  const { client } = loadAxiosModule(() => {
    refreshCalls += 1
    return new Promise((resolve) => {
      releaseRefresh = () => resolve({ data: { data: { accessToken: 'fresh-access-token' } } })
    })
  })

  const first = client.reject({ config: { url: '/cart', headers: {} }, response: { status: 401 } })
  const second = client.reject({ config: { url: '/orders', headers: {} }, response: { status: 401 } })
  releaseRefresh()
  await Promise.all([first, second])

  assert.equal(refreshCalls, 1)
  assert.equal(client.retriedRequests.length, 2)
  assert.deepEqual(client.retriedRequests.map((request) => request.headers.Authorization), [
    'Bearer fresh-access-token',
    'Bearer fresh-access-token',
  ])
})