const router = require('express').Router()
const passport = require('../config/auth')
const { Article } = require('../models')

module.exports = io => {
  router
    .get('/categories', (req, res, next) => {
      Article.find()
        .then((articles) => {
          let allCategories = articles.map(article => article.category)
          let categories = allCategories.filter((el, i, category) => i === category.indexOf(el))
          res.json(categories)
        })
    })
  return router
}
