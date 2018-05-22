'use strict'

const _ = require('underscore')
const httpStatus = require('http-status-codes')
const logger = require('../../config/logger')
const statisticsHelper = require('./statisticsHelper')
const tokenStatisticsHelper = require('../tokenHolders/statisticsHelper')
const PoolList = require('./poolListModel')
const fishTokenDataHelper = require('../eventParser/fishTokenParser/helperQuery')

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
    const pools = await PoolList.paginate(query, options)
    return res.json(pools)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getPoolsByCategory (req, res) {
  const category = req.body.category

  const query = {}

  const options = {
    page: req.body.page,
    limit: req.body.limit,
    lean: true
  }

  switch (category) {
    case 'latest':
      options.sort = '-created_at'
      break
    case 'best_ever':
      options.sort = '-collected_eth'
      break
    case 'best_active':
      const nowEpoch = new Date().getTime()
      query.deadline = {$gt: nowEpoch}
      options.sort = '-collected_eth'
      break
    default:
      options.sort = 'created_at'
  }

  try {
    const pools = await PoolList.paginate(query, options)
    return res.json(pools)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getPoolById (req, res) {
  const address = req.params.id

  try {
    const pool = await PoolList.findOne({address: address}).then()

    return res.json(pool)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getPoolsStatistics (req, res) {
  const p1 = statisticsHelper.allPoolsStatistics()
  const p2 = statisticsHelper.activePoolsStatistics()
  // const p3 = tokenStatisticsHelper.usersStatistics()

  try {
    const results = await Promise.all([p1, p2])

    const payload = {
      all_pool_count: results[0].pool_count,
      all_collected_eth: results[0].total_collected_eth,
      active_pool_count: results[1].pool_count,
      active_collected_eth: results[1].total_collected_eth
      // user_count: results[2].holders_data.length
    }
    return res.status(httpStatus.OK).json(payload)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getPoolsForAccountActive (req, res) {
  const account = req.body.account
  const currentEpoch = Math.floor(new Date().getTime())

  try {
    const tokens = await fishTokenDataHelper.getPoolsForAddress(account)
    const query = {
      token_address: {
        $in: tokens
      },
      deadline: {
        $gt: currentEpoch
      }
    }
    const options = {
      page: req.body.page,
      limit: req.body.limit,
      lean: true,
      sort: '-deadline'
    }

    const pools = await PoolList.paginate(query, options).then()
    return res.status(httpStatus.OK).json(pools)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

async function getPoolsForAccountFinished (req, res) {
  const account = req.body.account
  const currentEpoch = Math.floor(new Date().getTime())

  try {
    const tokens = await fishTokenDataHelper.getPoolsForAddress(account)

    const query = {
      token_address: {
        $in: tokens
      },
      deadline: {
        $lte: currentEpoch
      }
    }
    const options = {
      page: req.body.page,
      limit: req.body.limit,
      lean: true,
      sort: '-deadline'
    }

    const pools = await PoolList.paginate(query, options).then()
    return res.status(httpStatus.OK).json(pools)
  } catch (err) {
    logger.error(err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
  }
}

module.exports = {
  getPools,
  getPoolById,
  getPoolsByCategory,
  getPoolsStatistics,
  getPoolsForAccountActive,
  getPoolsForAccountFinished
}
