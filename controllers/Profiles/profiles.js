const profileRouter = require('express').Router()
const Profile = require('../../models/Profiles/profile')
const jwt = require('jsonwebtoken')
const User = require('../../models/Users/user')


const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

  // Get all profiles
  // profileRouter.get('/', async (request, response) => {
  //   try {
  //     const persons = await Profile
  //       .find({})
  //       // .populate('accountId',{username: 1})
  //       .populate('profile', '', User) 
  //     response.json(persons)
  //   } catch (error) {
  //     return response.status(401).json({
  //       error: 'Failed to retrieve profiles'
  //     })
  //   }
  // })

  
  profileRouter.get('', async (request, response) => {
  const profileRouter = await Profile
  .find({})
  .populate('accountId', 'name', User) 
  response.json(profileRouter)
})


  //Gets specific profile
  profileRouter.get('/:id', async (request, response) => {
    try {
        const persons = await Profile
          .find({})
          .populate('Individual',{
              firstName: 1,
              lastName: 1,
              middleName: 1,
              suffix: 1,
              gender: 1,
              birthDate: 1,
              contactNumber: 1,
              email: 1,
              status: 1,
              province: 1,
              city: 1,
              barangay: 1,
              street: 1,
          })
        response.json(persons)
      } catch (error) {
        return response.status(401).json({
          error: 'Failed to retrieve profile'
        })
      }
  })

  // Profile Sign-up
  profileRouter.post('/sign-up', async (request, response) => {
    const body = request.body
    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken) {
      return response.status(401).json({
        error: 'Token missing or invalid.'
      })
    }

    const user = await User.findById(decodedToken.id)
  
    const person = new Profile({
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName,
      suffix: body.suffix,
      gender: body.gender,
      birthDate: body.birthDate,
      contactNumber: body.contactNumber,
      email: body.email,
      status: body.status,
      province: body.province,
      city: body.city,
      barangay: body.barangay,
      street: body.street,
      accountId: user._id
    })
  
    try {
      const savedPerson = await person.save()
       response.status(201).json(savedPerson)
    } catch (error) {
        return response.status(401).json({
         error: 'Failed to complete profile.'
      })
    }
  })

  // Update profile
  profileRouter.put('/:id/update-profile', async (request, response) => {
    const body = request.body
  
    const person = {
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName,
        suffix: body.suffix,
        gender: body.gender,
        birthDate: body.birthDate,
        contactNumber: body.contactNumber,
        email: body.email,
        status: body.status,
        province: body.province,
        city: body.city,
        barangay: body.barangay,
        street: body.street,
    }
  
    const updatedProfile = await Profile.findByIdAndUpdate(request.params.id, person, { new: true })
    response.status(201).json(updatedProfile)
  })

  module.exports = profileRouter