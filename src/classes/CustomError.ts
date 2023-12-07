import { StatusCodes } from 'http-status-codes';

export default class CustomError extends Error {
  code: StatusCodes;

  constructor(message: string, code: StatusCodes) {
    super(message);
    this.code = code;
  }
}

const MissingParamsError = new CustomError(
  'Відсутній один або декілька обов’язкових параметрів',
  StatusCodes.BAD_REQUEST
);

const UserNotFoundError = new CustomError(
  'Користувача не знайдено',
  StatusCodes.NOT_FOUND
);

const SessionNotFoundError = new CustomError(
  'Сесія не знайдена',
  StatusCodes.NOT_FOUND
);

const MissingPermissionError = new CustomError(
  'Недостатньо прав',
  StatusCodes.FORBIDDEN
);

const ForbriddenIpError = new CustomError('Заборонено', StatusCodes.FORBIDDEN);

const UnauthorizedError = new CustomError(
  'Не авторизовано',
  StatusCodes.UNAUTHORIZED
);

const ReCatpchaError = new CustomError(
  'Помилка рекаптчи',
  StatusCodes.TOO_MANY_REQUESTS
);

const EmailExistsError = new CustomError(
  'Користувач з такою поштою вже існує',
  StatusCodes.CONFLICT
);

const ServerError = new CustomError(
  'Помилка сервера',
  StatusCodes.INTERNAL_SERVER_ERROR
);

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
