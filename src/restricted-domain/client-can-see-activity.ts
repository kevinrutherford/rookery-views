import { Authority } from '../auth/authority'
import { Activity } from '../domain/domain'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clientCanSeeActivity = (claims: Authority) => (activity: Activity): boolean => {
  switch (activity.type) {
    case 'comment-created':
      return !activity.isPrivate
    case 'doi-entered':
      return !activity.isPrivate
    default:
      return true
  }
}
