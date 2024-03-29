import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { renderEntry } from './render-entry'
import { View } from '../../http/index.open'
import { Queries } from '../../readmodels'

export const getEntries = (queries: Queries): View => () => pipe(
  queries.allEntries(),
  (entries) => ({
    type: 'Entries',
    data: pipe(
      entries,
      RA.map(renderEntry),
    ),
  }),
  TE.right,
)

