import { Readmodel } from '../state/readmodel'

export const cacheActor = (state: Readmodel, actorId: string): void => {
  if (state.members.get(actorId))
    return
  state.members.set(actorId, {
    id: actorId,
    username: 'unknown',
    displayName: 'Unknown User',
    avatarUrl: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
    following: [],
    cache: 'fetching',
  })
  if (actorId === process.env.USER_1_ID) {
    state.members.set(actorId, {
      id: actorId,
      username: process.env.USER_1_USERNAME ?? 'Missing env var',
      displayName: process.env.USER_1_DISPLAYNAME ?? 'Missing env var',
      avatarUrl: process.env.USER_1_AVATAR_URL ?? 'Missing env var',
      following: [],
      cache: 'fetched',
    })
  }
  if (actorId === process.env.USER_2_ID) {
    state.members.set(actorId, {
      id: actorId,
      username: process.env.USER_2_USERNAME ?? 'Missing env var',
      displayName: process.env.USER_2_DISPLAYNAME ?? 'Missing env var',
      avatarUrl: process.env.USER_2_AVATAR_URL ?? 'Missing env var',
      following: [],
      cache: 'fetched',
    })
  }
  if (actorId === process.env.USER_3_ID) {
    state.members.set(actorId, {
      id: actorId,
      username: process.env.USER_3_USERNAME ?? 'Missing env var',
      displayName: process.env.USER_3_DISPLAYNAME ?? 'Missing env var',
      avatarUrl: process.env.USER_3_AVATAR_URL ?? 'Missing env var',
      following: [],
      cache: 'fetched',
    })
  }
  if (actorId === process.env.USER_CRB_ID) {
    state.members.set(actorId, {
      id: actorId,
      username: process.env.USER_CRB_USERNAME ?? 'Missing env var',
      displayName: process.env.USER_CRB_DISPLAYNAME ?? 'Missing env var',
      avatarUrl: process.env.USER_CRB_AVATAR_URL ?? 'Missing env var',
      following: [],
      cache: 'fetched',
    })
  }
}

