const router = require('express').Router()
const passport = require('../config/auth')
const { Article } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')
const replaceAuthor = require('../lib/replaceAuthor')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/articles', (req, res, next) => {
      Article.find()
        // Newest articles first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((articles) => {
          replaceAuthor(articles)
            .then((newArticles) => res.json(newArticles))
        })
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/articles/:id', (req, res, next) => {
      const id = req.params.id

      Article.findById(id)
        .then((foundArticle) => {
          if (!foundArticle) { return next() }
          res.json(foundArticle)
        })
        .catch((error) => next(error))
    })
    .post('/articles', authenticate, (req, res, next) => {
      console.log(req)
      // debugger
      const newArticle = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        messages: [],
        category: req.body.category
      }

      Article.create(newArticle)
        .then((createdArticle) => {
          io.emit('action', {
            type: 'ARTICLE_CREATED',
            payload: createdArticle
          })
          res.json(createdArticle)
        })
        .catch((error) => next(error))
    })
    .patch('/articles/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()

      Article.findById(id)
        .then((article) => {
          if (!article) { return next() }

          const updatedArticle = processMove(article, req.body, userId)

          Article.findByIdAndUpdate(id, { $set: updatedArticle }, { new: true })
            .then((newUpdatedArticle) => {
              io.emit('action', {
                type: 'ARTICLE_UPDATED',
                payload: newUpdatedArticle
              })
              res.json(newUpdatedArticle)
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
