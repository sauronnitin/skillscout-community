// What a tool entry must look like. Used by the PR check and by the issue
// importer, so both accept exactly the same things.

export const CATEGORIES = ['MCP Server', 'Claude Skill', 'Plugin', 'AI App', 'Extension', 'CLI Tool', 'Automation', 'Desktop App']

// An install command is shown to people who will paste it into a terminal,
// so only a few known, harmless shapes are allowed, with no shell operators.
const SAFE = '[\\w@./:=+-]+'
const INSTALL = [
  `npx (?:-y )?${SAFE}(?: ${SAFE})*`,
  `npx skills add https://github\\.com/[\\w./-]+`,
  `claude mcp add [\\w-]+ --transport (?:http|sse) https://${SAFE}`,
  `claude mcp add [\\w-]+ -- (?:npx(?: -y)?|uvx|docker run -i --rm) ${SAFE}(?: ${SAFE})*`,
  `/plugin install [\\w.-]+@[\\w.-]+`,
  `code --install-extension [\\w.-]+`,
  `gemini extensions install https://github\\.com/[\\w./-]+`,
  `brew install(?: --cask)? [\\w@.-]+`,
  `pip install [\\w.\\[\\]-]+`,
  `uvx [\\w.-]+`,
].map(p => new RegExp(`^${p}$`))

export const safeInstall = (cmd) => !cmd || (!/[;&|`$<>(){}\\\n]/.test(cmd) && INSTALL.some(re => re.test(cmd)))

const isHttps = (u) => { try { return new URL(u).protocol === 'https:' } catch { return false } }

// Returns a list of problems; an empty list means the entry is fine.
export function check(t) {
  const errs = []
  const s = (v) => typeof v === 'string' ? v.trim() : ''
  if (s(t.name).length < 2 || s(t.name).length > 80) errs.push('name: 2 to 80 characters')
  if (!isHttps(t.url)) errs.push('url: a full https:// link')
  if (!CATEGORIES.includes(t.category)) errs.push(`category: one of ${CATEGORIES.join(', ')}`)
  if (s(t.description).length < 20 || s(t.description).length > 300) errs.push('description: 20 to 300 characters, what it does in plain words')
  if (t.install_cmd != null && !safeInstall(s(t.install_cmd))) errs.push('install_cmd: not one of the allowed shapes (see README), or has shell operators')
  if (t.install_hint != null && (s(t.install_hint).length > 140)) errs.push('install_hint: 140 characters at most')
  if (t.tags != null && (!Array.isArray(t.tags) || t.tags.length > 8 || t.tags.some(x => typeof x !== 'string' || x.length > 30))) errs.push('tags: up to 8 short words')
  const extra = Object.keys(t).filter(k => !['name', 'url', 'category', 'description', 'install_cmd', 'install_hint', 'tags', 'added_by', 'added_at'].includes(k))
  if (extra.length) errs.push(`unknown fields: ${extra.join(', ')}`)
  return errs
}

export const keyOf = (t) => String(t.url || '').toLowerCase().replace(/\/+$/, '')
