const mongoose = require('mongoose')
const { Schema } = mongoose

const roomSchema = new Schema({
  participants: [{ type:String }],
  game: { type:String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  ownerId: { type: String, required:true},
  name: { type: String, required: true},
})

module.exports = mongoose.model('rooms', roomSchema )

module.exports.replySchema = roomSchema
