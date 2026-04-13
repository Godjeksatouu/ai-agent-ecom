# 🛒 AI Agent eCommerce — Local-First Plugin Agent System

> A production-ready, plugin-based AI agent system for building eCommerce applications inside **Cursor** and **VS Code**. Inspired by Medusa Agent Skills. No API keys required.

---

## 🧠 What Is This?

This is a **local-first AI agent system** that supercharges your editor's AI assistant (Claude, Gemini, GPT-4, etc.) with structured, domain-specific knowledge about eCommerce development.

It works by injecting **skills** (markdown files) as context into your AI model, giving it expert-level knowledge of:

- Storefront architecture (Next.js, React)
- Backend API design (Node.js, Express, Medusa.js)
- Admin panel patterns
- Payment & checkout flows
- Database schema design
- Performance & SEO best practices

---

## 📁 Project Structure

```
ai-agent-ecom/
├── .cursor/                        # Cursor IDE integration
│   ├── rules/                      # Cursor Rules (.mdc files)
│   └── skills/                     # Symlinked or copied skills
├── plugins/                        # All agent plugins
│   └── ecommerce-storefront/       # Example plugin
│       ├── plugin.json             # Plugin manifest
│       ├── skills/                 # Domain knowledge (.md files)
│       ├── reference/              # Component & feature references
│       └── README.md
├── core/                           # Plugin loader & agent core
│   ├── loader.js                   # Plugin/skill loader (Node.js CLI)
│   ├── registry.js                 # Plugin registry
│   └── context-builder.js          # Assembles context from skills
├── agent.config.json               # Global agent configuration
└── README.md                       # This file
```

---

## 🚀 Quick Start

### 1. Clone or integrate into your project

```bash
git clone https://github.com/yourorg/ai-agent-ecom.git
# or copy the `plugins/` and `.cursor/` folders into your project
```

### 2. Install core (optional CLI)

```bash
npm install
```

### 3. Load a plugin

```bash
node core/loader.js --plugin ecommerce-storefront
```

### 4. Open in Cursor

Cursor will automatically pick up rules from `.cursor/rules/`. Your AI assistant is now skill-enhanced.

---

## 🔌 Plugin Architecture

Each plugin is self-contained:

```
plugins/plugin-name/
├── plugin.json          # Manifest: name, version, skills, model hints
├── skills/              # .md files with expert knowledge
├── reference/           # Code snippets, component templates
└── README.md            # Plugin documentation
```

---

## 📖 Skills System

Skills are **markdown files** that serve as structured knowledge bases:

- Written as expert-level documentation
- Loaded as context by the agent
- Cover: architecture, patterns, best practices, anti-patterns

---

## 🧩 Available Plugins

| Plugin | Description |
|--------|-------------|
| `ecommerce-storefront` | Next.js storefront: components, layouts, cart, checkout |
| *(more coming)* | Backend APIs, Admin panel, Payment integrations |

---

## 🤝 Editor Integration

| Editor | Method |
|--------|--------|
| **Cursor** | `.cursor/rules/` + Project Rules |
| **VS Code** | `.vscode/instructions/` + GitHub Copilot custom instructions |

---

## 📄 License

MIT — Build freely, ship fast.
