class ApiError extends Error {
    constructor(
        statusCode,
        massage = "something went wrong",
        errors  = [],
        statck = ""
    ) {
        super(massage)
        this.message= massage,
        this.statusCode= statusCode,
        this.data= null,
        this.errors= errors
        
        if (statck) {
            this.stack = statck
        } else {
            Error.captureStackTrace(this.ApiError)
        }
    }
}


export {ApiError}