const router = require('express').Router()
const passport = require('../config/auth')
const { Article,Room } = require('../models')

const uniqueCategories = (things,type) => {
  let allCategories = things.map(article => article[type])
  let categories = allCategories.filter((el, i, category) => i === category.indexOf(el))
  return categories
}
module.exports = io => {
  router
    .get('/categories/:route', (req, res, next) => {
      const route = req.params.route
      if(route==='articles'){
        Article.find()
          .then((articles) => {
            let categories = uniqueCategories(articles,'category')
            res.json(categories)
          })
      } else if(route==='rooms'){
        Room.find()
          .then((rooms) => {
            console.log(rooms)
            res.json(rooms)
          })
      }
    })
  return router
}
