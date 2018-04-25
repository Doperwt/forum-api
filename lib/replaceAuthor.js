const { User,Profile } = require('../models')
const Promise = require('promise')

const replaceId = (id,users,profiles) => {
  let user,profile
  user = users.filter(u => u._id == id)[0]
  profile = profiles.filter(p => p.userId == user._id)[0]
  return (!!profile?profile.fullName:user.email.split('@')[0])
}

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
              newEntity.authorName = replaceId(entity.author,users,profiles)
              if(!!entity.reciever){
                newEntity.recieverName = replaceId(entity.reciever,users,profiles)
              }
              return newEntity
            })
          }
          resolve(namedEntities)
        })
        .catch((err) => console.log(err) )
    })
    .catch((err) => console.log(err) )
  })
}
