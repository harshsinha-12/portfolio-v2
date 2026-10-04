# LinkedIn launch copy

Most coding agents still behave like a very smart intern who forgets the office every morning.

They can search a repo, edit files, run tests, and open a pull request. Tomorrow they rediscover the same architecture, retry the approach that already failed, and dump half the codebase into the prompt "just in case."

The model is not the bottleneck anymore. The session is.

I updated the Tourist build log against the repository as it stood on 29 September. The product is six layers. The city is the one you can open.

- City. A public GitHub repo loads as an island. Each file is a building. Folders are sectors. Tests, tools, review, and the harbor are landmarks.
- Agents. One coder, a coder–tester–reviewer chain, or an opt-in swarm. They search with ripgrep, edit, run node --test, and commit on a local branch. The cloud API can run the same loop in a Daytona sandbox and return a patch.
- Scoring. A finished run stores reward_v1: tests, whether a diff exists, tokens, and latency. Pull request, CI, merge, and revert join that same score later.
- Memory. User, codebase, and episodic notes. Today that is a JSON file and keyword overlap, at most eight notes. Postgres, embeddings, and code rules are the next memory stage. Global memory stays off.
- Reinforcement learning. The policy learns discrete choices — model, topology, context, tools, memory, when to stop, which tests — from those scores. It does not train the model that writes the code. The decision table is specified. Nothing is promoted yet.
- GitHub delivery. A GitHub App pushes the task branch and opens a pull request. Today create_pull_request records the call.

The tool builder that exists can register a line counter for one run, after its fixtures pass. The city draws the files. Builders stay at town hall until a live edit is wired to a building. The harbor is waiting on that pull request.

The article is the build plan and the progress marker. The next proof is a connected repo, a real PR, and a building that moves because of that run.

Read the full article: /articles/building-tourist-a-cloud-coding-agent-in-a-city

## Publishing notes

- Final URL:
- Media to attach: Pixel-Art Software Development Island City (article image; do not replace the custom Open Graph card)
- People or companies to mention: Cursor (dynamic context discovery, semantic search), Vercel AI SDK, Daytona, OpenAI sandbox agents
- Published post URL:
