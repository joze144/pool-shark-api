'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const poolListSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  creator_address: {
    type: String,
    required: true
  },
  token_address: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  rate: {
    required: true,
    type: Number
  },
  collected_eth: {
    required: true,
    type: Number
  },
  points_distributed: {
    required: true,
    type: Number
  },
  current_shark: {
    required: true,
    default: '',
    type: String
  },
  deadline: {
    required: true,
    type: Number
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

poolListSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('PoolList', poolListSchema)
