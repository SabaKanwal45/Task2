
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
describe('student update', () => {
  /**
   * Tests that a valid student can be updated 
   * through the studentController without 
   * throwing any errors.
  */
  it('can be updated with all given params', async () => {
    const mockRequest: any = {
      body: { ...studentToUpdate, name: { ...studentToUpdate.name } },
      params: {
        studentID: student._id.toString()
      }
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Success',
        message: StudentConstant.UPDATE_SUCCESS_MSG,
        data: expect.objectContaining(
          {
            registerationNumber: studentToUpdate.registerationNumber,
            name: expect.objectContaining({
              firstName: studentToUpdate.name.firstName,
              middleName: studentToUpdate.name.middleName,
              lastName: studentToUpdate.name.lastName
            }),
            email: studentToUpdate.email,
            phoneNumber: studentToUpdate.phoneNumber,
            gender: studentToUpdate.gender,
            modificationNotes: expect.arrayContaining([
              expect.objectContaining(
                {
                  modificationNote: StudentConstant.UPDATE_MODI_NOTE
                }
              )])
          }
        )
      })
    );
  });

  /**
   * Tests that only given fields will be updated 
   * all others will remain same
  */
  it('update only given fields', async () => {
    const fields = ['registerationNumber', 'phoneNumber', 'gender']
    const values = [12, '923450856947', 'Other']
    let data: any = {}
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      const mockRequest: any = {
        body: {},
        params: {
          studentID: student._id.toString()
        }
      };
      mockRequest.body[field] = values[index];
      data[field] = values[index];
      const mockResponse = MockResponse();
      await studentController.updateStudentById(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toBeCalledWith(
        expect.objectContaining({
          status: 'Success',
          message: StudentConstant.UPDATE_SUCCESS_MSG,
          data: expect.objectContaining(
            {
              registerationNumber: data.registerationNumber ? data.registerationNumber : student.registerationNumber,
              name: expect.objectContaining({
                firstName: student.name.firstName,
                middleName: student.name.middleName,
                lastName: student.name.lastName
              }),
              email: data.email ? data.email : student.email,
              phoneNumber: data.phoneNumber ? data.phoneNumber : student.phoneNumber,
              gender: data.gender ? data.gender : student.gender,
              modificationNotes: expect.arrayContaining([
                expect.objectContaining(
                  {
                    modificationNote: StudentConstant.UPDATE_MODI_NOTE
                  }
                )])
            }
          )
        })
      );
    }
  });
  it('cannot be updated with invalid email', async () => {
    const mockRequest: any = {
      body: { email: "saba" },
      params: {
        studentID: student._id.toString()
      }
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["email"] = expect.stringContaining('Enter a valid email');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });
  it('cannot be updated with invalid phoneNumber', async () => {
    const mockRequest: any = {
      body: { phoneNumber: "03470856947" },
      params: {
        studentID: student._id.toString()
      }
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["phoneNumber"] = expect.stringContaining('Enter phoneNumber in format 92XXXXXXXXXX');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });
  it('cannot be updated with invalid gender', async () => {
    const mockRequest: any = {
      body: { gender: "test" },
      params: {
        studentID: student._id.toString()
      }
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["gender"] = expect.stringContaining('[Male, Female, Other] are only supported values');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });
  it('cannot be updated with invalid id', async () => {
    const mockRequest: any = {
      body: { gender: "Male" },
      params: {
        studentID: "abc13235264"
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
  it('cannot be updated with missing id', async () => {
    const mockRequest: any = {
      body: { gender: "Male" },
      params: {}
    };
    const mockResponse = MockResponse();
    await studentController.updateStudentById(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: 'studentID param is missing',
        data: null
      })
    );
  });
});

export const createStudent = async (registerationNumber: number) => {
  return new Promise(async (resolve) => {
    const StudentParams: IStudent = {
      registerationNumber: registerationNumber,
      name: {
        firstName: studentToCreate.name.firstName,
        middleName: studentToCreate.name.middleName,
        lastName: studentToCreate.name.lastName
      },
      email: studentToCreate.email,
      phoneNumber: studentToCreate.phoneNumber,
      gender: studentToCreate.gender,
      modificationNotes: [{
        modifiedOn: new Date(Date.now()),
        modificationNote: StudentConstant.CREATE_MODI_NOTE
      }]
    }
    const student = await studentService.createStudent(StudentParams)
    resolve(student);
  })
}

const studentToUpdate = {
  registerationNumber: 2,
  email: "saba@shopistan.pk",
  name: {
    "firstName": "Samra",
    "middleName": "Ghulam",
    "lastName": "Rasool"
  },
  phoneNumber: "923470856946",
  gender: "Female"
}

const studentToCreate = {
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