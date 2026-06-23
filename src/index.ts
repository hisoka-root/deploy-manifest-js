import type { DeployManifest, Format, ValidationError } from './types.js'
import * as yaml from './yaml.js'
import * as json from './json.js'
import * as toml from './toml.js'
import { validate as validateManifest } from './validation.js'

export type { DeployManifest, Format, ValidationError }
export type {
  App, Runtime, Build, Start, Worker, EnvValue,
  Network, Storage, Service, Health, Scaling, CronJob,
} from './types.js'

function detectFormat(path: string): Format {
  const ext = path.split('.').pop()?.toLowerCase()
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  if (ext === 'json') return 'json'
  if (ext === 'toml') return 'toml'
  throw new Error(`unsupported format: .${ext}`)
}

const parsers: Record<Format, { parse(input: string): DeployManifest; stringify(manifest: DeployManifest): string }> = {
  yaml,
  json,
  toml,
}

/**
 * Parse a manifest string in the given format.
 * Works everywhere — Node, Bun, Deno, browsers.
 */
export function parse(input: string, format: Format): DeployManifest {
  return parsers[format].parse(input)
}

/**
 * Serialize a manifest to a string in the given format.
 */
export function stringify(manifest: DeployManifest, format: Format): string {
  return parsers[format].stringify(manifest)
}

/**
 * Read and parse a manifest file.
 * Uses runtime-appropriate file I/O:
 * - Node/Bun: fs.readFile
 * - Deno: Deno.readTextFile
 * - Browsers: throws (use parse() instead)
 */
export async function parseFile(path: string): Promise<DeployManifest> {
  const format = detectFormat(path)
  const content = await readFile(path)
  return parse(content, format)
}

/**
 * Validate a parsed manifest against the spec.
 * Returns an array of errors (empty array = valid).
 */
export function validate(manifest: DeployManifest): ValidationError[] {
  return validateManifest(manifest)
}

async function readFile(path: string): Promise<string> {
  const g = globalThis as Record<string, unknown>
  if (typeof g.Deno !== 'undefined') {
    const deno = g.Deno as { readTextFile: (p: string) => Promise<string> }
    return await deno.readTextFile(path)
  }
  const fs = await import('node:fs/promises')
  return await fs.readFile(path, 'utf-8')
}
