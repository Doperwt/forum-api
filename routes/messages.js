const router = require('express').Router()
const passport = require('../config/auth')
const { Message } = require('../models')


const authenticate = passport.authorize('jwt', { session: false })
