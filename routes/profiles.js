const router = require('express').Router()
const passport = require('../config/auth')
const { Profile,User } = require('../models')


const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/profile/:id', authenticate,(req, res, next) => {
    const id = req.params.id
    Profile.findOne({userId:id})
      .then((profile) => {
        if (!profile) { res.json('not found') }

        res.json(profile)
      })
      .catch((error) => res.json(null))
  })
  .post('/profile/:id',authenticate, (req, res, next) => {
    const id = req.params.id
    const newProfile = {
      fullName: req.body.fullName,
      bio: req.body.bio,
      picture: req.body.picture,
      userId: id
    }
    Profile.findOne({userId:id})
    .then((foundProfile) => {
      if(!foundProfile){
        Profile.create(newProfile)
        .then((createdProfile) => {
          let updatedUser = { profile:createdProfile }
          User.findByIdAndUpdate((id),{ $set:updatedUser },{new:true})
          .then((updatedUser) => { console.log(updatedUser.profile)})
          res.json(createdProfile)
       })
       .catch((error) => next(error))

      } else {
        newProfile.updatedAt = Date.now()
        Profile.findByIdAndUpdate(foundProfile._id,{ $set: newProfile }, { new: true })
        .then((updatedProfile) => {
          res.json(updatedProfile)
        })
        .catch((error) => next(error))
      }
    })
    .catch((error) => next(error))
  })
  return router
}
