import { Response } from 'express'
import MongoDbError from '../errors/mongoDbError'
import NotFoundError from '../errors/notFoundError'
import { ResponseStatusCodes } from './model'

const FailureStatus = 'Failure'

const internalServerError = (err: any, res: Response) => {
  console.error(`internalServerError ${err.stack}`)
  return res.status(ResponseStatusCodes.internalServerError).json({
    status: FailureStatus,
    message: 'Something bad happened on the server',
    data: null
  })
}

const notFoundResponse = (err: NotFoundError, res: Response) => {
  console.error(`notFoundResponse ${err.stack}`)
  return res.status(ResponseStatusCodes.notFound).json({
    status: FailureStatus,
    message: err.message,
    data: null
  })
}

export const mongoError = (err: MongoDbError, res: Response) => {
  console.error(`mongoError ${err.stack}`)
  return res.status(ResponseStatusCodes.internalServerError).json({
    status: FailureStatus,
    message: 'MongoDB error',
    data: null
  })
}

export const successResponse = (statusCode: number, message: string, data: any, res: Response) => {
  res.status(statusCode).json({
    status: 'Success',
    message: message,
    data: data
  })
}

export const errorResponse = (err: any, res: Response) => {
  if (err instanceof NotFoundError) {
    return notFoundResponse(err, res)
  } else if (err instanceof MongoDbError || err.name === 'MongoServerError') {
    // Catch Uniqueness Errors
    if (err.code === 11000 && err.message) {
      try {
        const fieldName = err.message.split('index: ')[1].split('_')[0]
        const tableName = err.message.split('error collection: ')[1].split('.')[1].split(' ')[0]
        const error:any = {}
        error[fieldName] = `duplicate ${fieldName}`
        return badRequestResponse(`${tableName} validation failed`, error, res)
      } catch (err) {
        return internalServerError(err, res)
      }
    }
    return mongoError(err, res)
  } else if (err.name === 'ValidationError' && err.errors) {
    // Handle Mongo db Validation Errors
    const errors:any = {}
    if (err._message && err.errors) {
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message
      })
    }
    return badRequestResponse(err._message, errors, res)
  } else if (err instanceof SyntaxError) {
    // Invalid JSON in request payload
    return badRequestResponse(err.message, {}, res)
  } else {
    return internalServerError(err, res)
  }
}

export const badRequestResponse = (message:String, errors: any, res: Response) => {
  return res.status(ResponseStatusCodes.badRequest).json({
    status: FailureStatus,
    message: message,
    errors: errors,
    data: null
  })
}
