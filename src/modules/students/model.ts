import { ModificationNoteInterface } from '../common/model'

export interface IStudent {
    _id?: String;
    registerationNumber: Number,
    name: {
        firstName: String;
        middleName: String;
        lastName: String;
    };
    email: String;
    phoneNumber: String;
    gender: String;
    isDeleted?: Boolean;
    modificationNotes: ModificationNoteInterface[]
}
