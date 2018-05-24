const router = require('express').Router()
const { Room,User } = require('../models')
const passport = require('../config/auth')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
  .get('/rooms',(req, res, next) => {
    Room.find()
      .then((rooms) => {
        res.json(rooms)
      })
      .catch((error) => res.json(error))
  })
  .get('/room/:id',(req,res,next) => {
    const roomId = req.params.id
    Room.findById(roomId)
      .then((room) => {
        res.json(room)
      })
      .catch((err) => { res.json(err) })
  })
  .post('/room', authenticate , (req,res,next) => {
    const ownerId = req.account._id
    const { name,game } = req.body
    let newRoom = {
      ownerId:ownerId,
      name: name,
      participants: [ownerId],
      game:game,
      messages: []
    }
    Room.create(newRoom )
      .then((createdRoom) => {
        res.json(createdRoom)
      })
      .catch((err) => { res.json(err) })
  })
  .patch('/room/',authenticate,(req,res,next) => {
    const patchedRoom = req.body
    Room.findByIdAndUpdate((patchedRoom._id),{ $set:patchedRoom },{new:true})
      .then((updatedRoom) => {
        io.emit('action',{type:'UPDATED_ROOM',payload:updatedRoom})
        res.json(updatedRoom)
      })
      .catch((err) => { res.json(err)})
  })
  .patch('/room/:roomId/line',authenticate,(req,res,next) => {
    const roomId = req.params.roomId
    const line = req.body
    Room.findById(roomId)
      .then((foundRoom) => {
        let patchedRoom = foundRoom.toObject()
        let messages = patchedRoom.messages
        patchedRoom.messages = [ ...messages,line ]
        Room.findByIdAndUpdate((patchedRoom._id),{ $set:patchedRoom },{new:true})
        .then((updatedRoom) => {
          io.emit(updatedRoom._id.toString(),{type:'UPDATED_ROOM',payload:updatedRoom})
          res.json(updatedRoom)
        })

      })
      .catch((err) => { res.json(err)})
  })
  return router
}
