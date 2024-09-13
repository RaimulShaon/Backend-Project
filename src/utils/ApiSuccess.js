class ApiSuccess {
    constructor(statuscode, data, massage) {
        this.massage= massage,
        this.statuscode = statuscode,
        this.data= data,
        this.success = statuscode<400
    }
}

export {ApiSuccess}