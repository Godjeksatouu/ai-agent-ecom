/**
 * core/utils.js — Shared utilities (v2)
 */

export const SEMVER_RE = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/

/**
 * Compare two semver strings. Returns:
 *   1  if a > b
 *  -1  if a < b
 *   0  if equal
 */
export function compareSemver(a, b) {
  const parse = v => v.split("-")[0].split(".").map(Number)
  const [aMajor, aMinor, aPatch] = parse(a)
  const [bMajor, bMinor, bPatch] = parse(b)
  if (aMajor !== bMajor) return aMajor > bMajor ? 1 : -1
  if (aMinor !== bMinor) return aMinor > bMinor ? 1 : -1
  if (aPatch !== bPatch) return aPatch > bPatch ? 1 : -1
  return 0
}

/**
 * Check if plugin requires a minimum agent version.
 */
export function checkAgentVersionCompatibility(agentVersion, pluginManifest) {
  const min = pluginManifest.minAgentVersion
  if (!min) return { compatible: true }
  if (compareSemver(agentVersion, min) < 0) {
    return {
      compatible: false,
      reason: `Plugin '${pluginManifest.name}' requires agent v${min}+, but current version is v${agentVersion}`
    }
  }
  return { compatible: true }
}

/**
 * Resolve plugin load order respecting dependencies (topological sort).
 * Throws on circular dependencies.
 */
export function resolveLoadOrder(activePluginNames, allManifests) {
  const manifestMap = new Map(allManifests.map(m => [m.manifest.name, m]))
  const visited = new Set()
  const order = []

  function visit(name, stack = []) {
    if (stack.includes(name)) {
      throw new Error(`Circular plugin dependency detected: ${[...stack, name].join(" → ")}`)
    }
    if (visited.has(name)) return
    const entry = manifestMap.get(name)
    if (!entry) throw new Error(`Plugin '${name}' not found`)

    const deps = entry.manifest.dependencies ?? []
    for (const dep of deps) {
      const depName = typeof dep === "string" ? dep : dep.name
      visit(depName, [...stack, name])
    }

    visited.add(name)
    order.push(name)
  }

  for (const name of activePluginNames) visit(name)
  return order
}

/**
 * Simple keyword-based skill selector.
 * Scores each skill against a task description and returns sorted skills.
 */
export function selectRelevantSkills(skills, taskDescription, maxSkills = 10) {
  if (!taskDescription) return skills.slice(0, maxSkills)

  const taskLower = taskDescription.toLowerCase()

  const scored = skills.map(skill => {
    const triggers = skill.triggers ?? []
    const matches = triggers.filter(t => taskLower.includes(t.toLowerCase()))
    // Also match description words
    const descWords = (skill.description ?? "").toLowerCase().split(/\s+/)
    const descMatches = descWords.filter(w => w.length > 4 && taskLower.includes(w))
    const score = (matches.length * 3) + descMatches.length + (6 - (skill.priority ?? 5))
    return { ...skill, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSkills)
}

/**
 * Format elapsed time in human-readable form.
 */
export function formatDuration(startMs) {
  const ms = Date.now() - startMs
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
}

/**
 * Colorize terminal output (no external deps).
 */
export const c = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
}
