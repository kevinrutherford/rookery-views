import { Middleware } from '@koa/router'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { StatusCodes } from 'http-status-codes'
import { allCollections } from './decorate'
import { ErrorOutcome } from './error-outcome'
import { ViewPath } from './view-path'
import * as Auth from '../auth'
import { Queries } from '../domain-model'
import { Logger } from '../logger'

const errorToStatus = (code: ErrorOutcome): number => {
  switch (code.category) {
    case 'bad-input':
      return StatusCodes.BAD_REQUEST
    case 'not-found':
      return StatusCodes.NOT_FOUND
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR
  }
}

type InvokeService = (logger: Logger, view: ViewPath['view'], queries: Queries) => Middleware

export const invokeService: InvokeService = (logger, view, queries) => (context) => {
  const authority = Auth.instantiate(context.request.token)
  const q: Queries = ({
    ...queries,
    allCollections: allCollections(queries)(authority),
  })
  pipe(
    {
      ...context.params,
      ...context.query,
    },
    view(q)(authority),
    E.match(
      (error) => {
        logger.debug(error.message, error.evidence)
        context.response.status = errorToStatus(error)
        context.response.type = 'json'
        context.response.body = { error }
      },
      (resource) => {
        context.response.status = StatusCodes.OK
        context.response.type = 'json'
        context.response.body = resource
      },
    ),
  )
}
