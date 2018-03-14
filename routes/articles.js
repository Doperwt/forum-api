const router = require('express').Router()
const passport = require('../config/auth')
const { Article } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/articles', (req, res, next) => {
      Article.find()
        // Newest articles first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((articles) => res.json(articles))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/articles/:id', (req, res, next) => {
      const id = req.params.id

      Article.findById(id)
        .then((group) => {
          if (!group) { return next() }
          res.json(group)
        })
        .catch((error) => next(error))
    })
    .post('/articles', authenticate, (req, res, next) => {
      console.log(req)
      // debugger
      const newArticle = {
        name:  'batch-'+req.body.name,
        startDate: req.body.start,
        endDate: req.body.end,
        students: []
      }

      Article.create(newArticle)
        .then((group) => {
          io.emit('action', {
            type: 'ARTICLE_CREATED',
            payload: group
          })
          res.json(group)
        })
        .catch((error) => next(error))
    })
    .patch('/articles/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()

      Article.findById(id)
        .then((group) => {
          if (!group) { return next() }

          const updatedArticle = processMove(group, req.body, userId)

          Article.findByIdAndUpdate(id, { $set: updatedArticle }, { new: true })
            .then((group) => {
              io.emit('action', {
                type: 'ARTICLE_UPDATED',
                payload: group
              })
              res.json(group)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/articles/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Article.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'ARTICLE_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
