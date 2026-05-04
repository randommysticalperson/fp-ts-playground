/**
 * CodeBlock.tsx — Syntax-highlighted code block
 * Design: Swiss editorial — dark bg, cobalt left border, IBM Plex Mono
 */
import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="my-4 rounded-sm overflow-hidden border border-border/40">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[oklch(0.18_0.02_265)] border-b border-white/10">
          <span className="text-xs font-mono text-white/50 tracking-wide">{title}</span>
          <span className="text-xs font-mono text-[oklch(0.65_0.18_264)]">{language}</span>
        </div>
      )}
      <div className="relative group">
        <Highlight theme={themes.nightOwl} code={code.trim()} language={language as any}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} code-block p-5 overflow-x-auto text-[0.82rem] leading-relaxed`}
              style={{ ...style, background: 'oklch(0.14 0.02 265)', borderLeft: '3px solid oklch(0.48 0.22 264)' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell pr-5 select-none text-white/20 text-right w-8 text-xs">{i + 1}</span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono px-2 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
    </div>
  )
}
