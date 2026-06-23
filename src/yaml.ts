import { load, dump } from 'js-yaml'
import type { DeployManifest } from './types.js'

export function parse(input: string): DeployManifest {
  return load(input) as DeployManifest
}

export function stringify(manifest: DeployManifest): string {
  return dump(manifest, { indent: 2, lineWidth: 120, noRefs: true })
}
