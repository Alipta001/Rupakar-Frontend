const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')
const ts = require('typescript')

const helperPath = path.resolve(__dirname, '../lib/auth-redirect.ts')
const source = fs.readFileSync(helperPath, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: helperPath,
}).outputText
const helperModule = new Module(helperPath, module)
helperModule.filename = helperPath
helperModule.paths = Module._nodeModulePaths(path.dirname(helperPath))
helperModule._compile(compiled, helperPath)
const { getSafeReturnTo, getCurrentReturnTo, loginPathForCurrentLocation } = helperModule.exports

test('getSafeReturnTo returns valid internal routes and preserves query params and hashes', () => {
  assert.equal(getSafeReturnTo('/products/terracotta-vase'), '/products/terracotta-vase')
  assert.equal(getSafeReturnTo('/#testimonials'), '/#testimonials')
  assert.equal(
    getSafeReturnTo('/products/terracotta-vase?action=add-to-cart&variantId=v123&quantity=2'),
    '/products/terracotta-vase?action=add-to-cart&variantId=v123&quantity=2'
  )
  assert.equal(
    getSafeReturnTo('/products/terracotta-vase?action=buy-now&variantId=v123&quantity=1'),
    '/products/terracotta-vase?action=buy-now&variantId=v123&quantity=1'
  )
})

test('getSafeReturnTo prevents redirect loops on auth pages', () => {
  assert.equal(getSafeReturnTo('/login'), '/account')
  assert.equal(getSafeReturnTo('/login?returnTo=%2Fcheckout'), '/account')
  assert.equal(getSafeReturnTo('/register'), '/account')
  assert.equal(getSafeReturnTo('/verify-otp'), '/account')
  assert.equal(getSafeReturnTo('/reset-password'), '/account')
  assert.equal(getSafeReturnTo('/forgot-password'), '/account')
})

test('getSafeReturnTo rejects external URLs and malformed inputs', () => {
  assert.equal(getSafeReturnTo('https://evil.com'), '/account')
  assert.equal(getSafeReturnTo('//evil.com'), '/account')
  assert.equal(getSafeReturnTo('javascript:alert(1)'), '/account')
  assert.equal(getSafeReturnTo(null), '/account')
  assert.equal(getSafeReturnTo(undefined), '/account')
  assert.equal(getSafeReturnTo(''), '/account')
  assert.equal(getSafeReturnTo(undefined, '/custom-fallback'), '/custom-fallback')
})
