'use strict'

const httpStatus = require('http-status-codes')
const logger = require('../../config/logger')
const Pool = require('./poolModel')

async function getPools (req, res) {
  const query = {
  }
  if (req.body.filter) {
    const name = new RegExp(req.body.filter, 'i')
    const address = new RegExp(req.body.filter, 'i')
    query.$or = [{name: name}, {address: address}]
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

async function getSinglePool (req, res) {
  return res.json({message: 'It works. ID: ' + req.params.id})
}

module.exports = {
  getPools,
  getSinglePool
}
