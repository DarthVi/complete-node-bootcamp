class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //When a new object is created and the constructor is called
    //then that function call is not gonna appear in the stack trace
    //and it will not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
