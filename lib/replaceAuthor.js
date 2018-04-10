const { User,Profile } = require('../models')
const Promise = require('promise')

module.exports = (entities) => {
  return new Promise((resolve, reject) => {
  let namedEntities
  User.find()
    .then((users) => {
      Profile.find()
        .then((profiles) => {
          let user,profile
          namedEntities = entities.map((entity) => {

            user = users.filter(u => u._id == entity.author)[0]
            profile = profiles.filter(p => p.userId == user._id)[0]
            entity.author = (!!profile?profile.fullName:user.email.split('@')[0])
            return entity
          })
          resolve(namedEntities)
        })
        .catch((err) => console.log(err) )
    })
    .catch((err) => console.log(err) )
  })
}
