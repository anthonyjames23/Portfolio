const mongoose = require('mongoose')
const { profileConnection } = require('../../utils/connection')

const profileSchema = new mongoose.Schema({
  // accountId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // },
  firstName: {
    type: String,
    minlength: 2,
    required: true
  },
  lastName: {
    type: String,
    minlength: 2,
    required: true
  },
  suffix: {
    type: String,
    minlength: 2
  },
  middleName: {
    type: String,
    minlength: 2,
    required: true
  },
  gender: {
    type: String,
    minlength: 2,
    required: true
  },
  birthDate: {
    type: String,
    minlength: 2,
    required: true
  },
  contactNumber: {
    type: String,
    minlength: 2,
    required: true
  },
  email: {
    type: String,
    minlength: 2
  },
  status: {
    type: String,
    minlength: 1,
    required: true
  },
  province: {
    type: String,
    minlength: 2,
    required: true
  },
  city: {
    type: String,
    minlength: 2,
    required: true
  },
  barangay: {
    type: String,
    minlength: 2,
    required: true
  },
  street: {
    type: String,
    minlength: 2,
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

})

profileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Profile = profileConnection.model('Profile', profileSchema)

module.exports = Profile