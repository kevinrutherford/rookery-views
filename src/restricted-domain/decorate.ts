import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { clientCanAccessCollection } from './client-can-access-collection'
import { clientCanSeeUpdate } from './client-can-see-update'
import { workIsEnteredInSomePublicCollection } from './work-is-entered-in-some-public-collection'
import { Authority } from '../auth/authority'
import {
  Collection, Domain, Entry, Work,
} from '../domain/index.open'

const collectionIsAccessible = (clientCan: Authority) => (collection: Collection): boolean => (
  clientCanAccessCollection(clientCan)(collection.isPrivate)
)

const workIsAccessible = (clientCan: Authority, queries: Domain) => (work: Work): boolean => (
  clientCan('browse-private-collections') || workIsEnteredInSomePublicCollection(queries)(work.id)
)

const clientCanAccessEntry = (clientCan: Authority, queries: Domain) => (entry: Entry): boolean => pipe(
  entry.collectionId,
  queries.lookupCollection,
  E.match(
    () => false,
    collectionIsAccessible(clientCan),
  ),
)

export const allCollections = (queries: Domain, claims: Authority): Domain['allCollections'] => () => pipe(
  queries.allCollections(),
  RA.filter(collectionIsAccessible(claims)),
)

export const allWorks = (queries: Domain, claims: Authority): Domain['allWorks'] => () => pipe(
  queries.allWorks(),
  RA.filter(workIsAccessible(claims, queries)),
)

export const getLocalTimeline = (queries: Domain, claims: Authority): Domain['getLocalTimeline'] => () => pipe(
  queries.getLocalTimeline(),
  RA.filter(clientCanSeeUpdate(claims, queries)),
)

export const lookupCollection = (queries: Domain, claims: Authority): Domain['lookupCollection'] => (collectionId) => pipe(
  collectionId,
  queries.lookupCollection,
  E.filterOrElseW(
    collectionIsAccessible(claims),
    () => 'not-authorised' as const,
  ),
)

export const lookupEntry = (queries: Domain, claims: Authority): Domain['lookupEntry'] => (entryId) => pipe(
  entryId,
  queries.lookupEntry,
  E.filterOrElseW(
    clientCanAccessEntry(claims, queries),
    () => 'not-authorised' as const,
  ),
)

export const lookupWork = (queries: Domain, claims: Authority): Domain['lookupWork'] => (workId) => pipe(
  workId,
  queries.lookupWork,
  E.filterOrElseW(
    workIsAccessible(claims, queries),
    () => 'not-authorised' as const,
  ),
)

