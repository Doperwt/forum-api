const { User,Profile,Article,Reply } = require('../models')

const user1 = {email:'test01@test.com',password:'test01'}
const profile = { bio:'nothing',fullName:'robert den ouden',picture:'n/a'}
const articles = [{
  author: '',
  title: 'thing',
  content: 'this is a article about pants',
  category: 'Pants',
  messages: []
},
{
  author: '',
  title: 'Final hting',
  content: 'this is might be a article about pants',
  category: 'Not pants',
  messages: []
},
{
  author: '',
  title: 'Other thing',
  content: 'this is not a article about pants',
  category: 'Not pants',
  messages: []
},
]
const messages1 = [{
    author:'',
    content:'This article is amazing',
    articleId:'',
  },
  {
    author:'',
    content:'Yep',
    articleId:'',
  },
  {
    author:'',
    content:'Nope',
    articleId:'',
  }
  ]

const makeMessages = (userId,articleId) => {
  messages1.map((message) => {
    message.author = userId
    message.articleId = articleId
    Reply.create(message)
      .then((createdMessage) => {
        console.log(createdMessage._id,"MESSAGE CREATED")
      })
  })
}
const makeProfile = (userId) => {
  profile.userId = userId
  Profile.create(profile)
    .then((createdProfile) => {
      console.log(createdProfile.fullName, "PROFILE CREATED")
    })
}

const makeArticles = (userId) => {
  let count = 0
  articles.map((article) => {
    article.author = userId
    Article.create(article)
    .then((createdArticle) => {
      console.log(createdArticle.title,"ARTICLE CREATED")
      if(count===0){
        makeMessages(userId,createdArticle._id)
        count += 1
      }
    })
    .catch((err) => console.log(err ))
  })
}

User.findOne({email:user1.email})
  .then((user) => {
    if(!!user){
      console.log('user exist')
      process.exit(0)
    } else {
      User.register(new User({ email: user1.email}), user1.password, (err, user) => {
        if (err) {
          console.log(err)
        }
        console.log('user created:',user1.email)
        makeProfile(user._id)
        makeArticles(user._id)

      })
    }
  })
