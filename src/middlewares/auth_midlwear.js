import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import JWT from "jsonwebtoken";
import { User } from "../models/User.models.js";

 const verifyJWT = asyncHandler(async(req, _, next )=>{
   try { // acctoken cokie ba header er madhome acctnk paoa jabe ta amara replace er madhome bearer token k emty kore dibo mane del kore debo.
    const token = req.cookies?.accessToken||req.header("Autorization")?.replace("Bearer ", "")
     if (!token) {
         throw new ApiError(401, "Unauthorization reqest");
             }
     const decodedToken =JWT.verify(token, process.env.ACCESS_TOKEN)     //ai token r bcrpt kora token eksathe melate hobe. 
            const user = await User.findById(decodedToken?._id).select(
                 "-password", "-refreshToken"
             )
             if (!user) {
                 throw new ApiError(401, "Invalid access ")}
                 
            req.user = user;   //user er moddhe update kore dea hoice
            next()

   } 
   catch (error) {
        throw new ApiError(401, error?.massage||"Invalid access ")}
   


        })

        export {verifyJWT}        