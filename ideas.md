# fp-ts Playground — Design Brainstorm

<response>
<text>
**Design Movement:** Brutalist Terminal / Code-First Aesthetic
**Core Principles:** Raw monospace typography as the hero; stark contrast between code blocks and prose; no decorative chrome—everything is functional.
**Color Philosophy:** Near-black background (#0d0d0d), electric green (#00ff88) for syntax highlights, warm amber (#f5a623) for type annotations. Evokes old-school terminals but with modern precision.
**Layout Paradigm:** Full-width split-pane — left panel shows concept explanation, right panel shows live code with syntax highlighting. Asymmetric gutters.
**Signature Elements:** Blinking cursor motif on section headers; monospace grid lines as dividers; glowing border on active code blocks.
**Interaction Philosophy:** Everything feels like a REPL — hover reveals type signatures, click expands examples.
**Animation:** Typewriter entrance for headings; code blocks fade-in line by line.
**Typography System:** JetBrains Mono for all headings AND body; size hierarchy via weight and color, not font family.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Design Movement:** Swiss International Typographic Style (Modernist Grid)
**Core Principles:** Strict typographic hierarchy; content-first layout; mathematical spacing; no decorative elements.
**Color Philosophy:** Off-white (#f8f6f1) background, deep charcoal (#1a1a2e) for text, single accent in cobalt blue (#2563eb). Rational and authoritative — the aesthetic of academic papers.
**Layout Paradigm:** Asymmetric editorial grid — a narrow left column for labels/numbers, a wide right column for content. Chapters numbered like a textbook.
**Signature Elements:** Thick top border rule in cobalt blue; numbered chapter markers in the left gutter; code blocks with a left border accent.
**Interaction Philosophy:** Deliberate and calm — hover states are subtle color shifts, no bouncing or scaling.
**Animation:** Sections slide in from the left on scroll; code blocks reveal with a horizontal wipe.
**Typography System:** Playfair Display for section titles (high contrast serif), IBM Plex Mono for code, IBM Plex Sans for body prose.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Design Movement:** Dark Glassmorphism / Cyberpunk Functional
**Core Principles:** Depth through layered translucency; neon accent on dark substrate; information density balanced with breathing room.
**Color Philosophy:** Deep navy (#060b18) base, frosted glass panels (rgba white/5%), electric violet (#7c3aed) and cyan (#06b6d4) as dual accents. Evokes the feeling of looking at a type-system from inside a compiler.
**Layout Paradigm:** Sidebar navigation with a content canvas — sidebar shows the concept tree, canvas shows the active module. Cards float above the background with glass blur.
**Signature Elements:** Glowing gradient borders on cards; subtle grid dot pattern on background; type annotation badges in neon violet.
**Interaction Philosophy:** Fluid and responsive — cards lift on hover, transitions are spring-physics based.
**Animation:** Cards enter with a scale+fade; sidebar items have a staggered entrance; code lines highlight sequentially.
**Typography System:** Space Grotesk for headings (geometric, modern), Fira Code for all code, Inter for body text.
</text>
<probability>0.09</probability>
</response>

---

## Selected Design: Swiss International Typographic Style

Chosen for its alignment with the academic, precise nature of type theory and functional programming. The editorial grid mirrors how textbooks and papers present formal concepts — numbered sections, clear hierarchy, and a single accent color that guides the eye without distraction.
