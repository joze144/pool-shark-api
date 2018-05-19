'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const tokenHoldersSchema = new Schema({
  user_address: {
    required: true,
    type: String
  },
  token_address: {
    required: true,
    type: String
  },
  token_amount: {
    required: true,
    type: Number
  },
  is_shark: {
    required: true,
    type: Boolean,
    default: false
  }
})

tokenHoldersSchema.index({ user_address: 1, token_address: 1 }, { unique: true })
tokenHoldersSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('TokenHolder', tokenHoldersSchema)
