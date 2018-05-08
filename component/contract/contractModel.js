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
  deadline: {
    type: Number,
    required: true
  },
  contract_type: {
    type: String,
    enum: [Type.FishToken, Type.Pool, Type.App]
  },
  last_checked_block: {
    default: 0,
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

contractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('Contract', contractSchema)
