# LinkedIn launch copy

Most coding agents still behave like a very smart intern who forgets the office every morning.

They can search a repo, edit files, run tests, and open a pull request. Tomorrow they rediscover the same architecture, retry the approach that already failed, and dump half the codebase into the prompt "just in case."

The model is not the bottleneck anymore. The session is.

I'm about to build Tourist: a cloud coding agent you connect to a GitHub repo with your own OpenAI key. You describe the work. It inspects the codebase, edits and tests in an isolated sandbox, and opens a PR. That loop is the product.

Under it I'm building four things most chat-wrapped agents skip:

- a context engine that discovers files, logs, skills, and memories instead of preloading them
- scoped memory, with Global Memory treated as dangerous by default
- trajectories and rewards from day one — structured policy learning later, not "RL on GPT"
- a generated software city, used first as a shareable report, later as a live world

The article is a build plan, not a retrospective. Two tracks start now: a city schema that can render fixture reports, and a solo agent that has to open a real PR before anything fancier is allowed. Multi-agent, a tool factory, and live-autonomous-city claims are gated on purpose.

The city is the brand. The PR loop is the product. If I confuse those, I'll spend three months making buildings prettier while the agent still can't ship.

Read the full article: /articles/building-tourist-a-cloud-coding-agent-in-a-city

## Publishing notes

- Final URL:
- Media to attach: dual-track mermaid / city mapping
- People or companies to mention: Cursor (dynamic context discovery, semantic search), OpenAI Agents SDK, Daytona
- Published post URL:
