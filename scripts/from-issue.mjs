// Turns an accepted "Suggest a tool" issue into an entry in tools.json.
// Run by .github/workflows/accept.yml with the issue body in ISSUE_BODY.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { check, keyOf } from './rules.mjs'

const body = process.env.ISSUE_BODY || ''
const author = process.env.ISSUE_AUTHOR || ''
const out = (k, v) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}<<EOF\n${v}\nEOF\n`)

// issue forms write "### Label" then the answer; "_No response_" when empty
const field = (label) => {
  const m = body.match(new RegExp(`### ${label}\\s*\\n+([\\s\\S]*?)(?=\\n### |$)`))
  const v = m ? m[1].trim() : ''
  return v === '_No response_' ? '' : v
}

const entry = {
  name: field('Name'),
  url: field('Link'),
  category: field('Kind'),
  description: field('What it does').replace(/\s+/g, ' '),
}
const install = field('Install command')
if (install) entry.install_cmd = install.replace(/^`+|`+$/g, '').trim()
const tags = field('Tags').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
if (tags.length) entry.tags = tags.slice(0, 8)
if (author) entry.added_by = author
entry.added_at = new Date().toISOString().slice(0, 10)

const path = new URL('../tools.json', import.meta.url)
const data = JSON.parse(readFileSync(path, 'utf8'))
const errs = check(entry)
if (data.tools.some(t => keyOf(t) === keyOf(entry))) errs.push('this link is already on the list')
if (errs.length) {
  out('error', errs.map(e => `- ${e}`).join('\n'))
  console.error(errs.join('\n'))
  process.exit(1)
}
data.tools.push(entry)
data.tools.sort((a, b) => a.name.localeCompare(b.name))
writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
out('name', entry.name)
console.log(`added ${entry.name}`)
