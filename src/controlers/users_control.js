import { asyncHandler } from "../utils/asyncHandeler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { JWT } from "jsonwebtoken";

//genarate access token & refresh token

const generateAccessNRefreshToken= async (userId)=>{
  try {
    const userid= User.findById(userId)
    const accessToken= User.genarateAccessToken()
    const refreshToken= User.genarateRefrshToken()

    userid.refreshToken = refreshToken
    await userid.save()
    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "server side prblm");
    
  }
}



//regiter korar jonno method

const userRegister = asyncHandler(async (req, res) => {
   const {username, email, fullname, password}=req.body
  
   if (!username || username.trim() === "") {
    throw new ApiError(400, "Username is required");
  }
  
  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required");
  }
  
  if (!fullname || fullname.trim() === "") {
    throw new ApiError(400, "Full name is required");
  }
  
  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password is required");
  }

  // another advanced option
//   if ([username, email, fullname, password].some(field => !field?.trim())) {
//     throw new ApiError(400, "All fields are required");
//   }


    //user exist or not
const existUser= await User.find(
    { $or:[{userName}, {email}] }
)
if (existUser) {
    throw new ApiError(409, "Already exist")
}

//chck img n avatar
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(400,"must be required")
}
if (!coverImageLocalPath) {
    throw new ApiError(400,"must be required")
}


//upload to cloudinary
 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

 if (!avatar) {
  throw new ApiError(400,"must be required")
 }
// create user object in DB

const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage.url,
      email,
      userName,
      password
    })

const cratUser = await User.findById(user._id).select(
  "-password -refreshTOken"
)

if (!cratUser) {
  throw new ApiError(500,"servers problem")
  
}

return res.status(200).json(
  new ApiSuccess(200, cratUser, "User registered successfully")
)


});

const userLoging = asyncHandler(async(req, res)=>{
  const {email, userName, password}= req.body

  if (!(userName || email)) {
    throw new ApiError(400, "username or email is required");
  }

  //user exist or not
    const userExt = await User.findOne(
    { $or:[{userName}, {email}] }
  )
  if (!userExt) {
    throw new ApiError(404, "user does't exist"); //check users
    }
  const ispasswordvalid = await userExt.isPasswordCorrect(password)

  if (!ispasswordvalid) {
    throw new ApiError(401, "password does't exist"); //check users
    }

  const {accessToken, refreshToken} = await generateAccessNRefreshToken(userid._id)
  
  const  login = await User.findById(userid._id).select(
    "-password -refreshToken"
  )
  // cokies secure
  const option = {
    httpOnly: true,
    secure: true
  }
return res.status.cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(new ApiSuccess(200,{user: accessToken, refreshToken, login}, "user loging successfully"))  

});

// create logout handeler 
const loguot = asyncHandler(async(req, res)=>{
  User.findByIdAndUpdate(
    req.user._id,{
        $set: {
          refreshToken: undefined
        }
    }
  )

  //cookie secure & check
  const option = {
    httpOnly: true,
    secure: true
  }
  return res.status.clearCookie("accessToken", option).clearCookie("refreshToken", option).json(new ApiSuccess(200,{}, "User logout successfully"))  
});


const refreshAceessToken = asyncHandler(async(req, res)=>{
const incomingrefreshToken=  req.cookie.refreshToken || req.body.refreshToken  
if (!incomingrefreshToken) {
  throw new ApiError(401, "unuthorized access")
}

const decodedRefToken =await JWT.verify(refreshAceessToken, process.env.REFRESH_TOKEN)
const user =await User.findById(decodedRefToken?._id)

if (!decodedRefToken) {
  throw new ApiError(401, " Invalide token")
  }
if (incomingrefreshToken !== user?.refreshToken) {
  throw new ApiError(401, " Invalide refresh token")
  }
const option = {
  httpOnly: true,
  secure: true
}

const {accessToken, NewRefreshToken}=await generateAccessNRefreshToken(user._id)
 return res
 .status(200)
 .cookie("accessToken", accessToken, option)
 .cookie("refreshToken", NewRefreshToken, option)
 .json(new ApiSuccess(200, {accessToken, refresh: NewRefreshToken}, "Aceess Token Successfully"))

})




export {userRegister,
        userLoging,
        loguot,
        refreshAceessToken
      }