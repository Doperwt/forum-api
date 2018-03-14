const router = require('express').Router()
const { User } = require('../models')

route.post('/users',(req,res,next) => {
  User.register(new User({name: req.body.name, email: req.body.email}), req.body.password, (err, user) => {
    if (err) {
      err.status = 422
      return next(err)
    }
    res.status(201).send(user)
  })
})
