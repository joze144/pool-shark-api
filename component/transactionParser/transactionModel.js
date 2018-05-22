'use strict'

const Status = require('./Status')
const Type = require('./Type')
const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  tx_address: {
    type: String,
    required: true
  },
  creator_address: {
    type: String,
    required: true
  },
  block_included: {
    type: Number
  },
  tx_status: {
    type: String,
    enum: [Status.PENDING, Status.FAILED, Status.SUCCESS],
    required: true
  },
  tx_type: {
    type: String,
    enum: [Type.CREATE_POOL, Type.DEPOSIT, Type.TOKEN_TRANSFER, Type.WITHDRAW]
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

transactionSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('Transaction', transactionSchema)
