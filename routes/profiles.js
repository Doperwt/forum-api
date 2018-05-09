const router = require('express').Router()
const passport = require('../config/auth')
const { Profile,User,Message } = require('../models')
const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/profile', authenticate,(req,res,next) => {
    const userId = req.account._id
    Profile.findOne({userId:userId})
      .then((profile) => {
        if (!profile) { res.json('not found') }
        else {
          Message.find({reciever:userId})
            .then((foundMessages) => {

              const unreadMessageCount = foundMessages.filter(message => message.read === false ).length
              let updatedProfile = {...profile._doc, count:unreadMessageCount}
              res.json(updatedProfile)
            })
        }
        })
      .catch((error) => res.json(null))
  })
  .get('/profile/:id', authenticate,(req, res, next) => {
    const id = req.params.id
    Profile.findOne({userId:id})
      .then((profile) => {
        res.json(profile)
      })
      .catch((err) => {
        res.json(err)
      })
  })
  .post('/profile',authenticate, (req, res, next) => {
    const UserId = req.account._id
    const newProfile = {
      fullName: req.body.fullName,
      bio: req.body.bio,
      picture: req.body.picture,
      userId: UserId
    }
    Profile.findOne({userId:UserId})
    .then((foundProfile) => {
      if(!foundProfile){
        Profile.create(newProfile)
        .then((createdProfile) => {
          let updatedUser = { profile:createdProfile }
          User.findByIdAndUpdate((UserId),{ $set:updatedUser },{new:true})
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
