const asyncHandalr = (fn) => async(req, res, next )=>{
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code||500).json({
            sucsess : false,
            massage :  err.massage
        })
    }
 }

 export {asyncHandalr}