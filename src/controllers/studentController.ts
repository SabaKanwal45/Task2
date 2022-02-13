import { Request, Response } from 'express'
import { badRequestResponse, successResponse, errorResponse } from '../modules/common/response'
import { IStudent } from '../modules/students/model'
import StudentService from '../modules/students/service'
import NotFoundError from '../modules/errors/notFoundError'
import ValidationError from '../modules/errors/validationError'
import StudentConstant from '../constants/students'

export class StudentController {
    private studentService: StudentService = new StudentService();

    public getAllStudents = (req: Request, res: Response) => {
      return new Promise((resolve) => {
        try {
          this.studentService.findStudents({}).then(userData => {
            resolve(successResponse(200, StudentConstant.FETCH_SUCCESS_MSG, userData, res))
          }).catch(err => {
            resolve(errorResponse(err, res))
          })
        } catch (err: any) {
          resolve(errorResponse(err, res))
        }
      })
    }

    public createStudent = (req: Request, res: Response) => {
      return new Promise((resolve) => {
        try {
          if (!req.body.name) {
            throw new ValidationError(StudentConstant.VALIDATION_FAILED, 'name', 'name is required')
          }
          const StudentParams: IStudent = {
            registerationNumber: req.body.registerationNumber,
            name: {
              firstName: req.body.name.firstName,
              middleName: req.body.name.middleName,
              lastName: req.body.name.lastName
            },
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            modificationNotes: [{
              modifiedOn: new Date(Date.now()),
              modificationNote: StudentConstant.CREATE_MODI_NOTE
            }]
          }
          this.studentService.createStudent(StudentParams).then(studentData => {
            resolve(successResponse(201, StudentConstant.CREATE_SUCCESS_MSG, studentData, res))
          }).catch(err => {
            resolve(errorResponse(err, res))
          })
        } catch (err: any) {
          resolve(errorResponse(err, res))
        }
      })
    }

    public getStudentById = (req: Request, res: Response) => {
      return new Promise((resolve) => {
        try {
          if (req.params.studentID && !req.params.studentID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ValidationError(StudentConstant.VALIDATION_FAILED, 'studentID', 'invalid id')
          }
          if (req.params.studentID) {
            const UserFilter = { _id: req.params.studentID }
            this.studentService.findOneStudent(UserFilter).then(userData => {
              resolve(successResponse(200, 'student fetched successfully', userData, res))
            }).catch(err => {
              resolve(errorResponse(err, res))
            })
          } else {
            resolve(badRequestResponse(StudentConstant.STUDENT_ID_MISSING_MSG, {}, res))
          }
        } catch (err: any) {
          resolve(errorResponse(err, res))
        }
      })
    }

    public updateStudentById = (req: Request, res: Response) => {
      return new Promise((resolve) => {
        try {
          if (req.params.studentID && !req.params.studentID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ValidationError(StudentConstant.VALIDATION_FAILED, 'studentID', 'invalid id')
          }
          if (req.params.studentID) {
            const StudentFilter = { _id: req.params.studentID }
            this.studentService.findOneStudent(StudentFilter).then(async (studentData: any) => {
              if (!studentData) {
                throw new NotFoundError('invalid student')
              }
              studentData.modificationNotes.push({
                modifiedOn: new Date(Date.now()),
                modificationNote: StudentConstant.UPDATE_MODI_NOTE
              })
              const StudentParams: IStudent = {
                _id: req.params.studentID,
                registerationNumber: req.body.registerationNumber ? req.body.registerationNumber : studentData.registerationNumber,
                name: req.body.name
                  ? {
                      firstName: req.body.name.firstName ? req.body.name.firstName : studentData.name.firstName,
                      middleName: req.body.name.middleName ? req.body.name.middleName : studentData.name.middleName,
                      lastName: req.body.name.lastName ? req.body.name.lastName : studentData.name.lastName
                    }
                  : studentData.name,
                email: req.body.email ? req.body.email : studentData.email,
                phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : studentData.phoneNumber,
                gender: req.body.gender ? req.body.gender : studentData.gender,
                isDeleted: req.body.isDeleted ? req.body.isDeleted : studentData.isDeleted,
                modificationNotes: studentData.modificationNotes
              }
              const updatedStudentData = await this.studentService.updateStudent(StudentParams)
              resolve(successResponse(200, StudentConstant.UPDATE_SUCCESS_MSG, updatedStudentData, res))
            }).catch(err => {
              resolve(errorResponse(err, res))
            })
          } else {
            resolve(badRequestResponse(StudentConstant.STUDENT_ID_MISSING_MSG, {}, res))
          }
        } catch (err: any) {
          resolve(errorResponse(err, res))
        }
      })
    }

    public deleteStudentById = (req: Request, res: Response) => {
      return new Promise((resolve) => {
        try {
          if (req.params.studentID && !req.params.studentID.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ValidationError(StudentConstant.VALIDATION_FAILED, 'studentID', 'invalid id')
          }
          if (req.params.studentID) {
            this.studentService.deleteStudent(req.params.studentID).then(deleteDetails => {
              if (deleteDetails.deletedCount !== 0) {
                resolve(successResponse(204, 'student deleted successfully', null, res))
              } else {
                throw new NotFoundError('invalid student')
              }
            }).catch(err => {
              resolve(errorResponse(err, res))
            })
          } else {
            resolve(badRequestResponse(StudentConstant.STUDENT_ID_MISSING_MSG, {}, res))
          }
        } catch (err: any) {
          resolve(errorResponse(err, res))
        }
      })
    }
}
