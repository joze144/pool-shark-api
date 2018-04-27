'use strict'

const logger = require('./logger')

/**
 * Initialize Socket.io
 */
const init = function (app) {
  const server = require('http').Server(app)
  const io = require('socket.io')(server)

  app.set('io', io)

  // Force Socket.io to ONLY use "websockets"; No Long Polling.
  io.set('transports', ['websocket'])

  // Logging a user joining and leaving
  io.on('connection', (socket) => {
    logger.info('a user connected')

    socket.on('disconnect', () => {
      logger.info('user disconnected')
    })
  })

  // The server object will be then used to list to a port number
  return server
}

module.exports = init
