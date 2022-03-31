const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../../models/Users/user')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


usersRouter.get('/', async (request, response) => {
    // const users = await User.find({})
    const users = await User
    .find({}).populate('transactions',{ content: 1, date: 1 })
    response.json(users)
  })

  // Users sign-up
usersRouter.post('/sign-up', async (request, response) => {
  const { username, name, password } = request.body

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
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
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

  
  const updateUser = {
    username: username
  }


  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  await User.findByIdAndUpdate(request.params.id, updateUser, { new: true })
  response.status(201).json({
    message: 'Username updated'
  })
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

  await User.findByIdAndUpdate(request.params.id, updateUser, { new: true })
  response.status(201).json({
    message: 'Password updated'
  })
})

module.exports = usersRouter