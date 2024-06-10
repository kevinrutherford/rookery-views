import * as O from 'fp-ts/Option'
import * as RM from 'fp-ts/ReadonlyMap'
import { identity, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { Readmodel } from './readmodel'
import { Queries } from '../../views/queries'

export const findComments = (currentState: Readmodel): Queries['findComments'] => (entryId) => pipe(
  currentState,
  RM.lookup(S.Eq)(entryId),
  O.match(
    () => [],
    identity,
  ),
)

