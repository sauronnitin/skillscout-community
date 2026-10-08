// Checks tools.json: valid JSON, every entry follows the rules, no duplicates.
import { readFileSync } from 'node:fs'
import { check, keyOf } from './rules.mjs'

let data
try {
  data = JSON.parse(readFileSync(new URL('../tools.json', import.meta.url), 'utf8'))
} catch (e) {
  console.error(`tools.json is not valid JSON: ${e.message}`)
  process.exit(1)
}
const tools = Array.isArray(data.tools) ? data.tools : null
if (!tools) { console.error('tools.json needs a "tools" array'); process.exit(1) }

let bad = 0
const seen = new Map()
tools.forEach((t, i) => {
  const errs = check(t)
  const k = keyOf(t)
  if (seen.has(k)) errs.push(`duplicate of entry ${seen.get(k) + 1} (same url)`)
  else seen.set(k, i)
  if (errs.length) {
    bad++
    console.error(`Entry ${i + 1} (${t.name || 'no name'}):\n  - ${errs.join('\n  - ')}`)
  }
})
if (bad) { console.error(`\n${bad} entr${bad === 1 ? 'y needs' : 'ies need'} fixing.`); process.exit(1) }
console.log(`tools.json is fine: ${tools.length} tools.`)
