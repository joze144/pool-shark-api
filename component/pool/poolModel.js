'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const poolContractSchema = new Schema({
  address: {
    required: true,
    type: String
  },
  token_address: {
    required: true,
    type: String
  },
  name: String,
  deadline: Date,
  collected_eth: {
    type: String,
    default: '0'
  },
  finished: {
    required: true,
    type: Boolean
  },
  last_block: Number
})

poolContractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('PoolContract', poolContractSchema)
