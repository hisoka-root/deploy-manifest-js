import type { DeployManifest } from './types.js'

export function parse(input: string): DeployManifest {
  return JSON.parse(input) as DeployManifest
}

export function stringify(manifest: DeployManifest): string {
  return JSON.stringify(manifest, null, 2)
}
