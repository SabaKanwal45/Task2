import * as mongoose from 'mongoose'
import { ModificationNote } from '../common/model'
import validator from 'validator'

const Schema = mongoose.Schema

const schema = new Schema({
  registerationNumber: {
    type: Number,
    unique: true,
    required: [
      true,
      'registerationNumber is required'
    ]
  },
  name: {
    type: {
      firstName: {
        type: String,
        required: [
          true,
          'name.firstName is required'
        ]
      },
      middleName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        required: [
          true,
          'name.lastName is required'
        ]
      }
    }
  },
  email: {
    type: String,
    validate: {
      validator: (value:string) => {
        return validator.isEmail(value)
      },
      message: 'Enter a valid email'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber is required'],
    validate: {
      validator: (value:string) => {
        return /92\d{10}/.test(value)
      },
      message: 'Enter phoneNumber in format 92XXXXXXXXXX'
    }
  },
  gender: {
    type: String,
    required: [true, 'gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: '[Male, Female, Other] are only supported values'
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  modificationNotes: [ModificationNote]
})

export default mongoose.model('students', schema)
