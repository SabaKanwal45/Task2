
import { connect, closeDatabase, clearDatabase } from "../inMemoryDbSetup"
import MockResponse from "../mockResponse"
import { StudentController } from '../../controllers/studentController'
import StudentConstant from '../../constants/students'

let studentController: StudentController = new StudentController()

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

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await closeDatabase();
});

/**
 * Student create test suite.
 */
describe('student create', () => {
  /**
   * Tests that a valid student can be created 
   * through the studentController without 
   * throwing any errors.
  */
  it('can be created with all given params', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toBeCalledWith(
      getCreateStudentSuccessResponse(mockRequest)
    );
  });

  /**
   * Tests that a student can be created without a 
   * email.
  */
  it('can be created without email', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 2;
    delete mockRequest.body.email;
    expect(mockRequest.body.email).toBe(undefined);
    expect(mockRequest.body.registerationNumber).toBe(2);
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toBeCalledWith(
      getCreateStudentSuccessResponse(mockRequest)
    );
  });

  /**
   * Tests that a student can be created without a 
   * middleName.
  */
  it('can be created without middleName', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 3;
    delete mockRequest.body.name.middleName;
    expect(mockRequest.body.name.middleName).toBe(undefined);
    expect(mockRequest.body.registerationNumber).toBe(3);
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    // default value is empty
    mockRequest.body.name.middleName = "";
    expect(mockResponse.json).toBeCalledWith(
      getCreateStudentSuccessResponse(mockRequest)
    );
  });

  /**
   * Tests that a student cannot be created without a 
   * required field.
  */
  it('cannot be created without required fields', async () => {
    const fields = ['registerationNumber', 'name', 'name.firstName', 'name.lastName', 'phoneNumber', 'gender']
    for (let index = 0; index < fields.length; index++) {
      const field = fields[index];
      const mockRequest: any = {
        body: { ...studentToCreate, name: { ...studentToCreate.name } }
      };
      mockRequest.body.registerationNumber = 4;
      mockRequest.body = deletePropertyByName(mockRequest.body, field)
      const mockResponse = MockResponse();
      await studentController.createStudent(mockRequest, mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      let errorObj: any = {};
      errorObj[field] = expect.stringContaining(field + " is required");
      expect(mockResponse.json).toBeCalledWith(
        expect.objectContaining({
          status: 'Failure',
          message: StudentConstant.VALIDATION_FAILED,
          errors: expect.objectContaining(errorObj),
          data: null
        })
      );
    }
  });

  /**
   * Tests that a student cannot be created 
   * with invalid email 
  */
  it('cannot be created with invalid email', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 5;
    mockRequest.body.email = "saba";
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["email"] = expect.stringContaining('Enter a valid email');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: StudentConstant.VALIDATION_FAILED,
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });

  /**
   * Tests that a student cannot be created 
   * with invalid phoneNumber
  */
  it('cannot be created with invalid phoneNumber', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 5;
    mockRequest.body.phoneNumber = "03470856947";
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["phoneNumber"] = expect.stringContaining('Enter phoneNumber in format 92XXXXXXXXXX');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: StudentConstant.VALIDATION_FAILED,
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });

  /**
 * Tests that a student cannot be created 
 * with invalid name
*/
  it('cannot be created with invalid name', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 5;
    mockRequest.body.name = "test name";
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["name.firstName"] = expect.stringContaining('name.firstName is required');
    errorObj["name.lastName"] = expect.stringContaining('name.lastName is required');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: StudentConstant.VALIDATION_FAILED,
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });

  /**
* Tests that a student cannot be created 
* with invalid gender
*/
  it('cannot be created with invalid gender', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 5;
    mockRequest.body.gender = "test";
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["gender"] = expect.stringContaining('[Male, Female, Other] are only supported values');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: StudentConstant.VALIDATION_FAILED,
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });

  /**
* Tests that a student cannot be created 
* with duplicate registerationNumber
*/
  it('cannot be created with duplicate registerationNumber', async () => {
    const mockRequest: any = {
      body: { ...studentToCreate, name: { ...studentToCreate.name } }
    };
    mockRequest.body.registerationNumber = 1;
    const mockResponse = MockResponse();
    await studentController.createStudent(mockRequest, mockResponse)
    await studentController.createStudent(mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    let errorObj: any = {};
    errorObj["registerationNumber"] = expect.stringContaining('duplicate registerationNumber');
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Failure',
        message: StudentConstant.VALIDATION_FAILED,
        errors: expect.objectContaining(errorObj),
        data: null
      })
    );
  });

});

export const studentToCreate = {
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

const getCreateStudentSuccessResponse = (mockRequest: any) => {
  return expect.objectContaining({
    status: 'Success',
    message: 'student created successfully',
    data: expect.objectContaining(
      {
        registerationNumber: mockRequest.body.registerationNumber,
        name: expect.objectContaining({
          firstName: mockRequest.body.name.firstName,
          middleName: mockRequest.body.name.middleName,
          lastName: mockRequest.body.name.lastName
        }),
        email: mockRequest.body.email,
        phoneNumber: mockRequest.body.phoneNumber,
        gender: mockRequest.body.gender,
        modificationNotes: expect.arrayContaining([
          expect.objectContaining(
            {
              modificationNote: StudentConstant.CREATE_MODI_NOTE
            }
          )])
      }
    )
  })
}

/** 
 * Delete specific property from obj
 * work for nested properties seperated by .
 *  
* */
const deletePropertyByName = (obj: any, name: string) => {
  const attr = name.split('.');
  let helperObj = obj;
  for (let index = 0; index < attr.length; index++) {
    if (index === attr.length - 1) {
      delete helperObj[attr[index]];
    } else {
      helperObj = helperObj[attr[index]];
    }
  }
  return obj;
}
