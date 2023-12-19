import { StatusCodes } from 'http-status-codes';

/**
 * CustomError class.
 * @extends Error
 */
export default class CustomError extends Error {
  code: StatusCodes;

  /**
   * Creates a new instance of CustomError.
   * @param {string} message - The error message.
   * @param {StatusCodes} code - The status code associated with the error.
   */
  constructor(message: string, code: StatusCodes) {
    super(message);
    this.code = code;
  }
}

/**
 * Error indicating that one or more required parameters are missing.
 * @class
 * @extends CustomError
 */
const MissingParamsError = new CustomError(
  'Відсутній один або декілька обов’язкових параметрів',
  StatusCodes.BAD_REQUEST
);

/**
 * Error indicating that the user was not found.
 * @class
 * @extends CustomError
 */
const UserNotFoundError = new CustomError('Користувача не знайдено', StatusCodes.NOT_FOUND);

/**
 * Error indicating that the session was not found.
 * @class
 * @extends CustomError
 */
const SessionNotFoundError = new CustomError('Сесія не знайдена', StatusCodes.NOT_FOUND);

/**
 * Error indicating that the user does not have sufficient permissions.
 * @class
 * @extends CustomError
 */
const MissingPermissionError = new CustomError('Недостатньо прав', StatusCodes.FORBIDDEN);

/**
 * Error indicating that the IP is forbidden.
 * @class
 * @extends CustomError
 */
const ForbriddenIpError = new CustomError('Заборонено', StatusCodes.FORBIDDEN);

/**
 * Error indicating that the user is not authorized to access the resource.
 * @class
 * @extends CustomError
 */
const UnauthorizedError = new CustomError('Не авторизовано', StatusCodes.UNAUTHORIZED);

/**
 * Error indicating a reCAPTCHA error.
 * @class
 * @extends CustomError
 */
const ReCatpchaError = new CustomError('Помилка рекаптчи', StatusCodes.TOO_MANY_REQUESTS);

/**
 * Error indicating that an email already exists.
 * @class
 * @extends CustomError
 */
const EmailExistsError = new CustomError('Користувач з такою поштою вже існує', StatusCodes.CONFLICT);

/**
 * Error indicating a server error.
 * @class
 * @extends CustomError
 */
const ServerError = new CustomError('Помилка сервера', StatusCodes.INTERNAL_SERVER_ERROR);

export {
  EmailExistsError,
  ForbriddenIpError,
  MissingParamsError,
  MissingPermissionError,
  ReCatpchaError,
  ServerError,
  SessionNotFoundError,
  UnauthorizedError,
  UserNotFoundError,
};
