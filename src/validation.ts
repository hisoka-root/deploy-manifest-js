import type { DeployManifest, ValidationError } from './types.js'

const SUPPORTED_RUNTIMES = [
  'php', 'node', 'python', 'rust', 'go', 'java', 'bun', 'deno', 'static', 'custom',
]

const SUPPORTED_BUILD_STRATEGIES = [
  'auto', 'custom', 'dockerfile', 'buildpack', 'nixpacks', 'none',
]

export function validate(manifest: DeployManifest): ValidationError[] {
  const errors: ValidationError[] = []

  if (manifest.version !== 1) {
    errors.push({ field: 'version', message: `unsupported version ${manifest.version}, expected 1` })
  }

  if (!manifest.app?.name) {
    errors.push({ field: 'app.name', message: 'required' })
  } else {
    if (manifest.app.name.length > 64) {
      errors.push({ field: 'app.name', message: 'maximum 64 characters' })
    }
    if (!/^[a-z0-9-]+$/.test(manifest.app.name)) {
      errors.push({ field: 'app.name', message: 'must be DNS-safe (lowercase alphanumeric and hyphens)' })
    }
  }

  if (!manifest.runtime?.type) {
    errors.push({ field: 'runtime.type', message: 'required' })
  } else if (!SUPPORTED_RUNTIMES.includes(manifest.runtime.type)) {
    errors.push({ field: 'runtime.type', message: `unsupported '${manifest.runtime.type}', expected one of: ${SUPPORTED_RUNTIMES.join(', ')}` })
  }

  if (manifest.build) {
    if (!SUPPORTED_BUILD_STRATEGIES.includes(manifest.build.strategy)) {
      errors.push({ field: 'build.strategy', message: `unsupported '${manifest.build.strategy}'` })
    }
    if (manifest.build.strategy === 'custom' && !manifest.build.commands) {
      errors.push({ field: 'build.commands', message: 'required for custom strategy' })
    }
  }

  if (!manifest.start) {
    errors.push({ field: 'start', message: 'at least one process required' })
  } else if (typeof manifest.start === 'object' && Object.keys(manifest.start).length === 0) {
    errors.push({ field: 'start', message: 'at least one process required' })
  }

  if (manifest.workers) {
    for (const [name, worker] of Object.entries(manifest.workers)) {
      if (!worker.command) {
        errors.push({ field: `workers.${name}.command`, message: 'required' })
      }
      if (worker.replicas < 1) {
        errors.push({ field: `workers.${name}.replicas`, message: 'must be >= 1' })
      }
    }
  }

  if (manifest.network?.port === 0) {
    errors.push({ field: 'network.port', message: 'must be between 1 and 65535' })
  }

  if (manifest.scaling) {
    const s = manifest.scaling
    if (s.min !== undefined && s.max !== undefined && s.min > s.max) {
      errors.push({ field: 'scaling', message: `min (${s.min}) must be <= max (${s.max})` })
    }
    if (s.cpu_target !== undefined && (s.cpu_target < 1 || s.cpu_target > 100)) {
      errors.push({ field: 'scaling.cpu_target', message: 'must be between 1 and 100' })
    }
  }

  if (manifest.health) {
    if (!manifest.health.path && !manifest.health.command) {
      errors.push({ field: 'health', message: 'requires path or command' })
    }
  }

  return errors
}
