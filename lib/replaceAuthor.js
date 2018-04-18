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
          if(!!users[0]&&!!profiles[0]&&!!entities[0]){
            namedEntities = entities.map((entity) => {
              let newEntity = JSON.parse(JSON.stringify(entity))
              user = users.filter(u => u._id == entity.author)[0]
              profile = profiles.filter(p => p.userId == user._id)[0]
              newEntity.authorName = (!!profile?profile.fullName:user.email.split('@')[0])
              return newEntity
            })
          }
          console.log(namedEntities[0],'AUTHOR NAME')
          resolve(namedEntities)
        })
        .catch((err) => console.log(err) )
    })
    .catch((err) => console.log(err) )
  })
}
