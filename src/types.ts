export interface DeployManifest {
  version: number
  app: App
  runtime: Runtime
  build?: Build
  start: Start
  workers?: Record<string, Worker>
  env?: Record<string, EnvValue>
  network?: Network
  storage?: Storage[]
  services?: Record<string, Service>
  health?: Health
  scaling?: Scaling
  cron?: CronJob[]
  [key: `x-${string}`]: unknown
}

export interface App {
  name: string
  description?: string
  homepage?: string
  repository?: string
  labels?: Record<string, string>
}

export interface Runtime {
  type: string
  version?: string
}

export interface Build {
  strategy: string
  commands?: string[]
  variables?: Record<string, EnvValue>
}

export type Start = string | Record<string, string>

export interface Worker {
  command: string
  replicas: number
}

export type EnvValue = string | { secret: string }

export interface Network {
  port?: number
  domains?: string[]
  routes?: string[]
}

export interface Storage {
  name: string
  mount: string
  size?: string
  ephemeral?: boolean
}

export interface Service {
  type: string
  version?: string
}

export interface HealthCheck {
  path?: string
  command?: string
  interval?: string
  timeout?: string
}

export type Health = HealthCheck

export interface Scaling {
  min?: number
  max?: number
  cpu_target?: number
}

export interface CronJob {
  name: string
  schedule: string
  command: string
}

export type Format = 'yaml' | 'json' | 'toml'

export interface ValidationError {
  field: string
  message: string
}
