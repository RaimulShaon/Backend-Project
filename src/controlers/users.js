import { asyncHandler } from "../utils/asyncHandeler.js";

//regiter korar jonno method

const userRegister = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
});


export {userRegister}