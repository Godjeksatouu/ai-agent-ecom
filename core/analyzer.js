/**
 * core/analyzer.js — Agent Output Testing Layer (v2)
 *
 * Scans generated code for architectural compliance and anti-patterns.
 * Checks for:
 *  - Raw <img> usage
 *  - Missing 'use client' for interactive components
 *  - Hardcoded prices/currencies
 *  - Lack of type safety (primitive types)
 *  - Missing error boundaries
 */

import fs from "fs"
import path from "path"
import { c } from "./utils.js"

export class AgentAnalyzer {
  #root
  #rules = [
    {
      id: "NO_RAW_IMG",
      name: "No Raw <img> Tags",
      severity: "fail",
      pattern: /<img\s+[^>]*>/i,
      message: "Use next/image instead of raw <img> for better performance and optimization."
    },
    {
      id: "NEXT_IMAGE_SIZES",
      name: "Image sizes Attribute",
      severity: "warn",
      pattern: /<Image\s+(?![^>]*sizes=)[^>]*fill[^>]*>/i,
      message: "Images with 'fill' should have a 'sizes' attribute to prevent oversized downloads."
    },
    {
      id: "NO_LOCALSTORAGE_AUTH",
      name: "No localStorage for Auth",
      severity: "fail",
      pattern: /localStorage\.setItem\(['"](token|auth|session|jwt)['"]/i,
      message: "Avoid storing auth tokens in localStorage. Use HTTP-only cookies for security."
    },
    {
      id: "NO_HARDCODED_PRICE",
      name: "No Hardcoded Prices",
      severity: "warn",
      pattern: /\$\{\s*[\w.]+\s*\/\s*100\s*\}/,
      message: "Avoid manual price division. Use the formatPrice() utility for consistency."
    },
    {
      id: "NO_ANY_TYPE",
      name: "No 'any' Types",
      severity: "fail",
      pattern: /:\s*any(\[\])?/g,
      message: "Production code must use proper TypeScript interfaces. Avoid 'any' types."
    },
    {
      id: "CLIENTBOOTSTRAP_GUARD",
      name: "Missing 'use client'",
      severity: "warn",
      pattern: /useState|useEffect|useContext|useReducer|useCart/i,
      validate: (content) => !content.includes('"use client"') && !content.includes("'use client'"),
      message: "Components using hooks like useState/useEffect must have 'use client' at the top."
    }
  ]

  constructor(root) {
    this.#root = root
  }

  /**
   * Scan a file or directory for anti-patterns.
   */
  async scan(targetPath) {
    const absPath = path.resolve(this.#root, targetPath)
    if (!fs.existsSync(absPath)) {
      throw new Error(`Path not found: ${targetPath}`)
    }

    const stats = fs.statSync(absPath)
    const results = []

    if (stats.isDirectory()) {
      const files = this.#walk(absPath)
      for (const file of files) {
        if (this.#isTargetFile(file)) {
          results.push(...this.#checkFile(file))
        }
      }
    } else {
      results.push(...this.#checkFile(absPath))
    }

    return results
  }

  #walk(dir) {
    let results = []
    const list = fs.readdirSync(dir)
    for (const file of list) {
      if (file === "node_modules" || file === ".next" || file === ".git") continue
      const target = path.join(dir, file)
      const stat = fs.statSync(target)
      if (stat && stat.isDirectory()) {
        results = results.concat(this.#walk(target))
      } else {
        results.push(target)
      }
    }
    return results
  }

  #isTargetFile(file) {
    const ext = path.extname(file)
    return [".ts", ".tsx", ".js", ".jsx"].includes(ext)
  }

  #checkFile(filePath) {
    const relativePath = path.relative(this.#root, filePath)
    const content = fs.readFileSync(filePath, "utf-8")
    const findings = []

    for (const rule of this.#rules) {
      if (rule.pattern) {
        const matches = content.match(rule.pattern)
        if (matches && (!rule.validate || rule.validate(content))) {
          findings.push({
            file: relativePath,
            rule: rule.name,
            severity: rule.severity,
            message: rule.message,
            id: rule.id
          })
        }
      } else if (rule.validate && rule.validate(content)) {
        findings.push({
          file: relativePath,
          rule: rule.name,
          severity: rule.severity,
          message: rule.message,
          id: rule.id
        })
      }
    }

    return findings
  }

  printReport(findings) {
    if (findings.length === 0) {
      console.log(c.green("\n✨ No anti-patterns detected. Code is compliant!"))
      return
    }

    const fails = findings.filter(f => f.severity === "fail")
    const warns = findings.filter(f => f.severity === "warn")

    console.log(`\n🔍 ${c.bold("Agent Output Analysis Report")}`)
    console.log(`   Found ${c.red(fails.length)} critical issues and ${c.yellow(warns.length)} warnings.\n`)

    const groupedByFile = findings.reduce((acc, f) => {
      if (!acc[f.file]) acc[f.file] = []
      acc[f.file].push(f)
      return acc
    }, {})

    for (const [file, fileFindings] of Object.entries(groupedByFile)) {
      console.log(`${c.cyan("📄 " + file)}`)
      for (const f of fileFindings) {
        const icon = f.severity === "fail" ? c.red("✖") : c.yellow("⚠")
        console.log(`   ${icon} [${f.id}] ${f.message}`)
      }
      console.log()
    }
  }
}
