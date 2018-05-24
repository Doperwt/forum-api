const { User,Profile,Article,Reply,Message } = require('../models')

const user1 = {email:'test01@test.com',password:'test01' }
const user2 = {email:'test02@test.com',password:'test02' }
const profiles = [
  { bio:'magic shit',fullName:'Hans Kazan' },
  { bio:'boy stuff', fullName:'Steve Boy' }
 ]
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
const replies1 = [{
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
const messages = [
  {
    content:'Test message'
  }
]
const makeMessages = (user1Id,user2Id) => {
  messages.map((message) => {
    message.author = user1Id
    message.reciever = user2Id
    Message.create(message)
      .then((createdMessage) => {
        console.log(createdMessage._id,"MESSAGE CREATED")
      })
  })
}

const makeReplies = (userId,articleId) => {
  replies1.map((reply) => {
    reply.author = userId
    reply.articleId = articleId
    Reply.create(reply)
      .then((createdReply) => {
        console.log(createdReply._id,"REPLY CREATED")
      })
  })
}
const makeProfile = (userId,profile) => {
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
        makeReplies(userId,createdArticle._id)
        count += 1
      }
    })
    .catch((err) => console.log(err ))
  })
  .then((result) => {
    console.log(result,'job complete')
    process.exit(0)
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
        makeProfile(user._id,profiles[0])
        makeArticles(user._id)
      })
    }
  })
  .then((user1ID) => {
    User.findOne({email:user2.email})
    .then((user) => {
    if(!!user){
      console.log('user exist')
      process.exit(0)
    } else {
      User.register(new User({ email: user2.email}), user2.password, (err, user) => {
        if (err) {
          console.log(err)
        }
        makeProfile(user._id,profiles[1])
        User.find()
          .then((users) => {
            console.log('user created:',user2.email)
            makeMessages(users[0]._id,user._id)
            makeMessages(user._id, users[0]._id)
              .then(() => {
                process.exit(0)
              })
          })
      })
    }
  })
})
