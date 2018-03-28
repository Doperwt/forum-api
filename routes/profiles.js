const router = require('express').Router()
const passport = require('../config/auth')
const { Profile } = require('../models')


const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/profile/:id', authenticate,(req, res, next) => {
    const id = req.params.id
    console.log("MESSAGE RECIEVED")
    Profile.find({userId:id})
      .then((profile) => {
        console.log(!profile,'profile found')

        if (!profile) { return next() }

        res.json(profile)
      })
      .catch((error) => res.json(null))
  })
  .post('/profile/:id', (req, res, next) => {
    const id = req.params.id
    const newProfile = {
      fullName: req.body.fullName,
      bio: req.body.bio,
      picture: req.body.picture,
      userId:id,
    }
    console.log(newProfile)
    Profile.find({userId:id})
    .then((profile) => {
      console.log(!profile,'profile found')
      if(!!profile){
        Profile.create(newProfile)
        .then((createdProfile) => {
         io.emit('action', {
           type: 'PROFILE_CREATED',
           payload: createdProfile
         })
       })
       .catch((error) => next(error))
      } else {
        Profile.findByIdAndUpdate(id,{ $set: newProfile }, { new: true })
        .then((updatedProfile) => {
          io.emit('action', {
            type: 'UPDATED_PROFILE',
            payload: updatedProfile
          })
        })
        .catch((error) => next(error))
      }
    })
    .catch((error) => next(error))
  })
  return router
}
