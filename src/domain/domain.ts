import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Collection } from './collection-resource'
import { Comment } from './comment-resource'
import { Community } from './community-resource'
import { Discussion } from './discussion-resource'
import { Member } from './member-resource'
import { Update } from './update-resource'
import { Work } from './work-resource'

export type DomainProbe = {
  eventsCount: number,
  unexpectedEvents: Array<Record<string, unknown>>,
  unrecognisedEvents: Array<unknown>,
}

type DomainError = 'not-found' | 'not-authorised'

export type Domain = {
  allCollections: () => ReadonlyArray<Collection>,
  allDiscussions: () => ReadonlyArray<Discussion>,
  allMembers: () => ReadonlyArray<Member>,
  allWorks: () => ReadonlyArray<Work>,
  collectionsContainingWork: (workId: string) => ReadonlyArray<Collection>,
  findComments: (discussionId: string) => ReadonlyArray<Comment>,
  findDiscussionsAboutWork: (workId: string) => ReadonlyArray<Discussion>,
  findDiscussions: (collectionId: string) => ReadonlyArray<Discussion>,
  getCommunity: () => O.Option<Community>,
  getCollection: (collectionId: string) => E.Either<DomainError, Collection>,
  getFollowedTimeline: () => ReadonlyArray<Update>,
  getFollowers: (memberId: string) => E.Either<DomainError, ReadonlyArray<string>>,
  getLocalTimeline: () => ReadonlyArray<Update>,
  lookupMember: (accountId: string) => E.Either<DomainError, Member>,
  lookupCollection: (collectionId: string) => E.Either<DomainError, Collection>,
  lookupDiscussion: (discussionId: string) => E.Either<DomainError, Discussion>,
  lookupWork: (id: string) => E.Either<DomainError, Work>,
  info: () => DomainProbe,
}

