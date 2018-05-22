'use strict'

const PAGE_DEFAULT = 1
const LIMIT_DEFAULT = 5
const MIN_LIMIT = 0
const MAX_LIMIT = 100

module.exports = (req, res, next) => {
  if (req.body.limit === 'undefined' || req.body.page === 'undefined') {
    req.body.limit = LIMIT_DEFAULT
    req.body.page = PAGE_DEFAULT
    next()
    return
  }

  let limit = parseInt(req.body.limit)
  let page = parseInt(req.body.page)

  if (!limit || limit === MIN_LIMIT) {
    limit = Number.MAX_SAFE_INTEGER
  } else if (limit > MAX_LIMIT || limit < MIN_LIMIT) {
    limit = LIMIT_DEFAULT
  }

  if (!page || page < PAGE_DEFAULT) {
    page = PAGE_DEFAULT
  }

  req.body.limit = limit
  req.body.page = page

  next()
}
