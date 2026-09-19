const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const Module = require('node:module')
const path = require('node:path')
const ts = require('typescript')

const helperPath = path.resolve(__dirname, '../lib/guest-wishlist.ts')
const source = fs.readFileSync(helperPath, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: helperPath,
}).outputText

function createMockStorage() {
  const map = new Map()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, val) => map.set(key, String(val)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  }
}

function loadGuestWishlistModule(mockWindow) {
  const originalWindow = global.window
  global.window = mockWindow
  try {
    const helperModule = new Module(helperPath, module)
    helperModule.filename = helperPath
    helperModule.paths = Module._nodeModulePaths(path.dirname(helperPath))
    helperModule._compile(compiled, helperPath)
    return { ...helperModule.exports, cleanup: () => { global.window = originalWindow } }
  } catch (err) {
    global.window = originalWindow
    throw err
  }
}

test('guest wishlist handles empty state and SSR gracefully', () => {
  const mod = loadGuestWishlistModule(undefined)
  try {
    assert.deepEqual(mod.getGuestWishlist(), [])
    assert.equal(mod.isInGuestWishlist('prod-1'), false)
  } finally {
    mod.cleanup()
  }
})

test('guest wishlist adds items without duplicates and persists in localStorage', () => {
  const storage = createMockStorage()
  const mod = loadGuestWishlistModule({ localStorage: storage })
  try {
    const initial = mod.getGuestWishlist()
    assert.deepEqual(initial, [])

    const added = mod.addToGuestWishlist({
      productId: 'prod-101',
      name: 'Dokra Brass Figurine',
      price: 1850,
      image: '/dokra.jpg',
      artisan: 'Bikram Karmakar',
    })
    assert.equal(added.length, 1)
    assert.equal(added[0].productId, 'prod-101')
    assert.equal(added[0].name, 'Dokra Brass Figurine')
    assert.equal(mod.isInGuestWishlist('prod-101'), true)

    // Adding duplicate does not add second entry
    const dupe = mod.addToGuestWishlist({ productId: 'prod-101', name: 'Duplicate' })
    assert.equal(dupe.length, 1)

    // Second unique item
    const second = mod.addToGuestWishlist({ productId: 'prod-102', name: 'Clay Pot' })
    assert.equal(second.length, 2)

    // Remove one item
    const afterRemove = mod.removeFromGuestWishlist('prod-101')
    assert.equal(afterRemove.length, 1)
    assert.equal(afterRemove[0].productId, 'prod-102')
    assert.equal(mod.isInGuestWishlist('prod-101'), false)

    // Clear
    mod.clearGuestWishlist()
    assert.deepEqual(mod.getGuestWishlist(), [])
  } finally {
    mod.cleanup()
  }
})
