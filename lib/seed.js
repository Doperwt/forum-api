const { User } = require('../models')

const login = {email:'test01@test.com',password:'test01',name:'henk'}

User.findOne({email:login.email})
  .then((user) => {
    if(!!user){
      console.log('user exist')
      process.exit(0)
    } else {
      User.create(login)
      .then((newUser) => {
        console.log('user created:',login.name)
        process.exit(0)
      })
    }
  })
