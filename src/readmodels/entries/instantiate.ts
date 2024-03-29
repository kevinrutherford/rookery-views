import { allEntries } from './all-entries'
import { findEntries } from './find-entries'
import { handleEvent } from './handle-event'
import { lookupEntry } from './lookup-entry'
import { Readmodel } from './readmodel'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const instantiate = () => {
  const currentState: Readmodel = {
    byCollection: new Map(),
    byEntryId: new Map(),
  }

  return ({
    handleEvent: handleEvent(currentState),
    queries: {
      allEntries: allEntries(currentState),
      findEntries: findEntries(currentState),
      lookupEntry: lookupEntry(currentState),
    },
  })
}

