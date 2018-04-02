const router = require('express').Router()
const passport = require('../config/auth')
const { Article,Reply } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/articles/:id/replies', (req, res, next) => {
      const id = req.params.id
      Reply.find({articleId:id})
        // Newest articles first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((replies) => res.json(replies))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/articles/:articleId/replies/:replyId', (req, res, next) => {
      const articleId = req.params.articleId
      const replyId = req.params.replyId
      Reply.findById(id)
        .then((foundReply) => {
          if (!foundReply) { return next() }
          res.json(foundReply)
        })
        .catch((error) => next(error))
    })
    .post('/articles/:id/replies', authenticate, (req, res, next) => {
      console.log(req)
      const articleId = req.params.id
      // debugger
      const newReply = {
        author: req.body.author,
        articleId: articleId,
        content: req.body.content,
      }

      Reply.create(newReply)
        .then((createdReply) => {
          io.emit('action', {
            type: 'REPLY_CREATED',
            payload: createdReply
          })
          res.json(createdReply)
        })
        .catch((error) => next(error))
    })
    .patch('/articles/:articleId/replies/:replyId', authenticate, (req, res, next) => {
      const articleId = req.params.articleId
      const replyId = req.params.replyId
      const userId = req.account._id.toString()

      Reply.findById(id)
        .then((reply) => {
          if (!reply) { return next() }

          const updatedReply = {
            content:req.body.content
          }

          Reply.findByIdAndUpdate(replyId, { $set: updatedReply }, { new: true })
            .then((newUpdatedReply) => {
              io.emit('action', {
                type: 'REPLY_UPDATED',
                payload: newUpdatedReply
              })
              res.json(newUpdatedReply)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete(('/articles/:articleId/replies/:replyId', authenticate, (req, res, next) => {
      const articleId = req.params.articleId
      const replyId = req.params.replyId
      Reply.findByIdAndRemove(replyId)
        .then(() => {
          io.emit('action', {
            type: 'REPLY_REMOVED',
            payload: replyId
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
