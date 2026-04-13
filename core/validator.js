/**
 * core/validator.js — Plugin & skill validation (v2)
 *
 * Validates plugin manifests, skill files, and reference paths.
 * Used by: loader.js --validate, and auto-run before every sync.
 */

import fs from "fs"
import path from "path"
import { SEMVER_RE } from "./utils.js"

// ─── Result Helpers ───────────────────────────────────────────────────────────

function ok(name) { return { name, status: "pass" } }
function warn(name, message) { return { name, status: "warn", message } }
function fail(name, message) { return { name, status: "fail", message } }

// ─── Manifest Checks ──────────────────────────────────────────────────────────

function validateManifest(manifest) {
  const results = []

  // Required fields
  const required = ["name", "version", "description", "skills"]
  for (const field of required) {
    if (!manifest[field]) {
      results.push(fail(`manifest.${field}`, `Required field '${field}' is missing`))
    } else {
      results.push(ok(`manifest.${field}`))
    }
  }

  // Version format (semver)
  if (manifest.version && !SEMVER_RE.test(manifest.version)) {
    results.push(warn("manifest.version", `Version '${manifest.version}' is not valid semver (e.g. 1.0.0)`))
  }

  // minAgentVersion
  if (!manifest.minAgentVersion) {
    results.push(warn("manifest.minAgentVersion", "minAgentVersion not set — add for compatibility checking"))
  }

  // Skills array
  if (Array.isArray(manifest.skills)) {
    if (manifest.skills.length === 0) {
      results.push(fail("manifest.skills", "Plugin has no skills defined"))
    }
    // Check for duplicate IDs
    const ids = manifest.skills.map(s => s.id)
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
    if (dupes.length) {
      results.push(fail("manifest.skills.ids", `Duplicate skill IDs: ${dupes.join(", ")}`))
    }
    // Check for duplicate priorities
    const priorities = manifest.skills.map(s => s.priority)
    const dupePrios = priorities.filter((p, i) => priorities.indexOf(p) !== i)
    if (dupePrios.length) {
      results.push(warn("manifest.skills.priorities", `Duplicate priority values: ${dupePrios.join(", ")}`))
    }
  }

  // Validation schema
  if (manifest.validation?.requiredSkillIds) {
    const ids = manifest.skills?.map(s => s.id) ?? []
    for (const rid of manifest.validation.requiredSkillIds) {
      if (!ids.includes(rid)) {
        results.push(fail("manifest.validation.requiredSkillIds", `Required skill '${rid}' is not declared in skills array`))
      }
    }
  }

  return results
}

// ─── Skill File Checks ────────────────────────────────────────────────────────

function validateSkillFiles(pluginDir, manifest) {
  const results = []

  for (const skill of manifest.skills ?? []) {
    const skillPath = path.join(pluginDir, skill.file)

    if (!fs.existsSync(skillPath)) {
      results.push(fail(`skill:${skill.id}`, `File not found: ${skill.file}`))
      continue
    }

    const content = fs.readFileSync(skillPath, "utf-8")

    // Empty file
    if (content.trim().length < 50) {
      results.push(warn(`skill:${skill.id}`, `Skill file is very short (< 50 chars): ${skill.file}`))
    } else {
      results.push(ok(`skill:${skill.id}`))
    }

    // Has a heading
    if (!content.includes("# ")) {
      results.push(warn(`skill:${skill.id}:heading`, `No H1 heading found in ${skill.file}`))
    }

    // Has code examples
    if (!content.includes("```")) {
      results.push(warn(`skill:${skill.id}:examples`, `No code blocks found in ${skill.file} — skills should have examples`))
    }

    // Has anti-pattern section (optional but recommended)
    if (!content.toLowerCase().includes("anti-pattern")) {
      results.push(warn(`skill:${skill.id}:antipatterns`, `No anti-patterns section in ${skill.file}`))
    }
  }

  return results
}

// ─── Reference Checks ────────────────────────────────────────────────────────

function validateReference(pluginDir, manifest) {
  const results = []
  if (!manifest.validation?.requiredReferenceIds) return results

  for (const refEntry of manifest.reference ?? []) {
    const refPath = path.join(pluginDir, refEntry.path)
    if (!fs.existsSync(refPath)) {
      results.push(fail(`reference:${refEntry.id}`, `Reference path not found: ${refEntry.path}`))
    } else {
      const files = fs.readdirSync(refPath)
      if (files.length === 0) {
        results.push(warn(`reference:${refEntry.id}`, `Reference directory is empty: ${refEntry.path}`))
      } else {
        results.push(ok(`reference:${refEntry.id}`))
      }
    }
  }

  return results
}

// ─── Dependency Resolution ────────────────────────────────────────────────────

function validateDependencies(pluginDir, manifest, allPluginNames) {
  const results = []
  const deps = manifest.dependencies ?? []

  if (deps.length === 0) {
    results.push(ok("dependencies"))
    return results
  }

  for (const dep of deps) {
    const depName = typeof dep === "string" ? dep : dep.name
    if (!allPluginNames.includes(depName)) {
      results.push(fail(`dependency:${depName}`, `Dependency '${depName}' is not installed in plugins/`))
    } else {
      results.push(ok(`dependency:${depName}`))
    }
  }

  return results
}

// ─── Main Validator ───────────────────────────────────────────────────────────

export function validatePlugin(pluginDir, manifest, allPluginNames = []) {
  const results = [
    ...validateManifest(manifest),
    ...validateSkillFiles(pluginDir, manifest),
    ...validateReference(pluginDir, manifest),
    ...validateDependencies(pluginDir, manifest, allPluginNames),
  ]

  const failures = results.filter(r => r.status === "fail")
  const warnings = results.filter(r => r.status === "warn")
  const passes = results.filter(r => r.status === "pass")

  return { results, failures, warnings, passes, isValid: failures.length === 0 }
}

// ─── Report Printer ───────────────────────────────────────────────────────────

export function printValidationReport(pluginName, { results, failures, warnings, passes, isValid }) {
  const icon = isValid ? "✅" : "❌"
  console.log(`\n${icon} Validation: ${pluginName}`)
  console.log(`   ${passes.length} passed · ${warnings.length} warnings · ${failures.length} failed\n`)

  for (const r of results) {
    if (r.status === "fail") console.log(`   ❌ [${r.name}] ${r.message}`)
    if (r.status === "warn") console.log(`   ⚠  [${r.name}] ${r.message}`)
    if (r.status === "pass") {
      // Only print passes in debug/verbose mode
    }
  }
}
