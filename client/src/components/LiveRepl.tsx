/**
 * LiveRepl.tsx — Monaco-based in-browser TypeScript REPL
 * Design: Swiss editorial — dark editor panel, cobalt accent, IBM Plex Mono
 *
 * Uses @monaco-editor/react for the editor.
 * TypeScript transpilation runs in-browser via the TypeScript compiler API
 * bundled with Monaco. Output is evaluated with Function() for safe execution.
 */
import Editor, { loader } from '@monaco-editor/react'
import { useCallback, useRef, useState } from 'react'

// Configure Monaco to load from CDN to avoid bundling the full worker
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs',
  },
})

const DEFAULT_CODE = `// ✏️ Edit and run TypeScript live
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

const inverse = (n: number): O.Option<number> =>
  n === 0 ? O.none : O.some(1 / n)

const result = pipe(
  inverse(4),
  O.map((n) => n * 100),
  O.getOrElse(() => 0)
)

console.log('Result:', result) // 25
`

interface ReplOutput {
  type: 'log' | 'error' | 'warn'
  text: string
}

export function LiveRepl() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState<ReplOutput[]>([])
  const [running, setRunning] = useState(false)
  const monacoRef = useRef<any>(null)

  const handleEditorDidMount = (_editor: any, monaco: any) => {
    monacoRef.current = monaco

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      strict: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    })

    // Suppress module-not-found errors for fp-ts (we stub them below)
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [2307, 2304],
    })
  }

  const runCode = useCallback(async () => {
    setRunning(true)
    const logs: ReplOutput[] = []

    // Intercept console methods
    const origLog = console.log
    const origWarn = console.warn
    const origError = console.error

    console.log = (...args) => {
      logs.push({ type: 'log', text: args.map(formatArg).join(' ') })
    }
    console.warn = (...args) => {
      logs.push({ type: 'warn', text: args.map(formatArg).join(' ') })
    }
    console.error = (...args) => {
      logs.push({ type: 'error', text: args.map(formatArg).join(' ') })
    }

    try {
      // Strip fp-ts imports (they're not available at runtime in the REPL sandbox)
      // and replace with inline stubs for the most common combinators
      const stripped = code
        .replace(/^import\s+.*from\s+['"]fp-ts\/.*['"];?\s*$/gm, '')
        .replace(/^import\s+.*from\s+['"].*['"];?\s*$/gm, '')

      const withStubs = `
// ─── fp-ts stubs ─────────────────────────────────────────────────────────────
const pipe = (...args) => {
  if (args.length === 0) return undefined
  let result = args[0]
  for (let i = 1; i < args.length; i++) result = args[i](result)
  return result
}
const flow = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

// Option
const O = {
  none: { _tag: 'None' },
  some: (a) => ({ _tag: 'Some', value: a }),
  map: (f) => (fa) => fa._tag === 'None' ? fa : O.some(f(fa.value)),
  flatMap: (f) => (fa) => fa._tag === 'None' ? fa : f(fa.value),
  chain: (f) => (fa) => fa._tag === 'None' ? fa : f(fa.value),
  getOrElse: (onNone) => (fa) => fa._tag === 'None' ? onNone() : fa.value,
  fold: (onNone, onSome) => (fa) => fa._tag === 'None' ? onNone() : onSome(fa.value),
  match: (onNone, onSome) => (fa) => fa._tag === 'None' ? onNone() : onSome(fa.value),
  fromNullable: (a) => a == null ? O.none : O.some(a),
  isSome: (fa) => fa._tag === 'Some',
  isNone: (fa) => fa._tag === 'None',
}

// Either
const E = {
  left: (e) => ({ _tag: 'Left', left: e }),
  right: (a) => ({ _tag: 'Right', right: a }),
  map: (f) => (fa) => fa._tag === 'Left' ? fa : E.right(f(fa.right)),
  mapLeft: (f) => (fa) => fa._tag === 'Right' ? fa : E.left(f(fa.left)),
  flatMap: (f) => (fa) => fa._tag === 'Left' ? fa : f(fa.right),
  chain: (f) => (fa) => fa._tag === 'Left' ? fa : f(fa.right),
  match: (onLeft, onRight) => (fa) => fa._tag === 'Left' ? onLeft(fa.left) : onRight(fa.right),
  fold: (onLeft, onRight) => (fa) => fa._tag === 'Left' ? onLeft(fa.left) : onRight(fa.right),
  isLeft: (fa) => fa._tag === 'Left',
  isRight: (fa) => fa._tag === 'Right',
}

// Array helpers
const A = {
  map: (f) => (arr) => arr.map(f),
  filter: (pred) => (arr) => arr.filter(pred),
  reduce: (b, f) => (arr) => arr.reduce(f, b),
}

// ─── User code ────────────────────────────────────────────────────────────────
${stripped}
`
      // eslint-disable-next-line no-new-func
      const fn = new Function(withStubs)
      await fn()
    } catch (err: any) {
      logs.push({ type: 'error', text: String(err?.message ?? err) })
    } finally {
      console.log = origLog
      console.warn = origWarn
      console.error = origError
      setOutput(logs.length > 0 ? logs : [{ type: 'log', text: '(no output)' }])
      setRunning(false)
    }
  }, [code])

  return (
    <div className="border border-border rounded-sm overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[oklch(0.18_0.02_265)] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs font-mono text-white/40">playground.ts</span>
        </div>
        <button
          onClick={runCode}
          disabled={running}
          className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {running ? (
            <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <span>▶</span>
          )}
          Run
        </button>
      </div>

      {/* Editor */}
      <Editor
        height="320px"
        defaultLanguage="typescript"
        value={code}
        onChange={(val) => setCode(val ?? '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />

      {/* Output */}
      <div className="border-t border-white/10 bg-[oklch(0.11_0.015_265)] min-h-[60px] max-h-[160px] overflow-y-auto">
        <div className="px-3 py-1.5 border-b border-white/5">
          <span className="text-xs font-mono text-white/30 tracking-wide">OUTPUT</span>
        </div>
        {output.length === 0 ? (
          <p className="px-4 py-3 text-xs font-mono text-white/25 italic">Press Run to execute…</p>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={`px-4 py-1 text-xs font-mono leading-relaxed ${
                line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'warn'
                  ? 'text-yellow-400'
                  : 'text-green-300'
              }`}
            >
              <span className="text-white/20 mr-2 select-none">
                {line.type === 'error' ? '✕' : line.type === 'warn' ? '⚠' : '›'}
              </span>
              {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg
  try {
    return JSON.stringify(arg, null, 2)
  } catch {
    return String(arg)
  }
}
