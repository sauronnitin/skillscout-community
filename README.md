# SkillScout community list

Tools people add by hand: MCP servers, agent skills, plugins, apps and extensions that [SkillScout](https://skillscout.si) should know about. SkillScout reads `tools.json` from this repo every hour and scores each entry against a visitor's profile, next to its 40+ other sources.

Your own tool is welcome. Every entry is reviewed before it goes live.

## Add a tool

**No account needed:** use the Suggest it form under the results on [skillscout.si](https://skillscout.si/app). It lands here as an issue within the hour.

**With a GitHub account:** open a [Suggest a tool](../../issues/new?template=suggest-a-tool.yml) issue and fill in the form. When a maintainer labels it `accepted`, a bot checks it and adds it to the list.

**With a pull request:** add an entry to `tools.json`, run `node scripts/validate.mjs`, and open a PR.

```json
{
  "name": "Figma MCP",
  "url": "https://github.com/owner/figma-mcp",
  "category": "MCP Server",
  "description": "Reads Figma files and turns frames into React components that use your own design tokens.",
  "install_cmd": "claude mcp add figma -- npx -y figma-mcp",
  "tags": ["design", "figma", "react"]
}
```

| Field | Required | Rule |
|---|---|---|
| `name` | yes | 2 to 80 characters |
| `url` | yes | a full `https://` link to the tool, its repo or its store page |
| `category` | yes | `MCP Server`, `Claude Skill`, `Plugin`, `AI App`, `Extension`, `CLI Tool`, `Automation` or `Desktop App` |
| `description` | yes | 20 to 300 characters: what it does and for whom, in plain words |
| `install_cmd` | no | one of the shapes below, with no shell operators |
| `install_hint` | no | how to get it when it is not a command, 140 characters at most |
| `tags` | no | up to 8 short words |

## Install commands

People paste these into a terminal, so only these shapes pass the check:

- `npx [-y] <package> [args]`
- `npx skills add https://github.com/...`
- `claude mcp add <name> -- npx|uvx|docker run -i --rm ...`
- `claude mcp add <name> --transport http|sse https://...`
- `/plugin install <plugin>@<marketplace>`
- `code --install-extension <publisher.name>`
- `gemini extensions install https://github.com/...`
- `brew install [--cask] <name>`, `pip install <name>`, `uvx <name>`

Anything else goes in `install_hint` instead.

## For tool makers

Once your tool is on the list, you can show it in your README:

[![Listed on SkillScout](https://img.shields.io/badge/listed%20on-SkillScout-e6f77a?style=flat-square&labelColor=111111)](https://skillscout.si)

```markdown
[![Listed on SkillScout](https://img.shields.io/badge/listed%20on-SkillScout-e6f77a?style=flat-square&labelColor=111111)](https://skillscout.si)
```

## Other ways to help

- **Tell us when a pick is wrong.** Every pick in SkillScout has Good pick and Not for me buttons, and there is a Feedback box on every screen. That is how the ranking gets better.
- **Add a whole list.** If you keep an awesome list or a catalogue with a public file, open an issue with the link and SkillScout can read all of it.
- **Share it** with someone who is drowning in tools.

## What gets turned down

- Links that do not work, or tools that are not available yet
- Descriptions that are ads rather than a plain account of what the tool does
- Duplicates of a link already on the list

## License

The list is released under [CC0 1.0](LICENSE): anyone can use it for anything.
