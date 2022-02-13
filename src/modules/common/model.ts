export interface ModificationNoteInterface {
  modifiedOn: Date;
  modificationNote: String;
}

export const ModificationNote = {
  modifiedOn: Date,
  modificationNote: String
}

export enum ResponseStatusCodes {
  success = 200,
  badRequest = 400,
  internalServerError = 500,
  notFound = 404
}
