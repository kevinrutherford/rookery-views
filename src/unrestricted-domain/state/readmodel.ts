import * as O from 'fp-ts/Option'
import { Collection } from './collection'
import { Discussion } from './discussion'
import { Work } from './work'
import {
  Comment,
  Community, DomainProbe, Member, Update,
} from '../../domain/index.open'

export type Readmodel = {
  collections: Map<string, Collection>,
  comments: Map<string, Array<Comment>>,
  community: O.Option<Community>,
  discussionsByCollection: Map<string, Array<Discussion>>,
  discussionsByDiscussionId: Map<string, Discussion>,
  followers: Map<string, Array<string>>,
  inbox: Array<Update>,
  info: DomainProbe,
  members: Map<string, Member>,
  updates: Array<Update>,
  works: Map<string, Work>,
}

