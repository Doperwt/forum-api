const { User,Profile } = require('../models')

const user1 = {email:'test01@test.com',password:'test01'}
const profile = { bio:'nothing',fullName:'robert o',picture:'n/a'}

const makeProfile = (userId) => {
  profile.userId = userId
  Profile.create(profile)
    .then((createdProfile) => {
      console.log(createdProfile, "PROFILE CREATED")
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
        makeProfile(user._id)
      })
    }
  })
