'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const fishTokenContractSchema = new Schema({
  address: {
    required: true,
    type: String
  },
  pool_address: {
    required: true,
    type: String
  },
  deadline: {
    required: true,
    type: Number
  },
  block_created: {
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

fishTokenContractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('FishTokenContract', fishTokenContractSchema)
