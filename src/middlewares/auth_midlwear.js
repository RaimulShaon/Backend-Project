import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import JWT from "jsonwebtoken";
import { User } from "../models/User.models.js";

 const verifyJWT = asyncHandler(async(req, res, next )=>{
   try {
    const token = req.cookies?.accessToken||req.header("Autorization")?.replace("Bearer ", "")
     if (!token) {
         throw new ApiError(401, "Unauthorization reqest");
             }
     const decodedToken =JWT.verify(token, process.env.ACCESS_TOKEN)     //ai token r bcrpt kora token eksathe melate hobe. 
            const user = await User.findById(decodedToken?._id).select(
                 "-password, -refreshToken"
             )
             if (!User) {
                 throw new ApiError(401, "Invalid access ")}
                 req.user = user;
                 next()

   } 
   catch (error) {
    if (!User) {
        throw new ApiError(401, "Invalid access ")}
   }


        })

        export {verifyJWT}        