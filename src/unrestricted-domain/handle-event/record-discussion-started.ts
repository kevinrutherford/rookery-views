import { recordUpdate } from './record-update'
import { Discussion } from '../../domain/index.open'
import { renderDiscussionIdentifier } from '../../services/json-api/render-discussion-identifier'
import { DoiEnteredEvent } from '../domain-event'
import { Readmodel } from '../state/readmodel'

export const recordDiscussionStarted = (state: Readmodel, event: DoiEnteredEvent): void => {
  const collection = state.collections.get(event.data.collectionId)
  if (collection === undefined) {
    state.info.unexpectedEvents.push(event)
    return
  }
  collection.discussionCount += 1
  let title = `DOI ${event.data.doi}`
  const workId = event.data.doi
  const existingWork = state.works.get(workId)
  if (!existingWork) {
    state.works.set(workId, {
      id: workId,
      doi: event.data.doi,
      updatedAt: event.created,
      frontMatter: {
        crossrefStatus: 'not-determined',
        reason: 'never-fetched',
      },
    })
  } else if (existingWork.frontMatter.crossrefStatus === 'found')
    title = existingWork.frontMatter.title

  const data = event.data
  const discussion: Discussion = {
    id: event.data.discussionId,
    collectionId: event.data.collectionId,
    workId,
    addedAt: event.created,
    title,
    commentsCount: 0,
  }
  const current = state.discussionsByCollection.get(data.collectionId) ?? []
  current.push(discussion)
  state.discussionsByCollection.set(data.collectionId, current)
  state.discussionsByDiscussionId.set(data.discussionId, discussion)

  const actorId = event.data.actorId
  recordUpdate(state, {
    kind: 'update:discussion-started',
    id: event.id,
    created: event.created,
    actorId,
    occurredWithinPrivateCollection: collection.isPrivate,
    collectionId: event.data.collectionId,
    discussionId: event.data.discussionId,
    workId,
  })

  const actor = state.members.get(actorId)
  if (actor !== undefined) {
    const followings = actor.following
    state.members.set(actorId, {
      ...actor,
      following: [
        ...followings,
        renderDiscussionIdentifier(event.data.discussionId),
      ],
    })
  }
}

