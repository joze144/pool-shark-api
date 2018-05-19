'use strict'

const express = require('express')

// Middleware
const pagination = require('./pagination')

// Controllers
const poolController = require('./poolList/controller')
const fishTokenController = require('./fishToken/controller')
const tokenHoldersController = require('./tokenHolders/controller')

const apiRoutes = express.Router()
const v1Routes = express.Router()

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use('/v1', v1Routes)

v1Routes.get('/pool/statistics', poolController.getPoolsStatistics)
v1Routes.post('/pool/list/category', pagination, poolController.getPoolsByCategory)
v1Routes.post('/pool/list', pagination, poolController.getPools)
v1Routes.get('/pool/list', pagination, poolController.getPools)
v1Routes.get('/pool/:id', poolController.getPoolById)
v1Routes.get('/token/:id', fishTokenController.getTokenById)
v1Routes.get('/holders/:id', pagination, tokenHoldersController.getTokenHolders)

// Account API
v1Routes.post('/pool/account/active', pagination, poolController.getPoolsForAccountActive)
v1Routes.post('/pool/account/finished', pagination, poolController.getPoolsForAccountFinished)

module.exports = apiRoutes
