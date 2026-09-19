const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')
const ts = require('typescript')

const helperPath = path.resolve(__dirname, '../lib/cart-state.ts')
const source = fs.readFileSync(helperPath, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: helperPath,
}).outputText
const helperModule = new Module(helperPath, module)
helperModule.filename = helperPath
helperModule.paths = Module._nodeModulePaths(path.dirname(helperPath))
helperModule._compile(compiled, helperPath)
const { getProductVariantId, hasCartVariant } = helperModule.exports

test('server cart variant state blocks duplicate add and allows add after removal', () => {
  const product = { _id: 'product-a', variants: [{ _id: 'variant-a' }] }
  const cart = { items: [{ productId: 'product-a', variantId: 'variant-a', quantity: 1 }] }

  assert.equal(getProductVariantId(product), 'variant-a')
  assert.equal(hasCartVariant(cart, 'variant-a'), true)
  assert.equal(hasCartVariant(cart, 'variant-b'), false)
  assert.equal(hasCartVariant({ items: [] }, 'variant-a'), false)
})

test('cart identity does not fall back to numeric product IDs', () => {
  assert.equal(getProductVariantId({ id: 42 }), '')
  assert.equal(hasCartVariant({ items: [{ productId: '42', variantId: 'variant-a' }] }, '42'), false)
})
