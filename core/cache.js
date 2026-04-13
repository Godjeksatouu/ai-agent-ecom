/**
 * core/cache.js — Skill file caching layer (v2)
 *
 * Tracks file mtimes and skips re-reading unchanged files.
 * Cache index is stored as JSON in .agent-cache/index.json
 */

import fs from "fs"
import path from "path"
import crypto from "crypto"

export class SkillCache {
  #cacheDir
  #indexPath
  #index = {}
  #enabled

  constructor({ cacheDir, enabled = true, root }) {
    this.#enabled = enabled
    this.#cacheDir = path.resolve(root, cacheDir)
    this.#indexPath = path.join(this.#cacheDir, "index.json")
    if (this.#enabled) this.#load()
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /**
   * Returns cached content if the file hasn't changed, else null.
   */
  get(filePath) {
    if (!this.#enabled) return null
    const entry = this.#index[filePath]
    if (!entry) return null

    try {
      const mtime = fs.statSync(filePath).mtimeMs
      if (mtime === entry.mtime) return entry.content
    } catch {
      // File no longer exists — invalidate
      delete this.#index[filePath]
    }
    return null
  }

  /**
   * Store content in cache with current mtime.
   */
  set(filePath, content) {
    if (!this.#enabled) return
    try {
      const mtime = fs.statSync(filePath).mtimeMs
      this.#index[filePath] = { mtime, content, hash: this.#hash(content) }
    } catch {
      // Ignore stat errors
    }
  }

  /**
   * Persist cache index to disk.
   */
  save() {
    if (!this.#enabled) return
    fs.mkdirSync(this.#cacheDir, { recursive: true })
    fs.writeFileSync(this.#indexPath, JSON.stringify(this.#index, null, 2), "utf-8")
  }

  /**
   * Invalidate a single file entry.
   */
  invalidate(filePath) {
    delete this.#index[filePath]
  }

  /**
   * Clear entire cache.
   */
  clear() {
    this.#index = {}
    if (fs.existsSync(this.#indexPath)) {
      fs.unlinkSync(this.#indexPath)
    }
  }

  get stats() {
    return {
      entries: Object.keys(this.#index).length,
      enabled: this.#enabled,
    }
  }

  // ─── Private ─────────────────────────────────────────────────────────────────

  #load() {
    if (fs.existsSync(this.#indexPath)) {
      try {
        this.#index = JSON.parse(fs.readFileSync(this.#indexPath, "utf-8"))
      } catch {
        this.#index = {} // Corrupt cache → start fresh
      }
    }
  }

  #hash(content) {
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 8)
  }
}
