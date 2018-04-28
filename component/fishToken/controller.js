'use strict'

const httpStatus = require('http-status-codes')
const logger = require('../../config/logger')
const FishToken = require('./contractModel')

async function getTokenById (req, res) {
  const id = req.params.id

  try {
    const token = await FishToken.findOne({_id: id}).then()
    return res.json(token)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

module.exports = {
  getTokenById
}
