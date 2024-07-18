import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { includeAccount } from './include-account'
import { includeEntry } from './include-entry'
import { UpdateWithIncludes } from './update-with-includes'
import { CommentCreated, Domain } from '../../domain/index.open'
import { renderUpdateResource } from '../json-api/render-update-resource'
import {includeWork} from './include-work'

export const toCommentCreatedParagraph = (queries: Domain, activity: CommentCreated): UpdateWithIncludes => ({
  data: pipe(
    activity.entryId,
    queries.lookupEntry,
    O.fromEither,
    O.map((entry) => renderUpdateResource({
      type: 'update:comment-created',
      id: activity.id,
      accountId: 'you',
      content: activity.content,
      entryId: activity.entryId,
      workId: entry.workId,
      occurred_at: activity.created,
    })),
  ),
  included: pipe(
    [
      includeAccount(queries, activity.actorId),
      includeEntry(queries, activity.entryId),
      includeWork(queries, activity.workId),
    ],
    RA.compact,
  ),
})

