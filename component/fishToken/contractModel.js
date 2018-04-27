'use strict'

const mongoose = require('../../config/dbConnection')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const fishTokenContractSchema = new Schema({
  address: {
    required: true,
    type: String
  },
  deadline: Date,
  finished: {
    required: true,
    type: Boolean
  },
  last_block: Number
})

fishTokenContractSchema.plugin(mongoosePaginate)
module.exports = mongoose.db.model('FishTokenContract', fishTokenContractSchema)
