const mongoose = require('../config/database')
const { Schema } = mongoose


const articleSchema = New Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model('article', articleSchema)
