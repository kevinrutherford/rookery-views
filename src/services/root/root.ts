import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { Domain } from '../domain'
import { renderCommunityIdentifier } from '../json-api/render-community-identifier'
import { pathToCommunity } from '../ui-links'
import { View } from '../view'

export const getRoot = (queries: Domain): View => () => () => pipe(
  {
    data: {
      type: 'root',
      id: '0',
      attributes: {},
      relationships: {
        community: {
          data: pipe(
            queries.getCommunity(),
            O.match(
              () => null,
              (c) => renderCommunityIdentifier(c.id),
            ),
          ),
          links: { related: pathToCommunity() },
        },
      },
    },
  },
  E.right,
)

