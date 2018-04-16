const router = require('express').Router()
const passport = require('../config/auth')
const { Message } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')
const replaceAuthor = require('../lib/replaceAuthor')
const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/messages/:id', (req, res, next) => {
    const id = req.params.id
    Message.find({messageId:id})
    // Newest messages first
    .sort({ createdAt: 1 })
    // Send the data in JSON format
    .then((messages) => {
      if(replies.length!==0){
        replaceAuthor(replies)
          .then((newMessages) => res.json(newMessages))
      } else {
        res.json(messages)
      }
    })
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })

  .get('/messages/:messageId', (req, res, next) => {
    const messageId = req.params.messageId
    Message.findById(id)
    .then((foundMessage) => {
      if (!foundMessage) { return next() }
      res.json(foundMessage)
    })
    .catch((error) => next(error))
  })

  .post('/messages/', authenticate, (req, res, next) => {
    const messageId = req.params.id
    const newMessage = {
      author: req.body.author,
      content: req.body.content,
      reciever: req.body.reciever,
      replyTo: req.body.replyTo,
    }
    Message.create(newMessage)
    .then((createdMessage) => {
      replaceAuthor([createdMessage])
        .then((changedMessage) => {
          res.json(changedMessage[0])
        })
    })
    .catch((error) => next(error))
  })

  .patch('/messages/:messageId', authenticate, (req, res, next) => {
    const messageId = req.params.messageId
    const userId = req.account._id.toString()
    Message.findById(messageId)
    .then((reply) => {
      if (!reply) { return next() }
      const updatedMessage = { content:req.body.content,updatedAt:Date.now()}
      Message.findByIdAndUpdate(messageId, { $set: updatedMessage }, { new: true })
      .then((newUpdatedMessage) => {
        replaceAuthor([newUpdatedMessage])
          .then((changedMessage) => {
            res.json(changedMessage)
          })
        })
      .catch((error) => next(error))
    })
    .catch((error) => next(error))
  })

  .delete('/messages/:messageId', authenticate, (req, res, next) => {
    const messageId = req.params.messageId
    Message.findByIdAndRemove(messageId)
    .then(() => {
      res.status = 200
      res.json({
        message: 'Removed',
        _id: messageId
      })
    })
    .catch((error) => next(error))
  })
  return router
}
