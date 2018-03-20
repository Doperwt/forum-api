const mongoose = require('../config/database')
const { Schema } = mongoose
const { replySchema } = require('./reply')

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, reqiored: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  messages: [replySchema]

})


module.exports = mongoose.model('article', articleSchema)
