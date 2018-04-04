const router = require('express').Router()
const passport = require('../config/auth')
const { Profile,User } = require('../models')


const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/profiles',(req,res,next) => {
    const ids = req.body.ids
    console.log(ids)
    User.find()
      .then((users) => {
        const filteredUsers = users.filter(u => !ids.filter(id => id===u._id)[0] )
        let result
        filteredUsers.map((u) => {
          Profile.find({userId:u._id})
            .then((profile) => {
              if(!!profile){
              result = [...result].concat(profile)
            } else {
              let user = {fullName:u.email,_id:u._id,createdAt:u.createdAt,updatedAt:u.updatedAt}
              result = [...result].concat(user)
            }
            })
            .catch((err) => res.json(err))

        })
        res.json(result)
      })
  })
  .get('/profile/:id', authenticate,(req, res, next) => {
    const id = req.params.id
    Profile.find({userId:id})
      .then((profile) => {
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
    Profile.find({userId:id})
    .then((foundProfile) => {
      if(!!foundProfile){
        Profile.create(newProfile)
        .then((createdProfile) => {
          res.json(createdProfile)
       })
       .catch((error) => next(error))
      } else {
        Profile.findByIdAndUpdate(id,{ $set: newProfile }, { new: true })
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
