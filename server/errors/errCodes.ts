export enum errCodes {
  smtRequired = 100,
  smtInvalid = 101,
  smtIsOutOfRange = 102,
  smtIsNotEqual = 103,
  smtExist = 104
}

export enum technicalErrCodes {
  saltIsNotGenerated = 500,
  canNotBcryptString = 501,
  smtIsNotFoundedInDb = 503,
  smtIsNotUpsertedInDb = 504,
}
