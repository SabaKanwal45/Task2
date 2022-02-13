import { Application, Request, Response } from 'express'
import { StudentController } from '../controllers/studentController'

export class StudentRoutes {
  private studentController: StudentController = new StudentController();

  public route (app: Application) {
    /* Route to get all Students Data */
    app.get('/una/students', (req: Request, res: Response) => {
      this.studentController.getAllStudents(req, res)
    })

    /* Route to create Student */
    app.post('/una/student', (req: Request, res: Response) => {
      this.studentController.createStudent(req, res)
    })

    /* Route to get Student by StudentID */
    app.get('/una/students/:studentID', (req: Request, res: Response) => {
      this.studentController.getStudentById(req, res)
    })

    /* Route to update Student by StudentID */
    app.put('/una/students/:studentID', (req: Request, res: Response) => {
      this.studentController.updateStudentById(req, res)
    })

    /* Route to delete Student by StudentID */
    app.delete('/una/students/:studentID', (req: Request, res: Response) => {
      this.studentController.deleteStudentById(req, res)
    })
  }
}
