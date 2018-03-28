const { User } = require('../models')

const login = {email:'test01@test.com',password:'test01'}

User.findOne({email:login.email})
  .then((user) => {
    if(!!user){
      console.log('user exist')
      process.exit(0)
    } else {
      User.register(new User({ email: login.email}), login.password, (err, user) => {
        if (err) {
          console.log(err)
        }
        console.log('user created:',login.email)
        process.exit(0)
      })
    }
  })
