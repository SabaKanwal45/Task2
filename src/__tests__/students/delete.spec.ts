
import { connect, closeDatabase, clearDatabase } from "../inMemoryDbSetup"
import { StudentController } from '../../controllers/studentController'
import { IStudent } from '../../modules/students/model'
import StudentService from '../../modules/students/service'
import StudentConstant from '../../constants/students'
import MockResponse from "../mockResponse"

let studentController: StudentController = new StudentController()
let studentService: StudentService = new StudentService()

let student: any = {};
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});


/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  student = await createStudent(10);
})

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await closeDatabase();
});

/**
 * Student create test suite.
 */
describe('student delete', () => {
  /**
   * Tests that a valid student can be deleted 
   * through the studentController without 
   * throwing any errors.
  */
  it('can be deleted by id', async () => {
    const mockRequest: any = {
      params: {
        studentID: student._id.toString()
      }
    };
    const mockResponse = MockResponse();
    await studentController.deleteStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Success',
        message: 'student deleted successfully',
      })
    );
  });
  it('cannot be deleted with missing id', async () => {
    const mockRequest: any = {
      params: {}
    };
    const mockResponse = MockResponse();
    await studentController.deleteStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: 'studentID param is missing',
        data: null
      })
    );
  });
  it('cannot be deleted with invalid id', async () => {
    const mockRequest: any = {
      params: {
        studentID: "abc13235264345678904567"
      }
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["studentID"] = expect.stringContaining('invalid');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });
});

export const createStudent = async (registerationNumber: number) => {
  return new Promise(async (resolve) => {
    const StudentParams: IStudent = {
      registerationNumber: registerationNumber ,
      name: {
        firstName: student1.name.firstName,
        middleName: student1.name.middleName,
        lastName: student1.name.lastName
      },
      email: student1.email,
      phoneNumber: student1.phoneNumber,
      gender: student1.gender,
      modificationNotes: [{
        modifiedOn: new Date(Date.now()),
        modificationNote: StudentConstant.CREATE_MODI_NOTE
      }]
    }
    const student = await studentService.createStudent(StudentParams)
    resolve(student);
  })
}

const student1 = {
  registerationNumber: 1,
  email: "sabakanwal45@gmail.com",
  name: {
    "firstName": "Saba",
    "middleName": "Rasool",
    "lastName": "Kanwal"
  },
  phoneNumber: "923470856947",
  gender: "Male"
}