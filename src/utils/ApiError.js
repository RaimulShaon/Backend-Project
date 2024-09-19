class ApiError extends Error {
    constructor(
        statusCode,
        massage = "something went wrong",
        errors  = [],
        stack = ""
    ) {
        super(massage)
        this.message= massage,
        this.statusCode= statusCode,
        this.data= null,
        this.errors= errors
        
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this.ApiError)
        }
    }
}


export {ApiError}