const router = require('express').Router()
const { Profile,User } = require('../models')

module.exports = io => {
  router
  .get('/names/:partial',(req, res, next) => {
    const partialName = req.params.partial
    console.log(partialName,"recieved NAMES route")
    Profile.find({fullName:{$regex:partialName}})
      .then((profiles) => {
        User.find({email:{$regex:partialName}})
          .then((users) => {
            // if (!profile) { res.json('not found') }
            console.log(users,profiles,'found users and profiles')
            let resultUsers= users.map((user) =>{
              return { name: user.email.split('@')[0],_id:user._id}
            })
            let resultProfiles = profiles.map((profile) =>{
              let user = User.findById()
              return { _id:user._id,name:profile.fullName}
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
    console.log(partialName,'recieved NAME route')
  })
  return router
}
