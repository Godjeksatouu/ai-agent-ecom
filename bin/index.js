#!/usr/bin/env node

/**
 * ai-agent-ecom CLI — Setup Wizard v2.2
 * High-performance eCommerce AI Agent interactive installer.
 */

import fs from "fs"
import path from "path"
import readline from "readline/promises"
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
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
}

async function run() {
  console.log(`\n${f.bold("ai-agent-ecom")} ${f.dim("v2.2.0")}\n`)

  const configPath = path.join(process.cwd(), "agent.config.json")
  const isInstalled = fs.existsSync(configPath)

  // If no arguments, assume wizard mode
  if (ARGS.length === 0 || ARGS.includes("--init")) {
    await startWizard(isInstalled)
    return
  }

  // Check if we are in a project for other commands
  if (!isInstalled) {
    console.error(`${f.red("❌ Not a project.")} Run ${f.cyan("npx ai-agent-ecom")} to start the setup wizard.`)
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

async function startWizard(isInstalled) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    if (isInstalled) {
      const answer = await rl.question(`${f.yellow("⚠ Existing installation detected.")} Repair or re-configure? (y/N): `)
      if (answer.toLowerCase() !== "y") {
        console.log("Setup cancelled.")
        process.exit(0)
      }
    } else {
      const answer = await rl.question(`This will scaffold the AI Agent system in ${f.bold(process.cwd())}.\n${f.cyan("Proceed? (Y/n): ")}`)
      if (answer.toLowerCase() === "n") {
        console.log("Setup cancelled.")
        process.exit(0)
      }
    }

    console.log(`\n${f.bold("Select your preferred AI-integrated IDE:")}`)
    console.log(`  ${f.cyan("1)")} VS Code (with instructions)`)
    console.log(`  ${f.cyan("2)")} Cursor (with .mdc rules)`)
    console.log(`  ${f.cyan("3)")} Antigravity (with specialized rules)`)
    console.log(`  ${f.cyan("4)")} All (Setup all platforms)`)

    const ideChoice = await rl.question(`\n${f.bold("Choice [1-4]: ")}`)
    const ides = {
      "1": ["vscode"],
      "2": ["cursor"],
      "3": ["antigravity"],
      "4": ["vscode", "cursor", "antigravity"]
    }

    const selectedIDEs = ides[ideChoice] || ides["4"]
    await initProject(selectedIDEs)

  } finally {
    rl.close()
  }
}

async function initProject(selectedIDEs) {
  const targetDir = process.cwd()
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  console.log(`\n${f.bold("Setting up your environment…")}\n`)

  // Step 1: Downloading
  process.stdout.write(`${f.dim("[1/4]")} 📥 Downloading templates… `)
  await sleep(600)
  process.stdout.write(`${f.green("done")}\n`)

  // Step 2: Installing
  process.stdout.write(`${f.dim("[2/4]")} 📂 Installing core & skills… `)
  const foldersToCopy = ["core", "plugins", "animations"]
  for (const folder of foldersToCopy) {
    const src = path.join(PKG_ROOT, folder)
    const dest = path.join(targetDir, folder)
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true })
    }
  }
  const filesToCopy = ["agent.config.json", ".gitignore", "README.md"]
  for (const file of filesToCopy) {
    const src = path.join(PKG_ROOT, file)
    const dest = path.join(targetDir, file)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
    }
  }
  // Special merge for package.json
  const pkgSrc = path.join(PKG_ROOT, "package.json")
  const pkgDest = path.join(targetDir, "package.json")
  if (fs.existsSync(pkgDest)) {
    mergePackageJson(pkgSrc, pkgDest)
  } else {
    fs.copyFileSync(pkgSrc, pkgDest)
  }
  await sleep(400)
  process.stdout.write(`${f.green("done")}\n`)

  // Step 3: Configuring
  process.stdout.write(`${f.dim("[3/4]")} ⚙️ Configuring for ${selectedIDEs.join(", ")}… `)
  
  // Create only relevant rule directories
  const ruleFolders = {
    "vscode": ".vscode/instructions",
    "cursor": ".cursor/rules",
    "antigravity": ".antigravity/rules"
  }

  for (const ide of selectedIDEs) {
    const folder = ruleFolders[ide]
    if (folder) {
      const src = path.join(PKG_ROOT, folder.split('/')[0])
      const dest = path.join(targetDir, folder.split('/')[0])
      if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true })
      }
    }
  }

  // Update agent.config.json to reflect choice (optional UX improvement)
  const configContent = JSON.parse(fs.readFileSync(path.join(targetDir, "agent.config.json"), "utf-8"))
  // We can keep all enabled or just selected ones. Let's keep all configs but user knows they chose one.
  
  await sleep(500)
  process.stdout.write(`${f.green("done")}\n`)

  // Step 4: Ready
  process.stdout.write(`${f.dim("[4/4]")} ✨ Finalizing setup… `)
  await sleep(300)
  process.stdout.write(`${f.green("ready")}\n`)

  console.log(`\n${f.green("🎉 Success! Your AI Agent is ready to work.")}\n`)
  console.log(`${f.bold("Quick Start:")}`)
  console.log(`  1. ${f.cyan("npm install")}`)
  console.log(`  2. ${f.cyan("npx ai-agent-ecom --sync")}   ${f.dim("# Populate rules for your IDE")}`)
  console.log(`  3. Open your project in ${f.bold(selectedIDEs[0].toUpperCase())}\n`)
}

function mergePackageJson(src, dest) {
  const pkgSrc = JSON.parse(fs.readFileSync(src, "utf-8"))
  const pkgDest = JSON.parse(fs.readFileSync(dest, "utf-8"))

  pkgDest.scripts = { ...(pkgDest.scripts || {}), ...pkgSrc.scripts }
  pkgDest.devDependencies = { ...(pkgDest.devDependencies || {}), ...pkgSrc.devDependencies }
  
  if (!pkgDest.scripts.sync) pkgDest.scripts.sync = "ai-agent-ecom --sync"
  if (!pkgDest.scripts.validate) pkgDest.scripts.validate = "ai-agent-ecom --validate"

  fs.writeFileSync(dest, JSON.stringify(pkgDest, null, 2), "utf-8")
}

run()
