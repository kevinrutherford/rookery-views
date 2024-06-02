import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import { renderCollection } from './render-collection'
import { Queries } from '../../domain-model'
import { View } from '../../http/index.open'

export const getCollections = (queries: Queries): View => (isAuthenticated) => () => pipe(
  queries.allCollections(),
  RA.filter((c) => !c.isPrivate || isAuthenticated),
  RA.map(renderCollection),
  (collections) => ({
    data: collections,
  }),
  TE.right,
)

