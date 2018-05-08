const mongoose = require('mongoose')
const { Schema } = mongoose

const lineSchema = new Schema({
  content:{type:String, required: true},
  userName:{type:String, required: true},
  createdAt: { type: Date, default: Date.now }
})

const roomSchema = new Schema({
  participants: [{ type:String }],
  game: { type:String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  ownerId: { type: String, required:true},
  name: { type: String, required: true},
  messages: [lineSchema]
})

module.exports = mongoose.model('rooms', roomSchema )

module.exports.replySchema = roomSchema
