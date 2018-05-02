const router = require('express').Router()
const passport = require('../config/auth')
const { Message,User } = require('../models')
const replaceAuthor = require('../lib/replaceAuthor')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')
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
        replaceAuthor(allMessages)
          .then((renamedMessages) => {
            res.json(renamedMessages)
          })
      })
    })
    // Throw a 500 error if something goes wrong
    .catch((error) => next(error))
  })

  .get('/message/:messageId',authenticate, (req, res, next) => {
    const messageId = req.params.messageId
    const userId = req.account._id
    Message.findById(messageId)
    .then((foundMessage) => {
      if (!foundMessage) { return next() }
      replaceAuthor([foundMessage])
        .then((renamedMessage) => {
          if(foundMessage.reciever==userId){
          Message.findByIdAndUpdate((messageId),{ $set:{read:true} },{new:true})
            .then(() => { res.json(renamedMessage[0])  })
          }
          else { res.json(renamedMessage[0]) }

        })
    })
    .catch((error) => next(error))
  })

  .post('/messages', authenticate, (req, res, next) => {
    const { author,content,reciever,replyTo } = req.body
    if(reciever===author){
      res.json({ message:`You can't send a message to yourself`})
    } else {
      User.findById(reciever)
      .then((someGuy) => {
        if(!!someGuy){
          const newMessage = {
            author: author,
            content: content,
            reciever: reciever,
            replyTo: replyTo,
          }
          Message.create(newMessage)
          .then((createdMessage) => {
            replaceAuthor([createdMessage])
              .then((renamedMessage) => {
                res.json(renamedMessage[0])
              })
          })
          .catch((error) => next(error))

        }
        else {
          res.json({message:'invalid reciever'})
        }
      })
      .catch((err) => { console.log(err)})
    }
  })

  .delete('/message/:messageId', authenticate, (req, res, next) => {
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
