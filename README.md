# 🛒 AI Agent eCommerce — v2.2

> **The Ultimate AI-to-Developer Bridge.** A production-grade, plugin-based agent system designed to supercharge **Cursor**, **VS Code**, and **Antigravity** with deep eCommerce expertise and high-performance motion design.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: 2.2.0](https://img.shields.io/badge/Version-2.2.0-blue.svg)]()
[![Context: Premium](https://img.shields.io/badge/Context-Premium-green.svg)]()

---

## 🧠 What is AI Agent eCommerce?

This is a **local-first AI Agent Architecture** that transforms generic AI models (Claude, Gemini, GPT-4) into expert eCommerce engineers. By using a modular **Plugins + Skills** system, it injects structured domain knowledge directly into your IDE's reasoning loop.

### Why use this?
- **🧠 Advanced Reasoning**: Built-in `THINK` → `PLAN` → `EXECUTE` → `REVIEW` reasoning protocol.
- **⚡ Performance First**: Zero-reflow, GPU-accelerated motion system included.
- **🧩 Modular Plugins**: Scalable architecture for storefronts, backends, and integrations.
- **🔍 Automated Compliance**: CLI-based analyzer to catch anti-patterns before they ship.
- **🚀 Multi-Editor Native**: First-class support for Cursor, VS Code, and Antigravity.

---

## 🚀 Quick Start

Get your production eCommerce agent environment ready in under 60 seconds.

### 1. Initialize with npx
Run the interactive setup wizard in your project root:

```bash
npx ai-agent-ecom --init
```

### 2. Follow the Wizard
- **Detection**: Automatically detects existing installations for repair/upgrade.
- **IDE Choice**: Select between **VS Code**, **Cursor**, **Antigravity**, or **All**.
- **Scaffolding**: Installs the core runtime, default plugins, and animation system.

### 3. Synchronize Rules
Populate your editor with the expert eCommerce skills:

```bash
npx ai-agent-ecom --sync
```

---

## 📁 System Architecture

```text
├── .cursor/rules/             # AI Instructions for Cursor (.mdc)
├── .vscode/instructions/      # AI Instructions for GitHub Copilot
├── .antigravity/rules/        # AI Instructions for Antigravity Agent
├── animations/                # GPU-accelerated motion system
├── core/                      # Agent Runtime (Loader, Cache, Analyzer)
├── plugins/                   # The Skill Library
│   └── ecommerce-storefront/  # Expert skills for Next.js stores
├── agent.config.json          # Global Agent Configuration
└── package.json               # CLI & dependency management
```

---

## 🛠 Available Commands

The `ai-agent-ecom` CLI provides a full suite of developer tools:

| Command | Description |
|---------|-------------|
| `--init` | Launches the interactive setup wizard |
| `--sync` | Generates active rules for your selected IDE |
| `--validate` | Validates plugin manifests and skill integrity |
| `--analyze <path>` | Scans code for eCommerce anti-patterns & compliance |
| `--watch` | Live-syncs rule changes during skill development |
| `--cache-clear` | Clears the mtime-based skill cache |

---

## 🧩 eCommerce Storefront Plugin

The default plugin includes **8 expert-level skills** and a full **Reference Library**:

1.  **Architecture**: Next.js App Router, patterns, and folder structure.
2.  **Product Components**: Conversational-driven product UI and SEO.
3.  **Cart & Checkout**: State management and payment orchestration.
4.  **Performance & SEO**: Web Vitals optimization and metadata strategies.
5.  **Auth & Accounts**: Secure customer session management.
6.  **API Integration**: Data fetching and caching strategies.
7.  **Anti-Patterns**: Automatic self-critique rules (The Mental Loop).
8.  **Animations**: High-performance Framer Motion patterns.

---

## 🤖 Example Usage Prompts

Once configured, your AI assistant (e.g., Claude in Cursor) will automatically use these skills. Try these prompts:

- *"Generate a high-performance Product Card using the system animation variants."*
- *"Implement a Checkout Step transition that follows the Cart/Checkout skill."*
- *"Analyze this component for architectural compliance and anti-patterns."*
- *"Build a staggered product grid that respects the 'gentle' ease tokens."*

---

## 🚀 Performance Rules
Every line of code the agent generates follows these production constraints:
- **GPU Only Animations**: Only animate `opacity` and `transform`.
- **Zero CLS**: No layout-shifting properties in transitions.
- **Type Safety**: Standardized TypeScript interfaces across all components.
- **Lazy Loading**: Automatic use of `LazyMotion` for minimal JS bundles.

---

## 🤝 Contributing
Built with Mohamedamine Satou by AI Agent Architects. To add new plugins or skills, check the `plugins/README.md`.

## 📄 License
MIT © 2026 AI Agent eCommerce.
