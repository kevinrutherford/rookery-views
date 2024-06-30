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

type Action = {
  description: string,
  act: StateModifier,
}

const createCollection: Action = {
  description: 'collection-created',
  act: (state) => {
  const collectionId = arbitraryWord()
  state.handleEvent(mkEvent('collection-created', {
    id: collectionId,
    name: arbitraryString(),
    description: arbitraryString(),
  }))
  return { ...state, collectionId }
},
  }

const addEntry: Action = {
  description: 'doi-entered',
  act: (state) => {
  const entryId = arbitraryWord()
  state.handleEvent(mkEvent('doi-entered', {
    id: entryId,
    workId: arbitraryWord(),
    collectionId: state.collectionId,
  }))
  return { ...state, entryId }
},
  }

const becomePrivate: Action = {
  description: 'collection-updated to become private',
  act: (state) => {
  state.handleEvent(mkEvent('collection-updated', {
    collectionId: state.collectionId,
    attributes: {
      isPrivate: true,
    },
  }))
  return state
},
  }

const addComment: Action = {
  description: 'comment-added',
  act: (state) => {
  state.handleEvent(mkEvent('comment-created', {
    id: arbitraryWord(),
    entryId: state.entryId,
    content: arbitraryString(),
  }))
  return state
},
  }

type Scenario = {
  description: string,
  setup: StateModifier,
}

const emptyDatabase: Scenario = {
  description: 'an empty community',
  setup: identity,
}

const emptyCollection: Scenario = {
  description: 'an empty public collection',
  setup: createCollection.act,
}

const emptyPrivateCollection: Scenario = {
  description: 'an empty privae collection',
  setup: flow(emptyCollection.setup, becomePrivate.act),
}

const publicCollectionWithEntry: Scenario = {
  description: 'an entry in a public collection',
  setup: flow(emptyCollection.setup, addEntry.act),
}

const privateCollectionWithEntry: Scenario = {
  description: 'an entry in a private collection',
  setup: flow(publicCollectionWithEntry.setup, becomePrivate.act),
}

type Example = [scenario: Scenario, event: Action, activitiesAdded: number]
type Examples = ReadonlyArray<Example>

type Client = {
  description: string,
  claims: Authority,
}

const noPrivileges: Client = {
  description: 'has no privileges',
  claims: () => false,
}

const canBrowsePrivateCollections: Client = {
  description: 'can browse private collections',
  claims: (requiredScope) => requiredScope === 'browse-private-collections',
}

const canReceiveWorkUpdates: Client = {
  description: 'can receive work updates',
  claims: (requiredScope) => requiredScope === 'receive-work-updates',
}

describe.each([
  [noPrivileges, [
    // [emptyDatabase, createCommunity, 1],
    [emptyDatabase, createCollection, 1],
    // [emptyDatabase, createPrivateCollection, 0],
    [emptyCollection, addEntry, 1],
    [emptyPrivateCollection, addEntry, 0],
    [publicCollectionWithEntry, addComment, 1],
    [privateCollectionWithEntry, addComment, 0],
    // [emptyDatabase, updateWork, 0],
  ] satisfies Examples],
  [canBrowsePrivateCollections, [
    // [emptyDatabase, createCommunity, 1],
    [emptyDatabase, createCollection, 1],
    // [emptyDatabase, createPrivateCollection, 1],
    [emptyCollection, addEntry, 1],
    // [emptyPrivateCollection, addEntry, 1],
    [publicCollectionWithEntry, addComment, 1],
    // [privateCollectionWithEntry, addComment, 1],
    // [emptyDatabase, updateWork, 0],
  ] satisfies Examples],
  [canReceiveWorkUpdates, [
    // [emptyDatabase, createCommunity, 1],
    [emptyDatabase, createCollection, 1],
    // [emptyDatabase, createPrivateCollection, 0],
    [emptyCollection, addEntry, 1],
    [emptyPrivateCollection, addEntry, 0],
    [publicCollectionWithEntry, addComment, 1],
    [privateCollectionWithEntry, addComment, 0],
    // [emptyDatabase, updateWork, 1],
  ] satisfies Examples],
])('client-can-see-activity', (client: Client, examples: Examples) => {
  let handleEvent: UnrestrictedDomain.EventHandler
  let unrestrictedQueries: Domain

  describe.each(examples)(`given a client who ${client.description}`, (scenario: Scenario, action: Action, activitiesAdded: number) => {
    describe(`and ${scenario.description}`, () => {

      beforeEach(() => {
        const unrestrictedDomain = UnrestrictedDomain.instantiate(defaultTestObserver)
        handleEvent = unrestrictedDomain.handleEvent
        unrestrictedQueries = unrestrictedDomain.queries
      })

      it(`when ${action.description}, the activity is ${activitiesAdded === 0 ? 'not ' : ''}visible`, () => {
        const restrictedQueries = RestrictedDomain.instantiate(client.claims, unrestrictedQueries)
        const initialState = scenario.setup({ handleEvent })
        const initialActivityCount = restrictedQueries.getLocalTimeline().length
        action.act(initialState)
        expect(restrictedQueries.getLocalTimeline().length - initialActivityCount).toBe(activitiesAdded)
      })
    })
  })
})

