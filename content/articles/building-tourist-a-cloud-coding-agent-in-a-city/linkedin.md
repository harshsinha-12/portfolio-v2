# LinkedIn launch copy

Most coding agents still behave like a very smart intern who forgets the office every morning.

They can search a repo, edit files, run tests, and open a pull request. Tomorrow they rediscover the same architecture, retry the approach that already failed, and dump half the codebase into the prompt "just in case."

The model is not the bottleneck anymore. The session is.

I'm building Tourist: a cloud coding agent you would connect to a GitHub repo with your own OpenAI key. You describe the work; an isolated agent edits, tests, and opens a PR. That loop is the goal, and it has not shipped yet.

The first slice does run. A versioned protocol and deterministic generator turn a fixture repo into an interactive isometric city. Files get their own buildings, and a public fixture report links sections to files, tests, and PR anchors.

Under it I'm building four things most chat-wrapped agents skip:

- a context engine that discovers files, logs, skills, and memories instead of preloading them
- scoped memory, with Global Memory treated as dangerous by default
- trajectories and rewards from day one — structured policy learning later, not "RL on GPT"
- a generated software city, already working for a fixture report and intended later to reflect live agent events

The article is a build plan with a progress checkpoint. The fixture city is underway. A solo agent still has to open a real PR before the multi-agent, tool-builder, or learning claims make sense.

The city makes the work visible. The next proof is whether the agent can ship.

Read the full article: /articles/building-tourist-a-cloud-coding-agent-in-a-city

## Publishing notes

- Final URL:
- Media to attach: Pixel-Art Software Development Island City (article image; do not replace the custom Open Graph card)
- People or companies to mention: Cursor (dynamic context discovery, semantic search), OpenAI Agents SDK, Daytona
- Published post URL:
