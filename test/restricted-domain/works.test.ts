import * as E from 'fp-ts/Either'
import { Authority } from '../../src/auth/authority'
import { Domain } from '../../src/domain/domain'
import * as RestrictedDomain from '../../src/restricted-domain'
import * as UnrestrictedDomain from '../../src/unrestricted-domain'
import { defaultTestObserver } from '../default-test-observer'
import { arbitraryString, arbitraryWord } from '../helpers'
import { mkEvent } from '../mk-event'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const canBrowsePrivateCollections: Authority = () => true
const cannotBrowsePrivateCollections: Authority = () => false

describe('visibility of works', () => {
  let handleEvent: UnrestrictedDomain.EventHandler
  let unrestrictedQueries: Domain

  beforeEach(() => {
    const unrestrictedDomain = UnrestrictedDomain.instantiate(defaultTestObserver)
    handleEvent = unrestrictedDomain.handleEvent
    unrestrictedQueries = unrestrictedDomain.queries
  })

  describe('given a public collection and a private collection', () => {
    const publicCollectionId = arbitraryWord()
    const privateCollectionId = arbitraryWord()

    beforeEach(() => {
      handleEvent(mkEvent('collection-created', {
        id: publicCollectionId,
        name: arbitraryString(),
        description: arbitraryString(),
      }))
      handleEvent(mkEvent('collection-created', {
        id: privateCollectionId,
        name: arbitraryString(),
        description: arbitraryString(),
      }))
      handleEvent(mkEvent('collection-updated', {
        collectionId: privateCollectionId,
        attributes: {
          isPrivate: true,
        },
      }))
    })

    describe('and a Work entered only in the public collection', () => {
      const workId = arbitraryWord()

      beforeEach(() => {
        handleEvent(mkEvent('doi-entered', {
          id: arbitraryWord(),
          workId,
          collectionId: publicCollectionId,
        }))
      })

      describe('the work is visible to an unauthenticated client', () => {
        let restrictedQueries: Domain

        beforeEach(() => {
          restrictedQueries = RestrictedDomain.instantiate(cannotBrowsePrivateCollections, unrestrictedQueries)
        })

        it('in the list of all works', () => {
          expect(restrictedQueries.allWorks()).toHaveLength(1)
        })

        it('when looked up', () => {
          expect(E.isRight(restrictedQueries.lookupWork(workId))).toBe(true)
        })
      })
    })

    describe('and a Work entered only in the private collection', () => {
      describe('the work is visible to an authenticated client', () => {
        beforeEach(() => {
        })

        it.todo('via /works')
        it.todo('via /works/:id')
      })

      describe('the work is not visible to an unauthenticated client', () => {
        beforeEach(() => {
        })

        it.todo('via /works')
        it.todo('via /works/:id')
      })
    })

    describe('and a Work entered in both collections', () => {
      describe('the work is visible to an unauthenticated client', () => {
        beforeEach(() => {
        })

        it.todo('via /works')
        it.todo('via /works/:id')
      })
    })
  })
})

