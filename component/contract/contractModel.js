'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const Type = require('./Types')

const contractSchema = new Schema({
  address: {
    required: true,
    type: String
  },
  active: {
    default: true,
    required: true,
    type: Boolean
  },
  contract_type:{
    type: String,
    enum: [Type.FishToken, Type.Pool, Type.App]
  },
  last_checked_block: {
    default: 0,
    type: Number
  }
})

contractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('Contract', contractSchema)
