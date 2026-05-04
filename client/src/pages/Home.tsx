/**
 * Home.tsx — fp-ts & Type-Level TypeScript Playground
 * Design: Swiss International Typographic Style
 * Layout: Asymmetric editorial grid — chapter gutter + wide content column
 */
import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { sections, challenges, type Challenge } from '@/lib/content'

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/90">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary tracking-tight">fp-ts</span>
            <span className="text-border text-lg font-light">·</span>
            <span className="font-sans text-sm text-muted-foreground">Type-Level TypeScript Playground</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {['Option', 'Either', 'Do', 'HKT', 'Branded', 'Challenges'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="py-20 border-b border-border">
      <div className="container">
        <div className="max-w-3xl">
          <p className="chapter-label mb-4">Functional Programming in TypeScript</p>
          <div className="rule-accent pt-5 mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              fp-ts &amp; Type-Level<br />
              <em className="text-primary not-italic">TypeScript</em>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-light">
            An interactive reference covering fp-ts core patterns, higher-kinded types,
            do notation, branded types, and advanced type-level programming techniques
            drawn from the type-challenges repository.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { label: 'Option / Either / Task', color: 'bg-primary/10 text-primary border-primary/20' },
              { label: 'Do Notation', color: 'bg-primary/10 text-primary border-primary/20' },
              { label: 'HKT / Defunctionalization', color: 'bg-primary/10 text-primary border-primary/20' },
              { label: 'Branded & Phantom Types', color: 'bg-primary/10 text-primary border-primary/20' },
              { label: 'Type Challenges', color: 'bg-primary/10 text-primary border-primary/20' },
            ].map(({ label, color }) => (
              <span key={label} className={`inline-flex items-center text-xs font-mono px-3 py-1 rounded-sm border ${color}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function ContentSection({ section }: { section: (typeof sections)[0] }) {
  const [activeExample, setActiveExample] = useState(0)
  const ex = section.examples[activeExample]

  return (
    <section id={section.id} className="py-16 border-b border-border">
      <div className="container">
        {/* Editorial grid: narrow left gutter + wide content */}
        <div className="grid grid-cols-1 md:grid-cols-[5rem_1fr] gap-8">
          {/* Left gutter */}
          <div className="pt-1 hidden md:block">
            <span className="chapter-label block">{section.chapter}</span>
          </div>

          {/* Content column */}
          <div>
            <div className="rule-accent pt-4 mb-2">
              <h2 className="text-3xl font-bold text-foreground">{section.title}</h2>
            </div>
            <p className="text-sm font-mono text-primary mb-5">{section.subtitle}</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl font-light">
              {section.prose}
            </p>

            {/* Example tabs */}
            <div className="flex gap-2 mb-0">
              {section.examples.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setActiveExample(i)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-t-sm border-t border-l border-r transition-colors ${
                    activeExample === i
                      ? 'bg-[oklch(0.14_0.02_265)] text-white border-border/40'
                      : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  {e.title}
                </button>
              ))}
            </div>
            <CodeBlock code={ex.code} language="typescript" />
            {ex.note && (
              <p className="text-xs text-muted-foreground font-mono mt-2 pl-1">{ex.note}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Challenges ───────────────────────────────────────────────────────────────

const difficultyLabel: Record<Challenge['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  extreme: 'Extreme',
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="border border-border rounded-sm overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-mono font-semibold text-foreground text-sm">{challenge.title}</h3>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border badge-${challenge.difficulty}`}>
            {difficultyLabel[challenge.difficulty]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{challenge.description}</p>
        <span className="type-badge">{challenge.technique}</span>
      </div>

      <div className="p-5">
        <CodeBlock code={challenge.stub} language="typescript" title="Stub" />

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="mt-3 text-xs font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <span className="inline-block transition-transform" style={{ transform: showSolution ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
          {showSolution ? 'Hide solution' : 'Reveal solution'}
        </button>

        {showSolution && (
          <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <CodeBlock code={challenge.solution} language="typescript" title="Solution" />
          </div>
        )}
      </div>
    </div>
  )
}

function ChallengesSection() {
  const [filter, setFilter] = useState<Challenge['difficulty'] | 'all'>('all')

  const filtered = filter === 'all'
    ? challenges
    : challenges.filter((c: Challenge) => c.difficulty === filter)

  return (
    <section id="challenges" className="py-16 border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[5rem_1fr] gap-8">
          <div className="pt-1 hidden md:block">
            <span className="chapter-label block">06</span>
          </div>
          <div>
            <div className="rule-accent pt-4 mb-2">
              <h2 className="text-3xl font-bold text-foreground">Type Challenges</h2>
            </div>
            <p className="text-sm font-mono text-primary mb-5">Solving the type-challenges repository</p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl font-light">
              A curated selection of challenges from the{' '}
              <a href="https://github.com/type-challenges/type-challenges" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                type-challenges
              </a>{' '}
              repository, demonstrating the key techniques: mapped types, conditional types, recursive types, distributive types, and tuple arithmetic.
            </p>

            {/* Filter */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {(['all', 'easy', 'medium', 'hard', 'extreme'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
                    filter === d
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {d === 'all' ? 'All' : difficultyLabel[d]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((c: Challenge) => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Built with <span className="text-primary">fp-ts</span> · Patterns from{' '}
              <a href="https://github.com/type-challenges/type-challenges" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">type-challenges</a>
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              <a href="https://gcanti.github.io/fp-ts/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">fp-ts docs</a>
              {' · '}
              <a href="https://gcanti.github.io/fp-ts/guides/HKT.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">HKT guide</a>
              {' · '}
              <a href="https://gcanti.github.io/fp-ts/guides/do-notation.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Do notation</a>
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground/40">fp-ts Playground</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main>
        {sections.map((section) => (
          <ContentSection key={section.id} section={section} />
        ))}
        <ChallengesSection />
      </main>
      <Footer />
    </div>
  )
}
