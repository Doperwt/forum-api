const mongoose = require('mongoose')
const { Schema } = mongoose

const profileSchema = new Schema({
  fullName: { type:String, required: true },
  picture: { type:String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  bio: { type: String },
  userId: { type: String, required: true}
})

module.exports = mongoose.model('profiles', profileSchema )
