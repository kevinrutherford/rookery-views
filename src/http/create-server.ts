import { createServer } from 'http'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import Koa from 'koa'
import { bearerToken } from 'koa-bearer-token'
import { invokeService } from './invoke-service'
import { logRequest } from './log-request'
import ping from './ping'
import { Route, router } from './router'
import { startServer } from './start-server'
import { Domain } from '../domain/index.open'
import { Logger } from '../logger'
import { ServicePath } from '../services'

export const createHttpServer = (logger: Logger, servicePaths: ReadonlyArray<ServicePath>, domain: Domain): void => {
  const routes = pipe(
    servicePaths,
    RA.map((route) => ({
      path: route.path,
      handler: invokeService(logger, route.service, domain),
    }) satisfies Route),
    RA.append({ path: '/ping', handler: ping() }),
  )

  const routery = router(routes)

  const app = new Koa()
  app.use(logRequest(logger))
  app.use(bearerToken())
  app.use(routery.routes())
  app.use(routery.allowedMethods())
  const server = createServer(app.callback())

  server.on('listening', (): void => logger.info('Server running'))
  server.on('close', (): void => logger.info('Server stopping'))
  startServer(logger)(server)
}

