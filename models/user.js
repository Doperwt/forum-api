const mongoose = require('../config/database')
const { Schema } = mongoose

const userSchema = New Schema({
  name: { type String },

})

module.exports = mongoose.model('users', userSchema)
