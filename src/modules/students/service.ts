import MongoDbError from '../errors/mongoDbError'
import { IStudent } from './model'
import Students from './schema'

export default class StudentService {
  public findStudents = async (query: any) => {
    try {
      return Students.find(query)
    } catch (err: any) {
      throw new MongoDbError(err.message)
    }
  }

  public createStudent = async (studentParams: IStudent) => {
    try {
      const _session = new Students(studentParams)
      return _session.save()
    } catch (err: any) {
      throw err
    }
  }

  public findOneStudent = async (query: any) => {
    try {
      return Students.findOne(query)
    } catch (err: any) {
      throw new MongoDbError(err.message)
    }
  }

  public async updateStudent (studentParams: IStudent) {
    const query = { _id: studentParams._id }
    try {
      return Students.findOneAndUpdate(query, studentParams, { new: true, runValidators: true })
    } catch (err: any) {
      throw new MongoDbError(err.message)
    }
  }

  public deleteStudent = async (_id: String) => {
    const query = { _id: _id }
    try {
      return Students.deleteOne(query)
    } catch (err: any) {
      throw new MongoDbError(err.message)
    }
  }
}
