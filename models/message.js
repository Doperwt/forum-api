const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
  author: { type:String, required: true },
  content: { type:String, required:true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reply_to: { type: String }
})

module.exports = mongoose.model('messages', messageSchema )
