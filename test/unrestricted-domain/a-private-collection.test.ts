import * as UnrestrictedDomain from '../../src/unrestricted-domain'
import { defaultTestObserver } from '../default-test-observer'
import { arbitraryString, arbitraryWord } from '../helpers'
import { mkEvent } from '../mk-event'

describe('given a private collection', () => {
  let domain: ReturnType<typeof UnrestrictedDomain.instantiate>
  const actorId = arbitraryWord()
  const collectionId = arbitraryWord()
  const discussionId = arbitraryWord()
  const workId = arbitraryWord()

  const addDiscussion = () => {
    domain.handleEvent(mkEvent('discussion-started', {
      actorId,
      discussionId,
      doi: workId,
      collectionId,
    }))
  }

  const becomePrivate = () => {
    domain.handleEvent(mkEvent('collection-updated', {
      actorId,
      collectionId,
      attributes: {
        isPrivate: true,
      },
    }))
  }

  beforeEach(() => {
    domain = UnrestrictedDomain.instantiate(defaultTestObserver)
    domain.handleEvent(mkEvent('member-joined', {
      id: actorId,
      username: arbitraryWord(),
      displayName: arbitraryWord(),
      avatarUrl: arbitraryWord(),
    }))
    domain.handleEvent(mkEvent('collection-created', {
      id: collectionId,
      actorId,
      name: arbitraryString(),
      description: arbitraryString(),
    }))
    becomePrivate()
  })

  describe('when discussion-started', () => {
    beforeEach(() => {
      addDiscussion()
    })

    it('the activity is recorded as private', () => {
      const activities = domain.queries.getLocalTimeline()
      expect(activities).toHaveLength(2)
      expect(activities[1].occurredWithinPrivateCollection).toBe(true)
    })
  })

  describe('with an discussion', () => {
    let activities: ReturnType<typeof domain.queries.getLocalTimeline>

    beforeEach(() => {
      addDiscussion()
    })

    describe('when collection-updated to become public', () => {
      const becomePublic = () => {
        domain.handleEvent(mkEvent('collection-updated', {
          actorId,
          collectionId,
          attributes: {
            isPrivate: false,
          },
        }))
      }

      beforeEach(() => {
        becomePublic()
        activities = domain.queries.getLocalTimeline()
      })

      it('no new activity is recorded', () => {
        expect(activities).toHaveLength(2)
      })

      it('all activities during the private period remain private', () => {
        expect(activities[1].occurredWithinPrivateCollection).toBe(true)
      })
    })

    describe('when comment-created on the discussion', () => {

      beforeEach(() => {
        domain.handleEvent(mkEvent('comment-created', {
          id: arbitraryWord(),
          actorId,
          discussionId,
          content: arbitraryString(),
          publishedAt: new Date().toISOString(),
        }))
        activities = domain.queries.getLocalTimeline()
      })

      it('a new activity is recorded', () => {
        expect(activities).toHaveLength(3)
      })

      it('records the commenting activity as private', () => {
        expect(activities[2].occurredWithinPrivateCollection).toBe(true)
      })
    })
  })

})

