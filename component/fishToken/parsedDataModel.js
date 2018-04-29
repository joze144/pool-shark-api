'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema
const FishTokenEvents = require('./Events')

const fishTokenDataSchema = new Schema({
  log_id: {
    required: true,
    type: String
  },
  tx_hash: {
    required: true,
    type: String
  },
  signature: {
    required: true,
    type: String
  },
  contract_address: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: String,
    enum: [FishTokenEvents.ISSUE, FishTokenEvents.NEW_SHARK, FishTokenEvents.TRANSFER]
  },
  from_address: String,
  to_address: String,
  amount_wei: String,
  shark_address: String,
  shark_amount_wei: String,
  block_number: {
    required: true,
    type: Number
  },
  removed: {
    required: true,
    type: Boolean
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

fishTokenDataSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('FishTokenData', fishTokenDataSchema)
