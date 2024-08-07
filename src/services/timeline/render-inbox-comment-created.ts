import * as O from 'fp-ts/Option'
import { UpdateWithIncludes } from './update-with-includes'
import { Domain } from '../../domain/index.open'
import { InboxCommentCreated } from '../../domain/update-resource'
import { renderEntry } from '../json-api/render-entry'
import { renderEntryIdentifier } from '../json-api/render-entry-identifier'
import { renderMember } from '../json-api/render-member'
import { renderMemberIdentifier } from '../json-api/render-member-identifier'
import { renderWork } from '../json-api/render-work'
import { renderWorkIdentifier } from '../json-api/render-work-identifier'

export const renderInboxCommentCreated = (queries: Domain, update: InboxCommentCreated): UpdateWithIncludes => ({
  data: {
    type: update.kind,
    id: update.id,
    attributes: {
      occurred_at: update.created.toISOString(),
    },
    relationships: {
      actor: { data: renderMemberIdentifier(update.actorId) },
      entry: { data: renderEntryIdentifier(update.discussion.id) },
      work: { data: renderWorkIdentifier(update.work.id) },
    },
  },
  included: [
    O.some(renderMember(update.actor)),
    O.some(renderEntry(update.discussion)),
    O.some(renderWork(update.work)),
  ],
})

