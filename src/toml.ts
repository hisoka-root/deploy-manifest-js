import { parse as parseToml, stringify as stringifyToml } from 'smol-toml'
import type { DeployManifest } from './types.js'

export function parse(input: string): DeployManifest {
  return parseToml(input) as unknown as DeployManifest
}

export function stringify(manifest: DeployManifest): string {
  return stringifyToml(manifest as never)
}
