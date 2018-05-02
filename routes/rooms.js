const router = require('express').Router()
const { Room,User } = require('../models')

module.exports = io => {
  router
  .get('/rooms',(req, res, next) => {
    Room.find()
      .then((rooms) => {
        const roomNames = rooms.map((room) => {
          return room.name
        })
        res.json(roomNames)
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
      owner:ownerId,
      name: name,
      participants: [ownerId],
      game:game
    }
    Room.create(newRoom)
      .then((createdRoom) => {
        res.json(createdRoom)
      })
      .catch((err) => { res.json(err) })
  })
  .patch('/room/:roomId',authenticate,(req,res,next) => {
    const userId = req.account._id
    const patchedRoom = req.body
    Room.findByIdAndUpdate((updatedRoom._id),{ $set:patchedRoom },{new:true})
      .then((updatedRoom) => {
        res.json(updatedRoom)
      })
      .catch((err) => { res.json(err)})
  })
  return router
}
