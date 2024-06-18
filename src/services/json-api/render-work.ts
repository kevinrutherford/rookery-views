import { JsonApiResource } from './json-api-resource'
import { renderWorkIdentifier } from './render-work-identifier'
import { Work } from '../domain/work-resource'

export const renderWork = (work: Work): JsonApiResource => ({
  ...renderWorkIdentifier(work.id),
  attributes: {
    ...work.frontMatter,
    updatedAt: work.updatedAt.toISOString(),
  },
})

