export class AuthTokenError extends Error {
  constructor() {
    super("ERR_AUTHENTICATION_TOKEN");
  }
}