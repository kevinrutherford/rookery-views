import { Readmodel } from './readmodel'
import { DomainEvent } from '../domain-event'

export const handleEvent = (state: Readmodel) => (event: DomainEvent): void => {
  if (event.type === 'collection-created')
    state.set(event.data.id, event.data)
}

