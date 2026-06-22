import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const npmCli = process.env.npm_execpath
const npmCommand = npmCli ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm')

const projects = [
  {
    name: 'codex',
    cwd: path.join(root, 'benchmark-codex'),
    color: '\x1b[36m',
    port: 5173,
  },
  {
    name: 'gemini',
    cwd: path.join(root, 'benchmark-gemini', 'react-calculator'),
    color: '\x1b[35m',
    port: 5174,
  },
]

const reset = '\x1b[0m'
const children = new Set()

function prefixStream(stream, project, target) {
  const lines = createInterface({ input: stream })
  lines.on('line', (line) => {
    target.write(`${project.color}[${project.name}]${reset} ${line}\n`)
  })
}

function run(project, args, { persistent = false } = {}) {
  return new Promise((resolve, reject) => {
    const commandArgs = npmCli ? [npmCli, ...args] : args
    const child = spawn(npmCommand, commandArgs, {
      cwd: project.cwd,
      env: { ...process.env, FORCE_COLOR: '1' },
      stdio: ['inherit', 'pipe', 'pipe'],
      windowsHide: true,
    })

    children.add(child)
    prefixStream(child.stdout, project, process.stdout)
    prefixStream(child.stderr, project, process.stderr)

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      children.delete(child)
      if (persistent && signal) return resolve()
      if (code === 0) return resolve()
      reject(new Error(`${project.name}: npm ${args.join(' ')} terminou com código ${code ?? signal}`))
    })
  })
}

async function runForBoth(args, options) {
  await Promise.all(projects.map((project) => run(project, args, options)))
}

async function install() {
  console.log('Instalando dependências dos dois projetos...')
  await runForBoth(['install'])
}

async function build() {
  console.log('Gerando builds dos dois projetos...')
  await runForBoth(['run', 'build'])
}

async function test() {
  console.log('Executando testes dos dois projetos...')
  await runForBoth(['run', 'test', '--', '--run'])
}

async function lint() {
  console.log('Executando lint dos dois projetos...')
  await runForBoth(['run', 'lint'])
}

async function validate() {
  await lint()
  await test()
  await build()
}

async function dev() {
  console.log('Codex:  http://localhost:5173')
  console.log('Gemini: http://localhost:5174')
  console.log('Pressione Ctrl+C para encerrar os dois servidores.\n')

  await Promise.all(projects.map((project) => run(
    project,
    ['run', 'dev', '--', '--port', String(project.port), '--strictPort'],
    { persistent: true },
  )))
}

function stopChildren() {
  for (const child of children) {
    child.kill('SIGTERM')
  }
}

process.on('SIGINT', () => {
  stopChildren()
  process.exit(130)
})
process.on('SIGTERM', () => {
  stopChildren()
  process.exit(143)
})

const action = process.argv[2] ?? 'all'

try {
  switch (action) {
    case 'install': await install(); break
    case 'build': await build(); break
    case 'test': await test(); break
    case 'lint': await lint(); break
    case 'validate': await validate(); break
    case 'dev': await dev(); break
    case 'all':
      await install()
      await build()
      await dev()
      break
    default:
      throw new Error(`Ação desconhecida: ${action}`)
  }
} catch (error) {
  stopChildren()
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
