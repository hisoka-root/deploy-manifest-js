import { describe, it, expect } from 'vitest'
import { parse, validate } from './index.js'
import type { DeployManifest } from './types.js'

const validYaml = `
version: 1
app:
  name: store
runtime:
  type: rust
start:
  command: ./server
`

describe('parse', () => {
  it('parses YAML', () => {
    const m = parse(validYaml, 'yaml')
    expect(m.version).toBe(1)
    expect(m.app.name).toBe('store')
  })

  it('parses JSON', () => {
    const m = parse(JSON.stringify({ version: 1, app: { name: 'test' }, runtime: { type: 'node' }, start: { web: 'app.js' } }), 'json')
    expect(m.version).toBe(1)
    expect(m.app.name).toBe('test')
  })
})

describe('validate', () => {
  it('returns no errors for a valid manifest', () => {
    const m = parse(validYaml, 'yaml')
    expect(validate(m)).toHaveLength(0)
  })

  it('rejects unsupported version', () => {
    const m = parse(`version: 999\napp:\n  name: x\nruntime:\n  type: rust\nstart:\n  command: ./x`, 'yaml')
    const errs = validate(m)
    expect(errs.some(e => e.field === 'version')).toBe(true)
  })

  it('rejects empty app name', () => {
    const m = parse(`version: 1\napp:\n  name: ''\nruntime:\n  type: rust\nstart:\n  command: ./x`, 'yaml')
    const errs = validate(m)
    expect(errs.some(e => e.field === 'app.name')).toBe(true)
  })

  it('rejects invalid runtime type', () => {
    const m = parse(`version: 1\napp:\n  name: test\nruntime:\n  type: cobol\nstart:\n  command: ./x`, 'yaml')
    const errs = validate(m)
    expect(errs.some(e => e.field === 'runtime.type')).toBe(true)
  })

  it('rejects invalid scaling', () => {
    const m = parse(`version: 1\napp:\n  name: test\nruntime:\n  type: rust\nstart:\n  command: ./x\nscaling:\n  min: 10\n  max: 5`, 'yaml') as DeployManifest
    const errs = validate(m)
    expect(errs.some(e => e.field === 'scaling')).toBe(true)
  })

  it('rejects missing start command', () => {
    const m = parse(`version: 1\napp:\n  name: test\nruntime:\n  type: rust\nstart:`, 'yaml') as DeployManifest
    const errs = validate(m)
    expect(errs.some(e => e.field === 'start')).toBe(true)
  })

  it('validates build variables', () => {
    const yaml = `
version: 1
app:
  name: test
runtime:
  type: node
build:
  strategy: custom
  commands:
    - npm run build
  variables:
    API_URL: https://api.example.com
    SECRET:
      secret: my-key
start:
  command: node app.js
`
    const m = parse(yaml, 'yaml')
    expect(validate(m)).toHaveLength(0)
    expect(m.build?.variables?.API_URL).toBe('https://api.example.com')
  })
})
