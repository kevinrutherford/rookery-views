import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as tt from 'io-ts-types'

export const shouldNotHappen = (): never => {
  throw new Error('should not happen')
}

// ts-unused-exports:disable-next-line
export const arbitraryNumber = (min: number, max: number): number => (
  Math.floor(Math.random() * (max - min + 1) + min)
)

export const arbitraryWord = (length: number = arbitraryNumber(3, 15)): tt.NonEmptyString => (
  [...Array(length)]
    .map(() => Math.random().toString(36)[2])
    .join('')
    .replace(/^[0-9]/, 'x')
    .replace(/0x/, '0y')
) as tt.NonEmptyString

export const arbitraryString = (): string => pipe(
  [...Array(arbitraryNumber(3, 20))],
  A.map(() => arbitraryNumber(2, 10)),
  A.map((n) => arbitraryWord(n)),
).join(' ')

// ts-unused-exports:disable-next-line
export const arbitraryUri = (): string => `http://example.com/${arbitraryWord()}`

// ts-unused-exports:disable-next-line
export const arbitraryTextLongerThan = (min: number): string => 'xy '.repeat(min)

export const arbitraryDate = (): Date => (
  new Date(`${arbitraryNumber(2000, 2021)}-${arbitraryNumber(1, 12)}-${arbitraryNumber(1, 28)}`)
)

