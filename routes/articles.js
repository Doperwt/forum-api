const router = require('express').Router()
const passport = require('../config/auth')
const { Article,Reply } = require('../models')
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
      const newArticle = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        messages: [],
        category: req.body.category
      }

      Article.create(newArticle)
        .then((createdArticle) => {
          replaceAuthor([createdArticle])
            .then((changedArticle) => {
              io.emit('action', {
                type: 'ARTICLE_CREATED',
                payload: changedArticle[0]
              })
              res.json(changedArticle[0])
            })
        })
        .catch((error) => next(error))
    })
    .patch('/articles/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()
      const update = req.body
      Article.findById(id)
        .then((article) => {
          if (!article) { return next() }
          if(article.author==userId){
          let updatedArticle = article
          updatedArticle.content = update.content
          updatedArticle.title = update.title
          updatedArticle.updatedAt = Date.now()
          Article.findByIdAndUpdate(id, { $set: updatedArticle }, { new: true })
            .then((newUpdatedArticle) => {
              replaceAuthor([newUpdatedArticle])
                .then((changedArticle) => {
                  io.emit('action', {
                    type: 'ARTICLE_UPDATED',
                    payload: changedArticle[0]
                  })
                  res.json(changedArticle[0])
                })
            })
            .catch((error) => next(error))
          } else {
            return next()
          }
        })
        .catch((error) => next(error))
    })
    .delete('/articles/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()
      Article.findById(id)
        .then((foundArticle) => {
          if(foundArticle.author===userId){
            Reply.find({articleId:id})
              .then((replies) => {
                replies.map((reply) => {
                  Reply.findByIdAndRemove(reply._id)
                  .catch((error) => next(error))
                })
              })
              .then(() => {
                Article.findByIdAndRemove(id)
                .then(() => {
                  io.emit('action', {
                    type: 'ARTICLE_DELETED',
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
            .catch((error) => next(error))
          }
        })
    })

  return router
}
