import * as D from 'fp-ts/Date'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { renderParagraphResource } from './render-paragraph-resource'
import { TimelineParagraph } from './timeline-paragraph'
import { toCollectionCreatedParagraph } from './to-collection-created-paragraph'
import { toCommentCreatedParagraph } from './to-comment-created-paragraph'
import { toDoiEnteredParagraph } from './to-doi-entered-paragraph'
import { toWorkUpdatedParagraph } from './to-work-updated-paragraph'
import { Queries } from '../../domain-model'
import { View } from '../view'

type TimelineEvent = ReturnType<Queries['getLocalTimeline']>[number]

const toTimelineParagraph = (queries: Queries) => (event: TimelineEvent): O.Option<TimelineParagraph> => {
  switch (event.type) {
    case 'collection-created':
      return toCollectionCreatedParagraph(event)
    case 'doi-entered':
      return toDoiEnteredParagraph(queries)(event)
    case 'comment-created':
      return toCommentCreatedParagraph(event)
    case 'work-updated':
      return toWorkUpdatedParagraph(event)
    default:
      return O.none
  }
}

const byDate: Ord.Ord<TimelineParagraph> = pipe(
  D.Ord,
  Ord.contramap((event) => event.timestamp),
)

const byDateDescending: Ord.Ord<TimelineParagraph> = pipe(
  byDate,
  Ord.reverse,
)

export const getLocalTimeline = (queries: Queries): View => (clientCan) => () => pipe(
  queries.getLocalTimeline(clientCan('browse-private-collections')),
  RA.map(toTimelineParagraph(queries)),
  RA.compact,
  RA.sort(byDateDescending),
  RA.map(renderParagraphResource),
  (paragraphs) => ({
    data: paragraphs,
  }),
  E.right,
)
