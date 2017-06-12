'use strict'

import {Stream} from 'bunyan'
import * as config from 'config'
import * as debug from 'debug'

const appName = <string>config.get(`app.name`)
const isProduction = process.env.NODE_ENV === `production`
const logOptions: {name: string, stream?: Stream} = {name: appName}

const logger = require(`bunyan`).createLogger(logOptions)

// Activate this logger only for development and leave the original for production.
if (!isProduction) {

  logger.info = console.info

  logger.error = (log: {msg: string, error: Error}) => {
    console.log(`ERROR: ${log.msg}`)
    console.log(log.error.stack)
  }

  logger.fatal = (log: {msg: string, error: Error}) => {
    console.log(`FATAL: ${log.msg}`)
    console.log(log.error.stack)
  }
}

logger.getDebugger = (key: string) => {
  return debug(`${appName}:${key}`)
}

export default logger
