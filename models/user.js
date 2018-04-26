const mongoose = require('../config/database')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose
const { profileSchema } = require('./profile')

const userSchema = new Schema({
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  profile: profileSchema
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

module.exports = mongoose.model('users', userSchema)
module.exports.userSchema = userSchema
