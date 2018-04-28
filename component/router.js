'use strict'

const express = require('express')

// Middleware
const pagination = require('./pagination')

// Controllers
const poolController = require('./pool/controller')
const fishTokenController = require('./fishToken/controller')

const apiRoutes = express.Router()
const v1Routes = express.Router()

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use('/v1', v1Routes)

v1Routes.post('/pool/list', pagination, poolController.getPools)
v1Routes.get('/token/:id', fishTokenController.getTokenById)

module.exports = apiRoutes
