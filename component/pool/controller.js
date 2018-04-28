'use strict'

const httpStatus = require('http-status-codes')
const logger = require('../../config/logger')
const Pool = require('./poolModel')

async function getPools (req, res) {
  const query = {
  }
  if (req.body.name) {
    query.name = new RegExp(req.body.name, 'i')
  }
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true,
    sort: '-created_at'
  }
  if (req.body.sort_by) {
    options.sort = req.body.sort_by
  }

  try {
    const pools = await Pool.paginate(query, options)
    return res.json(pools)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

module.exports = {
  getPools
}
