export default class ValidationError extends Error {
  public errors:any = {};
  public _message: string;
  constructor (message: string, key: string, value: string) {
    super(message)
    this.name = 'ValidationError'
    this._message = message
    this.errors[key] = {
      message: value
    }
  }
}
