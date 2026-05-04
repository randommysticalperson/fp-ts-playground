export interface Section {
  id: string
  chapter: string
  title: string
  subtitle: string
  prose: string
  examples: Example[]
}

export interface Example {
  title: string
  code: string
  note?: string
}

export interface Challenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  description: string
  stub: string
  solution: string
  technique: string
}

export const sections: Section[] = [
  {
    id: 'option',
    chapter: '01',
    title: 'Option',
    subtitle: 'Modelling the absence of a value',
    prose:
      'Option<A> represents a value that may or may not exist. It replaces null and undefined with an explicit, type-safe container. The two constructors are none (absence) and some(a) (presence). Combinators like map, flatMap, and getOrElse let you work with the value without ever checking for null manually.',
    examples: [
      {
        title: 'Basic Option usage',
        code: `import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

const inverse = (n: number): O.Option<number> =>
  n === 0 ? O.none : O.some(1 / n)

const result = pipe(
  inverse(2),
  O.map((n) => n * 100),
  O.getOrElse(() => 0)
)
// result: 50`,
      },
      {
        title: 'Chaining with flatMap',
        code: `import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

const lookup = (obj: Record<string, string>, key: string): O.Option<string> =>
  key in obj ? O.some(obj[key]) : O.none

const config = { host: 'localhost', port: '3000' }

const result = pipe(
  lookup(config, 'host'),
  O.flatMap((host) =>
    pipe(
      lookup(config, 'port'),
      O.map((port) => \`\${host}:\${port}\`)
    )
  ),
  O.getOrElse(() => 'unknown')
)
// result: "localhost:3000"`,
      },
    ],
  },
  {
    id: 'either',
    chapter: '02',
    title: 'Either',
    subtitle: 'Typed error handling without exceptions',
    prose:
      'Either<E, A> models a computation that can either fail with an error of type E (Left) or succeed with a value of type A (Right). Unlike thrown exceptions, errors become first-class values that the type system forces you to handle. The W-suffixed variants (chainW, mapLeftW) widen the error union when combining Eithers with different error types.',
    examples: [
      {
        title: 'Parsing with Either',
        code: `import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

type ParseError = { tag: 'ParseError'; input: string }

const parseNumber = (s: string): E.Either<ParseError, number> => {
  const n = Number(s)
  return isNaN(n)
    ? E.left({ tag: 'ParseError', input: s })
    : E.right(n)
}

const result = pipe(
  parseNumber('42'),
  E.map((n) => n * 2),
  E.match(
    (err) => \`Error: could not parse "\${err.input}"\`,
    (n) => \`Success: \${n}\`
  )
)
// result: "Success: 84"`,
      },
      {
        title: 'Widening errors with chainW',
        code: `import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'

declare function parseString(s: string): E.Either<string, number>
declare function fetchUser(id: number): TE.TaskEither<Error, { name: string }>

// chainW widens the error to string | Error
const program = (s: string) =>
  pipe(
    s,
    TE.fromEitherK(parseString),
    TE.chainW(fetchUser)
  )
// type: (s: string) => TE.TaskEither<string | Error, { name: string }>`,
      },
    ],
  },
  {
    id: 'do-notation',
    chapter: '03',
    title: 'Do Notation',
    subtitle: 'Sequential effects without nesting',
    prose:
      'fp-ts provides a Do notation implementation that eliminates nested pipe calls when sequencing effectful operations. T.Do starts with an empty record {}. T.bind adds a named value to that record by running an effect. T.apS runs effects in parallel and collects results. The result is flat, readable code that mirrors Haskell\'s do blocks.',
    examples: [
      {
        title: 'Sequential vs Do notation',
        code: `import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

declare const readLine: T.Task<string>
declare const print: (s: string) => T.Task<void>

// ❌ Nested pipe — hard to read
const nested = pipe(
  readLine,
  T.flatMap((x) =>
    pipe(readLine, T.map((y) => ({ x, y })))
  )
)

// ✅ Do notation — flat and clear
const withDo = pipe(
  T.Do,
  T.bind('x', () => readLine),
  T.bind('y', () => readLine),
  T.tap(({ x }) => print(x)),
  T.tap(({ y }) => print(y))
)`,
      },
      {
        title: 'Parallel effects with apS',
        code: `import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

declare const encryptValue: (val: string) => T.Task<string>

// apS runs effects in parallel (unlike bind which is sequential)
const result = pipe(
  T.Do,
  T.apS('x', encryptValue('hello')),
  T.apS('y', encryptValue('world')),
  T.map(({ x, y }) => ({ encrypted: [x, y] }))
)`,
      },
    ],
  },
  {
    id: 'hkt',
    chapter: '04',
    title: 'Higher-Kinded Types',
    subtitle: 'Abstracting over type constructors',
    prose:
      'TypeScript lacks native higher-kinded types (HKTs), but fp-ts emulates them via defunctionalization. Each type constructor is assigned a unique string URI. The URItoKind interface maps URIs to concrete types via module augmentation. The Kind<F, A> utility resolves Kind<"Option", number> to Option<number> at compile time.',
    examples: [
      {
        title: 'Registering a custom HKT',
        code: `// Tree.ts — registering a custom type constructor
import { Functor1 } from 'fp-ts/Functor'
import { Kind, URIS } from 'fp-ts/HKT'

export const URI = 'Tree'
export type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Tree: Tree<A>
  }
}

export type Tree<A> =
  | { tag: 'Leaf'; value: A }
  | { tag: 'Node'; children: Tree<A>[] }

export const Functor: Functor1<URI> = {
  URI,
  map: (fa, f) =>
    fa.tag === 'Leaf'
      ? { tag: 'Leaf', value: f(fa.value) }
      : { tag: 'Node', children: fa.children.map((c) => Functor.map(c, f)) },
}`,
      },
      {
        title: 'Writing a polymorphic function',
        code: `import { Functor1 } from 'fp-ts/Functor'
import { Kind, URIS } from 'fp-ts/HKT'

// lift works for ANY registered Functor1 instance
function lift<F extends URIS>(
  F: Functor1<F>
): <A, B>(f: (a: A) => B) => (fa: Kind<F, A>) => Kind<F, B> {
  return (f) => (fa) => F.map(fa, f)
}

// Works for Option, Array, Tree, or any custom type
import * as O from 'fp-ts/Option'
const double = (n: number) => n * 2
const doubleOption = lift(O.Functor)(double)
// doubleOption: (fa: Option<number>) => Option<number>`,
      },
    ],
  },
  {
    id: 'branded',
    chapter: '05',
    title: 'Branded & Phantom Types',
    subtitle: 'Nominal typing and compile-time state machines',
    prose:
      'TypeScript uses structural typing, meaning two types with the same shape are interchangeable. Branded types add a phantom property to create nominally distinct types — a UserId and an Email are both strings structurally, but the brand makes them incompatible. Phantom types encode state machine constraints by using a type parameter that never appears at runtime.',
    examples: [
      {
        title: 'Branded types for nominal typing',
        code: `type Brand<K, T> = K & { readonly __brand: T }

type UserId  = Brand<string, 'UserId'>
type Email   = Brand<string, 'Email'>
type OrderId = Brand<number, 'OrderId'>

const makeUserId  = (id: string): UserId  => id as UserId
const makeEmail   = (e: string): Email    => e as Email
const makeOrderId = (n: number): OrderId  => n as OrderId

declare function sendEmail(to: Email, subject: string): void

const id    = makeUserId('u-123')
const email = makeEmail('user@example.com')

sendEmail(email, 'Hello')  // ✅ OK
// sendEmail(id, 'Hello')  // ❌ Type error: UserId ≠ Email`,
      },
      {
        title: 'Phantom types as a state machine',
        code: `// The State type parameter never appears in the runtime value
type Form<State extends string> = { readonly data: Record<string, unknown> }

declare function initForm   (): Form<'Draft'>
declare function validate   (f: Form<'Draft'>):     Form<'Validated'>
declare function submit     (f: Form<'Validated'>): Promise<void>

const draft     = initForm()
const validated = validate(draft)
submit(validated)  // ✅ OK

// submit(draft)   // ❌ Type error: Form<'Draft'> ≠ Form<'Validated'>
// The type system enforces the correct sequence at compile time`,
      },
    ],
  },
]

export const challenges: Challenge[] = [
  {
    id: 'pick',
    title: 'MyPick',
    difficulty: 'easy',
    description: 'Implement the built-in Pick<T, K> utility type without using it.',
    technique: 'Mapped Types',
    stub: `type MyPick<T, K> = // your solution`,
    solution: `type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}`,
  },
  {
    id: 'readonly',
    title: 'DeepReadonly',
    difficulty: 'medium',
    description: 'Make every property of an object (recursively) readonly.',
    technique: 'Recursive Mapped Types',
    stub: `type DeepReadonly<T> = // your solution`,
    solution: `type DeepReadonly<T> = T extends Function
  ? T
  : T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T`,
  },
  {
    id: 'union-to-intersection',
    title: 'UnionToIntersection',
    difficulty: 'hard',
    description: 'Convert a union type U = A | B | C into an intersection A & B & C.',
    technique: 'Distributive Conditional Types + Function Argument Inference',
    stub: `type UnionToIntersection<U> = // your solution`,
    solution: `type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends
  ((k: infer I) => void) ? I : never`,
  },
  {
    id: 'is-union',
    title: 'IsUnion',
    difficulty: 'medium',
    description: 'Return true if T is a union type, false otherwise.',
    technique: 'Distributive Conditional Types',
    stub: `type IsUnion<T> = // your solution`,
    solution: `type IsNever<T> = [T] extends [never] ? true : false

type IsUnion<T, B = T> =
  IsNever<T> extends true ? false :
  T extends any ? ([B] extends [T] ? false : true) : never`,
  },
  {
    id: 'tuple-math',
    title: 'Add (Tuple Math)',
    difficulty: 'extreme',
    description: 'Implement integer addition at the type level using tuple length as a counter.',
    technique: 'Tuple Length Arithmetic',
    stub: `type Add<A extends number, B extends number> = // your solution`,
    solution: `type BuildTuple<N extends number, T extends any[] = []> =
  T['length'] extends N ? T : BuildTuple<N, [...T, any]>

type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]['length']

// Add<3, 4> → 7`,
  },
]
