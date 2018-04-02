const mongoose = require('mongoose')
const { Schema } = mongoose

const replySchema = new Schema({
  author: { type:String, required: true },
  content: { type:String, required:true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  articleId: { type: String, required:true},
})

module.exports = mongoose.model('replies', replySchema )

module.exports.replySchema = replySchema
