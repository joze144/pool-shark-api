'use strict'

// Dependencies
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const httpStatus = require('http-status-codes')
const helmet = require('helmet')

// Components
const server = require('./config/socket')(app)
const config = require('./config/main')
const routes = require('./component/router')
const morgan = require('morgan')
const logger = require('./config/logger')
const initScript = require('./component/initScript')
const cronJobRunner = require('./component/cronJobRunner')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.environments.ropsten
}
const env = process.env.NODE_ENV

// Middlewares
app.use(helmet())
app.use(bodyParser.json({limit: '500kb'}))
app.use(bodyParser.urlencoded({limit: '500kb', extended: true}))
app.use(morgan('dev', { 'stream': logger.stream }))

// Enable CORS from client-side
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Expose-Headers', 'Content-Disposition')
  next()
})

// Import routes to be served
app.use('/api/', routes)

// If no route is matched by now, return API version
app.use(function (req, res) {
  logger.info('Wrong end point: ' + req.originalUrl)
  res.status(httpStatus.OK)
  res.json({
    'api_endpoint': config.domain + '/api/' + config.last_endpoint_version,
    'version': config.version,
    'request': req.originalUrl
  })
})

const port = config.port

// Start the server
server.listen(port, () => {
  logger.info('Current environment: %s', env)
  logger.info('Shark of The Pool API. Server listening on port %s', port)
  logger.info('Domain: %s', config.domain)
})

initScript.init().then((done, err) => {
  if (err) {
    logger.error('Problem with data initialization!')
    logger.error(err)
    return
  }

  logger.info(done)
})

cronJobRunner.isActive().then((done) => {
  if (done) {
    logger.info('Data parser is active!')
    return
  }
  logger.info('Data parsing disabled! Check ./config/main/parsing_active setting')
})

module.exports = app
