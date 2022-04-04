const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../../models/Users/user')
const Profile = require('../../models/Profiles/profile')

// const getTokenFrom = request => {
//   const authorization = request.get('Authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

//All Users
// usersRouter.get('/', async (request, response) => {
//   try {
//     const profiles = await User
//       .find({})
//       // .populate('profile', '', Profile) 
//        response.json(profiles)
//   } catch (error) {
//     return response.status(401).json({
//       error: 'Failed to retrieve profiles'
//     })
//   }
// })

usersRouter.get('', async (request, response) => {
  const usersRouter = await User
  .find({})
  .populate('profile', 'firstName', Profile) 
  response.json(usersRouter)
})



  // Users sign-up
usersRouter.post('/sign-up', async (request, response) => {
  const { username, password } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    return response.status(401).json({
      error: 'Failed to create user.'
    })
  }
})

// Users Log-in
usersRouter.post('/log-in', async (request, response) => {
  const body = request.body

  const user = await User.findOne({username: body.username})
  const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!user) {
    return response.status(401).json({error: 'invalid username'})
  }

  if (!passwordCorrect) {
    return response.status(401).json({error: 'invalid password'})
  }

  const userForToken = {
      username: user.username,
      id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({
      token,
      username: user.username,
      id: user._id
  })
})

// Update username
usersRouter.put('/:id/change-username', async (request, response) => {
  const { username } = request.body

  if (username.length < 8) {
    return response.status(400).json({
      error: 'Username must be atleast 8 characters.'
    })
  }

  const updateUser = {
    username: username
  }


  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  try {
    await User.findByIdAndUpdate(request.params.id, updateUser, { new: true })
    response.status(201).json({
      message: 'Username updated'
    })
  } catch (error) {
    return response.status(401).json({
      error: 'Failed to update username.'
    })
  }
})

// Update password
usersRouter.put('/:id/change-password', async (request, response) => {
  const { username, oldPassword, newPassword } = request.body

  const user = await User.findOne({username: username})
  const oldPasswordCorrect = user === null
      ? false
      : await bcrypt.compare(oldPassword, user.passwordHash)

  if (!oldPasswordCorrect) {
    return response.status(401).json({error: 'invalid old password'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newPassword, saltRounds)

  const updateUser = {
    username: username,
    passwordHash: passwordHash
  }
  try {
    await User.findByIdAndUpdate(request.params.id, updateUser, { new: true })
     response.status(201).json({
     message: 'Password updated'
  })
  } catch (error) {
    return response.status(401).json({
      error: 'Failed to update user password.'
    })
  }
})

module.exports = usersRouter