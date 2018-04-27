'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema
const FishTokenEvents = require('./Events')

const fishTokenDataSchema = new Schema({
  address: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: String,
    enum: [FishTokenEvents.ISSUE, FishTokenEvents.NEW_SHARK, FishTokenEvents.TRANSFER]
  },
  from: String,
  to: String,
  amount: String,
  shark: String,
  totalSupply: String,
  block: {
    required: true,
    type: Number
  }
})

fishTokenDataSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('FishTokenData', fishTokenDataSchema)
