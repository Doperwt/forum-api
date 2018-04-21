const mongoose = require('../config/database')
const { Schema } = mongoose
const { replySchema } = require('./reply')

const articleSchema = new Schema({
  author: { type:String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, reqiored: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [replySchema]
})


module.exports = mongoose.model('article', articleSchema)
