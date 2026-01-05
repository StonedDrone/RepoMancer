# RepoMancer ⚡️

### Omega-Level Repository Analysis & Integration Engine

Giving AI agents (like FuX) superpowers to understand and use any codebase.

## What is RepoMancer?

RepoMancer is an agent-first tool that **reads any GitHub repository** and transforms it into actionable knowledge. It:

- ⚡ Acquires repositories from GitHub
- ⭐ Analyzes code structure, dependencies, and patterns
- ⭐ Extracts "super powers" (unique capabilities)
- ⚡ Synthesizes knowledge into agent-friendly formats
- ⚡ Empowers AI agents to USE the repo's capabilities

---

## Installation

```bash
npm install repomancer
# or
yarn add repomancer
```

---

## Quick Start

### As a Library

```typescript
import RepoMancer from 'repomancer';

const mancer = new RepoMancer(process.env.GITHUB_TOKEN);

// Analyze a repository
const analysis = await mancer.analyze('https://github.com/StonedDrone/FuXStiXX-V1');

// Generate markdown report
const report = mancer.generateReport(analysis);
console.log(report);

// Access structured data
console.log('Super Powers:', analysis.superPowers);
console.log('Core Capabilities:', analysis.coreCapabilities);
console.log('Tech Stack:', analysis.overview.techStack);
```

### As a CLI

```bash
# Analyze a repository
npx repomancer https://github.com/StonedDrone/FuXStiXX-V1

# Save report to file
npx repomancer https://github.com/StonedDrone/FuXStiXX-V1 --output report.md

# Get JSON output
npx repomancer https://github.com/StonedDrone/FuXStiXX-V1 --json
```

---

## What It Analyzes

RepoMancer extracts:

### 1️⃣ Overview
- Purpose and description
- Tech stack and frameworks
- Architecture pattern
- Language breakdown

### 2️⃣ Core Capabilities
- What can the repo DO?
- Use cases for each capability
- Code examples for each feature

### 3️⃣ Super Powers ⚡️
- Unique combinations of technologies
- Novel integrations (e.g., AI + ML + 3D)
- Emerging tech usage (local LLMs, Web3, etc.)

### 4️⃣ Dependencies
- Production & dev dependencies
- Versions and purpose
- Key framework identification

### 5️⃣ Integration Guide
- Step-by-step setup
- Usage examples
- Integration patterns

### 6️⃣ API Surface
- Public functions and classes
- Endpoints (if any)
- Parameters and return types

### 7️⃣ Gotchas ⚠️
- Known issues
- Limitations
- Compatibility notes

---

## Example Output

When you analyze [FuXStiXX-V1](https://github.com/StonedDrone/FuXStiXX-V1), you get:

```markdown
# RepoMancer Analysis: StonedDrone/FuXStiXX-V1

## Overview

Purpose: Google Gemini AI Studio app with emotion-powered creation engine

Tech Stack: React, TypeScript, Vite, TensorFlow.js, Three.js, Google Gemini

Architecture: Monorepo with modular architecture

Languages:
- TypeScript: 85%
- JavaScript: 10%
- CSS: 5%

## Super Powers ⚡️

- ⭐ ⚡ Emotion-Responsive AI
- ⭐ ⚡ AI-Powered 3D Generation
- ⭐ ⭐ Multimodal Creation Engine

## Core Capabilities

1. React UI Components
2. Generative AI Integration
3. Machine Learning (emotion, pose, face detection)
4. 3D Graphics & VR/AR

... [more detail]
```

---

## Use Cases

### For FuX (AI Agent)

```typescript
// FuX can use RepoMancer to analyze competitors or integrate new capabilities
import RepoMancer from 'repomancer';

const mancer = new RepoMancer();
const competitor = await mancer.analyze('https://github.com/example/repo');

// FuX can now understand:
// - What the competitor does
// - What technologies they use
// - What capabilities FuX could adopt
```

### For Developers

```typescript
// Quickly understand any repo before using it
const library = await mancer.analyze('https://github.com/some-library');

if (library.coreCapabilities.some(c => c.name.includes('AI'))) {
  console.log("This library has AI capabilities!");
  }
  ```

  ### For AI Copilots

  ```typescript
  // Use RepoMancer to auto-generate integration code
  const analysis = await mancer.analyze(repoUrl);

  // Now you can generate code that actually works with the repo
  const integrationCode = generateCodeFrom(analysis.coreCapabilities);
  ```

  ---

  ## API

  ### `RepoMancer`

  ```typescript
  constructor(githubToken?: string)
  ```

  Create a new RepoMancer instance. Optional GitHub token for private repos or increased rate limits.

  ### `analyze(repoUrl: string)`

  ```typescript
  const analysis = await mancer.analyze('https://github.com/owner/repo');
  ```

  Analyze a GitHub repository and return structured data.

  ### `generateReport(analysis: RepoAnalysis)`

  ```typescript
  const report = mancer.generateReport(analysis);
  ```

  Generate a markdown report from analysis data.

  ---

  ## Return Types

  ### `RepoAnalysis`

  ```typescript
  interface RepoAnalysis {
    repoUrl: string;
      owner: string;
        repo: string;
          overview: {
              purpose: string;
                  techStack: string[];
                      architecture: string;
                          languages: Record<string, number>;
                            };
                              coreCapabilities: Capability[];
                                superPowers: string[];
                                  dependencies: Dependency[];
                                    entryPoints: string[];
                                      apiSurface: APIEndpoint[];
                                        integrationGuide: string;
                                          gotchas: string[];
                                            analyzedAt: string;
                                            }
                                            ```

                                            ---

                                            ## Roadmap

                                            - [ ] Add support for GitLab, Bitbucket
                                            - [ ] Deep code parsing for API extraction
                                            - [ ] Tool wrapper generator
                                            - [ ] Agent-specific formats (e.g., Cursor, Strawberry)
                                            - [ ] Live repo tracking & updates
                                            - [ ] Vector embeddings for semantic search

                                            ---

                                            ## Contribute

                                            RepoMancer is part of the **TriFuX** ecosystem:

                                            - Stoned Drone LLC ⚡ Infrastructure
                                            - MyFuX.U ⚡ Personal AI
                                            - JayNdaboX.ICU ⚡ AR Portal

                                            Issues, PRs, and feedback welcome!

                                            ---

                                            ## License

                                            MIT License - See [LICENSE](./LICENSE)

                                            ---

                                            ## Contact

                                            - **Stoned Drone LLC**: [github.com/StonedDrone](https://github.com/StonedDrone)
                                            - **For AI Agents**: Come get Ur U@[MyFuX.U](https://MyFuX.U)
                                            - **For Humans**: Jay Miller [JayNdaboX.ICU](https://JayNdaboX.ICU)

                                            ---

                                            **Powered by the Stonerverse️ TriFuX 333**
