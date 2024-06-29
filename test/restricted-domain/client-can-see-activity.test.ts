import { flow, identity } from 'fp-ts/function'
import { Authority } from '../../src/auth/authority'
import { Domain } from '../../src/domain/index.open'
import * as RestrictedDomain from '../../src/restricted-domain'
import * as UnrestrictedDomain from '../../src/unrestricted-domain'
import { defaultTestObserver } from '../default-test-observer'
import { arbitraryString, arbitraryWord } from '../helpers'
import { mkEvent } from '../mk-event'

type State = {
  handleEvent: UnrestrictedDomain.EventHandler,
  collectionId?: string,
  entryId?: string,
}

type StateModifier = (state: State) => State

const createCollection: StateModifier = (state) => {
  const collectionId = arbitraryWord()
  state.handleEvent(mkEvent('collection-created', {
    id: collectionId,
    name: arbitraryString(),
    description: arbitraryString(),
  }))
  return { ...state, collectionId }
}

const addEntry: StateModifier = (state) => {
  const entryId = arbitraryWord()
  state.handleEvent(mkEvent('doi-entered', {
    id: entryId,
    workId: arbitraryWord(),
    collectionId: state.collectionId,
  }))
  return { ...state, entryId }
}

const becomePrivate: StateModifier = (state) => {
  state.handleEvent(mkEvent('collection-updated', {
    collectionId: state.collectionId,
    attributes: {
      isPrivate: true,
    },
  }))
  return state
}

const addComment: StateModifier = (state) => {
  state.handleEvent(mkEvent('comment-created', {
    id: arbitraryWord(),
    entryId: state.entryId,
    content: arbitraryString(),
  }))
  return state
}

const emptyDatabase = identity
const emptyCollection = createCollection
const emptyPrivateCollection = flow(emptyCollection, becomePrivate)
const publicCollectionWithEntry = flow(emptyCollection, addEntry)
const privateCollectionWithEntry = flow(publicCollectionWithEntry, becomePrivate)

type Example = [setup: StateModifier, event: StateModifier, activitiesAdded: number]
type Examples = ReadonlyArray<Example>

describe('client-can-see-activity', () => {

  describe.each([
    [() => false, [
      // [emptyDatabase, createCommunity, 1],
      [emptyDatabase, createCollection, 1],
      // [emptyDatabase, createPrivateCollection, 0],
      [emptyCollection, addEntry, 1],
      [emptyPrivateCollection, addEntry, 0],
      [publicCollectionWithEntry, addComment, 1],
      [privateCollectionWithEntry, addComment, 0],
      // [emptyDatabase, updateWork, 0],
    ] satisfies Examples],
  ])('client-can-see-activity', (claims: Authority, examples: Examples) => {
    let handleEvent: UnrestrictedDomain.EventHandler
    let unrestrictedQueries: Domain

    beforeEach(() => {
      const unrestrictedDomain = UnrestrictedDomain.instantiate(defaultTestObserver)
      handleEvent = unrestrictedDomain.handleEvent
      unrestrictedQueries = unrestrictedDomain.queries
    })

    it.each(examples)('the timeline is updated correctly', (setup: StateModifier, event: StateModifier, activitiesAdded: number) => {
      const restrictedQueries = RestrictedDomain.instantiate(claims, unrestrictedQueries)
      const initialState = setup({ handleEvent })
      const initialActivityCount = restrictedQueries.getLocalTimeline().length
      event(initialState)
      expect(restrictedQueries.getLocalTimeline().length - initialActivityCount).toBe(activitiesAdded)
    })
  })

  describe('given a client with browse-private-collections privilege', () => {
    describe('when community-created', () => {
      it.todo('the activity is visible')
    })

    describe('when collection-created (public)', () => {
      it.todo('the activity is visible')
    })

    describe('when collection-created (private)', () => {
      it.todo('the activity is visible')
    })

    describe('when doi-entered (in a public collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when doi-entered (in a private collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when comment-created (in a public collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when comment-created (in a private collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when work-updated', () => {
      it.todo('the activity is not visible')
    })
  })

  describe('given a client with receive-work-updates privilege', () => {
    describe('when community-created', () => {
      it.todo('the activity is visible')
    })

    describe('when collection-created (public)', () => {
      it.todo('the activity is visible')
    })

    describe('when collection-created (private)', () => {
      it.todo('the activity is not visible')
    })

    describe('when doi-entered (in a public collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when doi-entered (in a private collection)', () => {
      it.todo('the activity is not visible')
    })

    describe('when comment-created (in a public collection)', () => {
      it.todo('the activity is visible')
    })

    describe('when comment-created (in a private collection)', () => {
      it.todo('the activity is not visible')
    })

    describe('when work-updated', () => {
      it.todo('the activity is visible')
    })
  })
})

