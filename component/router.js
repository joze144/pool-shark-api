'use strict'

const express = require('express')

const apiRoutes = express.Router()
const v1Routes = express.Router()

// Set v1 routes as subgroup/middleware to apiRoutes
apiRoutes.use('/v1', v1Routes)

module.exports = apiRoutes