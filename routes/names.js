const router = require('express').Router()
const { Profile,User } = require('../models')

module.exports = io => {
  router
  .get('/names/:partial',(req, res, next) => {
    const partialName = req.params.partial

    Profile.find({fullName:{$regex:partialName}})
      .then((profiles) => {
        User.find({email:{$regex:partialName}})
          .then((users) => {
            let resultUsers= users.map((user) =>{
              return { name: user.email.split('@')[0],_id:user._id}
            })
            let resultProfiles = profiles.map((profile) =>{
              resultUsers = resultUsers.filter(user => user._id.toString()!==profile.userId)
              return { _id:profile.userId,name:profile.fullName}
            })
            let results = [...resultUsers,...resultProfiles]
            res.json(results)
          })
          .catch((error) => { res.json(error)})
      })
      .catch((error) => res.json(error))
  })
  .get('/name/:partial',(req,res,nexxt) => {
    const partialName = req.params.partial
  })
  return router
}
