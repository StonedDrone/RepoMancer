/**
 * RepoMancer: Omega-Level Repository Analysis & Integration Engine
 * 
 * Gives AI agents (like FuX) superpowers to understand and use any codebase
 */

import { Octokit } from '@octokit/rest';
import axios from 'axios';
import * as cheerio from 'cheerio';
import MarkdownIt from 'markdown-it';

export interface RepoAnalysis {
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

export interface Capability {
  name: string;
  purpose: string;
  useCases: string[];
  example: string;
  filePath?: string;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'dev';
  purpose?: string;
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: Record<string, any>;
}

export class RepoMancer {
  private octokit: Octokit;
  private md: MarkdownIt;

  constructor(private githubToken?: string) {
    this.octokit = new Octokit({ auth: githubToken });
    this.md = new MarkdownIt();
  }

  /**
   * Analyze a GitHub repository
   */
  async analyze(repoUrl: string): Promise<RepoAnalysis> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);

    console.log(`Analyzing repository: ${owner}/${repo}`);

    const [repoData, languages, fileTree, readme] = await Promise.all([
      this.getRepoData(owner, repo),
      this.getLanguages(owner, repo),
      this.getFileTree(owner, repo),
      this.getReadme(owner, repo),
    ]);

    // Parse dependencies
    const dependencies = await this.parseDependencies(owner, repo, fileTree);

    // Identify entry points
    const entryPoints = this.identifyEntryPoints(fileTree);

    // Extract capabilities
    const coreCapabilities = await this.extractCapabilities(owner, repo, fileTree, dependencies);

    // Identify super powers
    const superPowers = this.identifySuperPowers(coreCapabilities, dependencies);

    // Extract API endpoints (if any)
    const apiSurface = await this.extractAPIEndpoints(owner, repo, fileTree);

    // Generate integration guide
    const integrationGuide = this.generateIntegrationGuide(repoData, dependencies, coreCapabilities);

    // Identify gotchas
    const gotchas = this.identifyGotchas(repoData, dependencies, readme);

    return {
      repoUrl,
      owner,
      repo,
      overview: {
        purpose: repoData.description || 'No description available',
        techStack: this.identifyTechStack(dependencies, languages),
        architecture: this.identifyArchitecture(fileTree, dependencies),
        languages,
      },
      coreCapabilities,
      superPowers,
      dependencies,
      entryPoints,
      apiSurface,
      integrationGuide,
      gotchas,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate markdown report from analysis
   */
  generateReport(analysis: RepoAnalysis): string {
    return `
# RepoMancer Analysis: ${analysis.owner}/${analysis.repo}

**Analyzed:** ${new Date(analysis.analyzedAt).toLocaleString()}  
**URL:** ${analysis.repoUrl}

## Overview

**Purpose:** ${analysis.overview.purpose}

**Tech Stack:** ${analysis.overview.techStack.join(', ')}

**Architecture:** ${analysis.overview.architecture}

**Languages:**
${Object.entries(analysis.overview.languages)
  .sort(([, a], [, b]) => b - a)
  .map(([lang, bytes]) => `- ${lang}: ${Math.round((bytes / Object.values(analysis.overview.languages).reduce((a, b) => a + b, 0)) * 100)}%`)
  .join('\n')}

## Super Powers ⚡️

${analysis.superPowers.length ? analysis.superPowers.map(p => `- ⭐ ��**${p}**`).join('\n') : 'No unique super powers identified.'}

## Core Capabilities

${analysis.coreCapabilities.map(cap => `
### ${cap.name}

**What it does:** ${cap.purpose}

**Use cases:**
${cap.useCases.map(uc => `- ${uc}`).join('\n')}

**Example:**
\``\`javascript
${cap.example}
\`\``
`).join('\n')}

## Integration Guide

${analysis.integrationGuide}

## Dependencies

${analysis.dependencies.length > 0 ? analysis.dependencies.map(dep => `- **${dep.name}** (\t`${dep.version}\`) - ${dep.type}${dep.purpose ? `\\n  ${dep.purpose}` : ''}`).join('\n') : 'No dependencies found.'}

## Entry Points

${analysis.entryPoints.map(ep => `- \`${ep}\``).join('\n')}

## API Surface

${analysis.apiSurface.length > 0 ? analysis.apiSurface.map(api => `- **${api.method}** \`${api.path}\`: ${api.description}`).join('\n') : 'No API endpoints identified.'}

## Gotchas & Constraints ⚠️

${analysis.gotchas.length > 0 ? analysis.gotchas.map(g => `- ⚠ ${g}`).join('\n') : 'No known gotchas identified.'}

---

**Powered by RepoMancer - Giving AI agents superpowers to understand and use any codebase**
`;
  }

  // Helper methods

  private parseRepoUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^.\/]+)\/([^.\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return { owner: match[1], repo: match[2] };
  }

  private async getRepoData(owner: string, repo: string) {
    const { data } = await this.octokit.repos.get({ owner, repo });
    return data;
  }

  private async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const { data } = await this.octokit.repos.listLanguages({ owner, repo });
      return data;
    } catch (error) {
      return {};
    }
  }

  private async getFileTree(owner: string, repo: string): Promise<string[]> {
    try {
      const { data } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: 'HEAD',
        recursive: 'true',
      });
      return data.tree.filter(item => item.type === 'blob').map(item => item.path!);
    } catch (error) {
      return [];
    }
  }

  private async getReadme(owner: string, repo: string): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getReadme({ owner, repo });
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return content;
    } catch (error) {
      return '';
    }
  }

  private async parseDependencies(owner: string, repo: string, fileTree: string[]): Promise<Dependency[]> {
    const dependencies: Dependency[] = [];

    // Check for package.json (Node.js)
    if (fileTree.includes('package.json')) {
      const pkgData = await this.getFileContent(owner, repo, 'package.json');
      if (pkgData) {
        try {
          const pkg = JSON.parse(pkgData);
          if (pkg.dependencies) {
            Object.entries(pkg.dependencies).forEach(([name, version]) => {
              dependencies.push({ name, version: version as string, type: 'production' });
            });
          }
          if (pkg.devDependencies) {
            Object.entries(pkg.devDependencies).forEach(([name, version]) => {
              dependencies.push({ name, version: version as string, type: 'dev' });
            });
          }
        } catch (error) {}
      }
    }

    return dependencies;
  }

  private identifyEntryPoints(fileTree: string[]): string[] {
    const entryPatterns = [
      'index.js', 'index.ts', 'index.jsx', 'index.tsx',
      'src/index.js', 'src/index.ts', 'src/index.jsx', 'src/index.tsx',
      'src/main.js', 'src/main.ts', 'src/App.jsx', 'src/App.tsx',
      'main.js', 'main.ts', 'app.js', 'app.ts',
      'main.py', '__main__.py',
    ];
    return fileTree.filter(f => entryPatterns.some(p => f.endsWith(p)));
  }

  private async extractCapabilities(owner: string, repo: string, fileTree: string[], dependencies: Dependency[]): Promise<Capability[]> {
    const capabilities: Capability[] = [];

    // Based on dependencies, infer capabilities
    const depMap = new Map(dependencies.map(d => [d.name, d]));

    if (depMap.has('react')) {
      capabilities.push({
        name: 'React UI Components',
        purpose: 'Build interactive user interfaces with component-based architecture',
        useCases: ['Create reusable UI components', 'Build interactive web applications'],
        example: `import React from 'react';\nimport { Component } from './path/to/component';`,
      });
    }

    if (depMap.has('@google/generative-ai') || depMap.has('openai')) {
      capabilities.push({
        name: 'Generative AI Integration',
        purpose: 'Connect to and use Generative AI models for text, image, and multimodal generation',
        useCases: ['Generate AI-powered content', 'Build chatbots', 'Create images'],
        example: `const response = await genAI.generateContent(prompt);`,
      });
    }

    if (depMap.has('@tensorflow/tfjs')) {
      capabilities.push({
        name: 'Machine Learning',
        purpose: 'Run machine learning models directly in the browser or Node.js',
        useCases: ['Image classification', 'Object detection', 'Pose estimation'],
        example: `const model = await tf.loadModel(modelUrl);`,
      });
    }

    if (depMap.has('three')) {
      capabilities.push({
        name: '3D Graphics & VR/AR',
        purpose: 'Create immersive 3D scenes, VR experiences, and AR visualizations',
        useCases: ['Build VR/AR experiences', 'Create 3D visualizations'],
        example: `const scene = new THREE.Scene();`,
      });
    }

    return capabilities;
  }

  private identifySuperPowers(capabilities: Capability[], dependencies: Dependency[]): string[] {
    const superPowers: string[] = [];

    // Identify unique combinations
    const hasAI = dependencies.some(d => 
      d.name.includes('generative') || d.name.includes('openai') || d.name.includes('gemini')
    );
    const hasML = dependencies.some(d => d.name.includes('tensorflow') || d.name.includes('tfjs'));
    const has3D = dependencies.some(d => d.name === 'three');

    if (hasAI && hasML) {
      superPowers.push('Emotion-Responsive AI - Detect emotions and generate content based on them');
    }

    if (hasAI && has3D) {
      superPowers.push('AI-Powered 3D Generation - Generate 3D scenes and VR environments from text prompts');
    }

    if (hasML && has3D) {
      superPowers.push('Real-Time Computer Vision in 3D - Detect objects, poses, faces in 3D space');
    }

    if (hasAI && hasML && has3D) {
      superPowers.push('Multimodal Creation Engine - Generate images, video, music, and 3D scenes from emotions and prompts');
    }

    return superPowers;
  }

  private async extractAPIEndpoints(owner: string, repo: string, fileTree: string[]): Promise<APIEndpoint[]> {
    // This is a simplified version - real implementation would parse code
    return [];
  }

  private identifyTechStack(dependencies: Dependency[], languages: Record<string, number>): string[] {
    const stack: string[] = [];
    const depNames = new Set(dependencies.map(d => d.name));

    if (depNames.has('react')) stack.push('React');
    if (depNames.has('vue')) stack.push('Vue');
    if (depNames.has('typescript')) stack.push('TypeScript');
    if (depNames.has('vite')) stack.push('Vite');
    if (depNames.has('@tensorflow/tfjs')) stack.push('TensorFlow.js');
    if (depNames.has('three')) stack.push('Three.js');
    if (depNames.has('@google/generative-ai')) stack.push('Google Gemini');

    // Add primary languages
    Object.keys(languages).slice(0, 3).forEach(lang => {
      if (!stack.includes(lang)) stack.push(lang);
    });

    return stack;
  }

  private identifyArchitecture(fileTree: string[], dependencies: Dependency[]): string {
    const hasSrcFolder = fileTree.some(f => f.startsWith('src/'));
    const hasServices = fileTree.some(f => f.includes('services'));
    const hasComponents = fileTree.some(f => f.includes('components'));
    const hasApi = fileTree.some(f => f.includes('api') || f.includes('routes'));

    if (hasSrcFolder && hasComponents && hasServices) return 'Monorepo with modular architecture';
    if (hasComponents) return 'Component-based architecture';
    if (hasApi) return 'API-driven architecture';
    return 'Standard repository structure';
  }

  private generateIntegrationGuide(repoData: any, dependencies: Dependency[], capabilities: Capability[]): string {
    return `To use this repository:\n\n1. Clone the repository:\n\t\t\`git clone ${repoData.clone_url}\`\n\n2. Install dependencies:\n\t\t${dependencies.length > 0 ? '\\`npm install\\` or \\`yarn\\`' : 'No dependencies found'}\n\n3. Start using the capabilities:\n${capabilities.map(c => `\t\t- ${c.name}`).join('\\n')}`;
  }

  private identifyGotchas(repoData: any, dependencies: Dependency[], readme: string): string[] {
    const gotchas: string[] = [];

    if (readme.includes('API key') || readme.includes('API_KEY')) {
      gotchas.push('Requires API keys for external services');
    }

    if (dependencies.length > 50) {
      gotchas.push('Large number of dependencies - install time may be significant');
    }

    return gotchas;
  }

  private async getFileContent(owner: string, repo: string, path: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.repos.getContent({ owner, repo, path });
      if ('content' in data) {
        return Buffer.from(data.content, 'base64').toString('utf8');
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

// Export for ESM
export default RepoMancer;
