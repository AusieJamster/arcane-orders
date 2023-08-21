export class GenericError extends Error {
  constructor(readonly statusCode: number, readonly message: string) {
    super(message);
  }
}
