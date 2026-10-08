// Takes the suggestions people sent through skillscout.si (no GitHub account
// needed there) and opens one "Suggest a tool" issue for each, in the same
// shape the issue form makes, so the `accepted` label works the same way.
// Run hourly by .github/workflows/import-suggestions.yml.
import { check } from './rules.mjs'

const SITE = process.env.SKILLSCOUT_URL || 'https://skillscout.si'
const token = process.env.SUGGEST_TOKEN
const gh = process.env.GITHUB_TOKEN
const repo = process.env.GITHUB_REPOSITORY
if (!token || !gh || !repo) { console.error('SUGGEST_TOKEN, GITHUB_TOKEN and GITHUB_REPOSITORY are needed'); process.exit(1) }

const res = await fetch(`${SITE}/api/suggest`, { headers: { Authorization: `Bearer ${token}` } })
if (!res.ok) { console.error(`site answered ${res.status}`); process.exit(1) }
const { suggestions = [] } = await res.json()
console.log(`${suggestions.length} suggestion(s)`)

const field = (label, value) => `### ${label}\n\n${value || '_No response_'}\n`
for (const s of suggestions) {
  const entry = { name: s.name, url: s.url, category: s.category, description: s.description, ...(s.install_cmd ? { install_cmd: s.install_cmd } : {}) }
  const problems = check(entry)
  if (problems.length) { console.log(`skipped ${s.name}: ${problems.join('; ')}`); continue }
  const body = [
    field('Name', s.name),
    field('Link', s.url),
    field('Kind', s.category),
    field('What it does', s.description),
    field('Install command', s.install_cmd),
    field('Tags', (s.tags || []).join(', ')),
    field('Your connection', s.maker ? '- [X] I made this tool' : '- [ ] I made this tool'),
    '_Sent from the Suggest a tool form on skillscout.si._',
  ].join('\n')
  const r = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${gh}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: `Suggest: ${s.name}`, body, labels: ['suggestion'] }),
  })
  console.log(`${r.ok ? 'opened' : `failed (${r.status})`}: ${s.name}`)
}
