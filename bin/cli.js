#!/usr/bin/env node

/**
 * ai-agent-ecom CLI
 * High-performance eCommerce AI Agent bootstrapper and context manager.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { main as runLoader } from "../core/loader.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, "..")
const ARGS = process.argv.slice(2)

const f = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
}

async function run() {
  console.log(`\n${f.bold("ai-agent-ecom")} ${f.dim("v2.0.0")}\n`)

  if (ARGS.includes("--init")) {
    await initProject()
    return
  }

  // Check if we are in a project
  const configPath = path.join(process.cwd(), "agent.config.json")
  if (!fs.existsSync(configPath) && ARGS.length > 0) {
    console.error(`${f.red("❌ Not a project.")} Run ${f.cyan("npx ai-agent-ecom --init")} first.`)
    process.exit(1)
  }

  // Proxy to loader
  try {
    await runLoader(ARGS)
  } catch (err) {
    console.error(`\n${f.red("❌")}: ${err.message}`)
    process.exit(1)
  }
}

async function initProject() {
  const targetDir = process.cwd()
  console.log(`${f.cyan("🚀")} Initializing AI Agent eCommerce system in ${f.bold(targetDir)}…`)

  const foldersToCopy = ["core", "plugins", "animations", ".cursor", ".vscode", ".antigravity"]
  const filesToCopy = ["agent.config.json", "package.json", ".gitignore", "README.md"]

  // 1. Copy Folders
  for (const folder of foldersToCopy) {
    const src = path.join(PKG_ROOT, folder)
    const dest = path.join(targetDir, folder)
    if (fs.existsSync(src)) {
      console.log(`   ${f.dim("Scaffolding")} ${folder}/…`)
      fs.cpSync(src, dest, { recursive: true })
    }
  }

  // 2. Copy Files
  for (const file of filesToCopy) {
    const src = path.join(PKG_ROOT, file)
    const dest = path.join(targetDir, file)
    if (fs.existsSync(src)) {
      if (file === "package.json" && fs.existsSync(dest)) {
        // Merge package.json instead of overwriting?
        console.log(`   ${f.dim("Merging")} ${file}…`)
        mergePackageJson(src, dest)
      } else {
        console.log(`   ${f.dim("Creating")} ${file}…`)
        fs.copyFileSync(src, dest)
      }
    }
  }

  console.log(`\n${f.green("✅ Project initialized successfully!")}`)
  console.log(`\n${f.bold("Next steps:")}`)
  console.log(`  1. Run ${f.cyan("npm install")}`)
  console.log(`  2. Run ${f.cyan("npx ai-agent-ecom --sync")} to generate editor rules`)
  console.log(`  3. Open with Cursor, VS Code, or Antigravity`)
}

function mergePackageJson(src, dest) {
  const pkgSrc = JSON.parse(fs.readFileSync(src, "utf-8"))
  const pkgDest = JSON.parse(fs.readFileSync(dest, "utf-8"))

  // Keep existing metadata, merge scripts and deps
  pkgDest.scripts = { ...(pkgDest.scripts || {}), ...pkgSrc.scripts }
  pkgDest.devDependencies = { ...(pkgDest.devDependencies || {}), ...pkgSrc.devDependencies }
  
  // Add our specific scripts if missing
  if (!pkgDest.scripts.sync) pkgDest.scripts.sync = "ai-agent-ecom --sync"
  if (!pkgDest.scripts.validate) pkgDest.scripts.validate = "ai-agent-ecom --validate"

  fs.writeFileSync(dest, JSON.stringify(pkgDest, null, 2), "utf-8")
}

run()
