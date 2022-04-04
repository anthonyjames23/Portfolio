const mongoose = require('mongoose')
const { userConnection } = require('../../utils/connection')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 8,
    required: true,
    unique: true
},
  name: String,
  passwordHash: String,
  profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = userConnection.model('User', userSchema)

module.exports = User