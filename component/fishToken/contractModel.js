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
    type: Date
  },
  block_created: {
    required: true,
    type: Number
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

fishTokenContractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('FishTokenContract', fishTokenContractSchema)
