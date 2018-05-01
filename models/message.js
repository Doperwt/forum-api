const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema({
  reciever: { type:String, required:true},
  author: { type:String, required: true },
  content: { type:String, required:true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replyTo: { type: String },
  read: { type: Boolean, default: false }
})

module.exports = mongoose.model('messages', messageSchema )
