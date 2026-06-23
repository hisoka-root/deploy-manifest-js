# deploy-manifest

Parse, validate, and serialize [Deploy Manifest Specification](https://github.com/hisoka-root/deploy-manifest) files.
Works in Node, Bun, Deno, and browsers.

```ts
import { parse, validate } from 'deploy-manifest'

const manifest = parse(yamlString, 'yaml')
const errors = validate(manifest)

if (errors.length === 0) {
  console.log(`${manifest.app.name} is valid`)
}
```

## Install

```sh
npm install deploy-manifest
```

## Usage

### Parse a string

```ts
import { parse } from 'deploy-manifest'

// From YAML
const m = parse(yamlStr, 'yaml')

// From JSON
const m = parse(jsonStr, 'json')

// From TOML
const m = parse(tomlStr, 'toml')
```

### Parse a file (Node, Bun, Deno)

```ts
import { parseFile } from 'deploy-manifest'

const m = await parseFile('deploy.yaml')
```

### Validate

```ts
import { validate } from 'deploy-manifest'

const errors = validate(manifest)
// errors: Array<{ field: string, message: string }>
// empty array = valid
```

### Serialize

```ts
import { stringify } from 'deploy-manifest'

const yaml = stringify(manifest, 'yaml')
const json = stringify(manifest, 'json')
const toml = stringify(manifest, 'toml')
```

### Frontend usage

No file I/O needed — just use `parse()` and `validate()` with a string
from a textarea, HTTP response, etc.

```ts
import { parse, validate } from 'deploy-manifest'

const input = await response.text()
const manifest = parse(input, 'yaml')
const errors = validate(manifest)
```

## API

| Function | Returns | Description |
|----------|---------|-------------|
| `parse(input, format)` | `DeployManifest` | Parse a string in the given format |
| `parseFile(path)` | `Promise<DeployManifest>` | Read and parse a file (auto-detects format) |
| `stringify(manifest, format)` | `string` | Serialize to a string |
| `validate(manifest)` | `ValidationError[]` | Validate against the spec (empty = valid) |

## License

MPL-2.0
