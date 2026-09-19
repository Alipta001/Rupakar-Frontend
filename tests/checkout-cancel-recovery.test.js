const assert = require('node:assert/strict')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')
const { test } = require('node:test')
const ts = require('typescript')

const helperPath = path.resolve(__dirname, '../lib/checkout-state.ts')

function loadHelper() {
  const source = fs.readFileSync(helperPath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: helperPath,
  }).outputText
  const moduleInstance = new Module(helperPath, module)
  moduleInstance.filename = helperPath
  moduleInstance.paths = Module._nodeModulePaths(path.dirname(helperPath))
  moduleInstance._compile(compiled, helperPath)
  return moduleInstance.exports
}

test('checkout #1 cancellation refreshes cart state before checkout #2', async () => {
  const { refreshCheckoutAfterPaymentCancellation } = loadHelper()
  const calls = []
  const queryClient = {
    invalidateQueries: async (options) => calls.push(['invalidate', options]),
    removeQueries: (options) => calls.push(['remove', options]),
  }

  await refreshCheckoutAfterPaymentCancellation(queryClient)

  assert.deepEqual(calls, [
    ['invalidate', { queryKey: ['cart'], refetchType: 'active' }],
    ['remove', { queryKey: ['checkout-preview'] }],
  ])
})