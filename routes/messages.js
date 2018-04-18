const router = require('express').Router()
const passport = require('../config/auth')
const { Message } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')
const replaceAuthor = require('../lib/replaceAuthor')
const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/messages/:userId', (req, res, next) => {
    const id = req.params.userId
    console.log(id,'MESSAGE BODY')
    Message.find({author:id})
    .then((sentMessages) => {
      Message.find({reciever:id})
      .then((recievedMessages) =>{
        let allMessages = [...sentMessages,...recievedMessages]
        res.json(allMessages)
      })
    })
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })

  // .get('/messages/:messageId', (req, res, next) => {
  //   const messageId = req.params.messageId
  //   Message.findById(id)
  //   .then((foundMessage) => {
  //     if (!foundMessage) { return next() }
  //     res.json(foundMessage)
  //   })
  //   .catch((error) => next(error))
  // })

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
      res.json(createdMessage)
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
