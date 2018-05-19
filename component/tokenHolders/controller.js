'use strict'

const httpStatus = require('http-status-codes')
const logger = require('../../config/logger')
const tokenHelper = require('../eventParser/fishTokenParser/helper')
const TokenHolders = require('./tokenHoldersModel')

async function getTokenHolders (req, res) {
  const poolAddress = req.params.id

  const token = await tokenHelper.getTokenForPool(poolAddress)

  if (!token) {
    return res.status(httpStatus.NOT_FOUND).json({docs: []})
  }

  const query = {
    token_address: token.address
  }
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true,
    sort: '-token_amount'
  }

  try {
    const holders = await TokenHolders.paginate(query, options)
    return res.status(httpStatus.OK).json(holders)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

module.exports = {
  getTokenHolders
}
