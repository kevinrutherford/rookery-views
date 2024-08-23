import * as O from 'fp-ts/Option'
import * as RM from 'fp-ts/ReadonlyMap'
import { identity, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { Domain } from '../../domain/index.open'
import { Readmodel } from '../state/readmodel'

export const findComments = (currentState: Readmodel): Domain['findComments'] => (discussionId) => pipe(
  currentState.comments,
  RM.lookup(S.Eq)(discussionId),
  O.match(
    () => [],
    identity,
  ),
)

