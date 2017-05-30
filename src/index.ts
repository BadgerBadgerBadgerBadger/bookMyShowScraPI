'use strict'

require('source-map-support').install()

if (process.env.NODE_ENV !== `production`) {
  Error.stackTraceLimit = Infinity
}

import * as Server from 'server'
import Logger from 'utility/logger'

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught exception', `error: ${err.message}`, {
    error: err,
    stack: err.stack
  })
  process.exit(1)
})

process.on('unhandledRejection', (reason: Error, promise: Promise<Error>) => {
  console.error('unhandledRejection', '', {
    promise: promise,
    reason: reason
  })
  process.exit(1)
})

async function init() {
  Server.init()
}

init()
  .then(() => {
    Logger.info({msg: `Server is ready to accept connections.`})
  })
  .catch(error => {
    Logger.error({msg: `Failure during startup: ${error.message}`, error})
  })
