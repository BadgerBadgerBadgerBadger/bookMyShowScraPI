'use strict'

import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'

import * as config from 'config'

import Logger from 'utility/logger'
import BookMyShowRouter from 'server/bookMyShow'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))

app.use(`/bookmyshow`, BookMyShowRouter)

const port = config.get(`server.port`)

function init() {

  app.listen(port)
  Logger.info(`ExpressJS server running on port: ${port}`)

  return app
}

export { init }
