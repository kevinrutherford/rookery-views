type UpdateCommonAttributes = {
  id: string,
  created: Date,
  actorId: string,
  occurredWithinPrivateCollection: boolean,
}

export type CommunityCreated = UpdateCommonAttributes & {
  kind: 'update:community-created',
  communityId: string,
}

export type CollectionCreated = UpdateCommonAttributes & {
  kind: 'update:collection-created',
  collectionId: string,
}

export type CommentCreated = UpdateCommonAttributes & {
  kind: 'update:comment-created',
  content: string,
  discussionId: string,
  workId: string,
}

export type DiscussionStarted = UpdateCommonAttributes & {
  kind: 'update:discussion-started',
  workId: string,
  collectionId: string,
  discussionId: string,
}

export type FrontMatterFetched = UpdateCommonAttributes & {
  kind: 'update:front-matter-found',
  workId: string,
}

export type WorkNotFound = UpdateCommonAttributes & {
  kind: 'update:work-not-found',
  workId: string,
}

type InboxDiscussionStarted = UpdateCommonAttributes & {
  kind: 'inbox-update:discussion-started',
}

export type InboxCommentCreated = UpdateCommonAttributes & {
  kind: 'inbox-update:comment-created',
  discussionId: string,
}

export type Update =
  | CollectionCreated
  | CommentCreated
  | CommunityCreated
  | DiscussionStarted
  | FrontMatterFetched
  | WorkNotFound
  | InboxDiscussionStarted
  | InboxCommentCreated

