import { getCollection } from './collection/collection'
import { getCollections } from './collection/collections'
import { getAbout } from './community/about'
import { getEntry } from './entry/entry'
import { getLocalTimeline } from './timeline/local'
import { ViewPath } from '../http/index.open'
import { Queries } from '../readmodels'

export const instantiate = (queries: Queries): ReadonlyArray<ViewPath> => [
  {
    path: '/about',
    view: getAbout(),
  },
  {
    path: '/collections',
    view: getCollections(queries),
  },
  {
    path: '/collections/:id',
    view: getCollection(queries),
  },
  {
    path: '/entries/:id',
    view: getEntry(queries),
  },
  {
    path: '/timelines/local',
    view: getLocalTimeline(queries),
  },
]
