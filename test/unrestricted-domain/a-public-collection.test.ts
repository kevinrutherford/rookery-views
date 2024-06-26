import { Domain } from '../../src/domain/index.open'
import * as UnrestrictedDomain from '../../src/unrestricted-domain'
import { defaultTestObserver } from '../default-test-observer'
import { arbitraryString, arbitraryWord } from '../helpers'
import { mkEvent } from '../mk-event'

describe('given a public collection', () => {
  const workId = arbitraryWord()

  let d: Domain
  let h: UnrestrictedDomain.EventHandler

  beforeEach(() => {
    const { queries, handleEvent } = UnrestrictedDomain.instantiate(defaultTestObserver)
    d = queries
    h = handleEvent
  })

  describe('that has no entries', () => {
    describe('when doi-entered', () => {
      beforeEach(() => {
        const collectionId = arbitraryWord()
        h(mkEvent('collection-created', {
          id: collectionId,
          name: arbitraryString(),
          description: arbitraryString(),
        }))
        const doiEntered = mkEvent('doi-entered', {
          id: arbitraryWord(),
          workId,
          collectionId,
        })
        h(doiEntered)
      })

      it('records a new activity', () => {
        expect(d.getLocalTimeline()).toHaveLength(2)
      })

      it('records the activity as public', () => {
        expect(d.getLocalTimeline()[1].isPrivate).toBe(false)
      })

      it('records the new Work', () => {
        expect(d.allWorks()).toHaveLength(1)
        expect(d.allWorks()[0].id).toStrictEqual(workId)
      })
    })
  })

  describe('that has one entry', () => {
    describe('when doi-entered', () => {
      beforeEach(() => {
        const collectionId = arbitraryWord()
        h(mkEvent('collection-created', {
          id: collectionId,
          name: arbitraryString(),
          description: arbitraryString(),
        }))
        const doiEntered = mkEvent('doi-entered', {
          id: arbitraryWord(),
          workId,
          collectionId,
        })
        h(doiEntered)
        h(doiEntered)
      })

      it('does not add a new Work', () => {
        expect(d.allWorks()).toHaveLength(1)
      })
    })
  })
})

