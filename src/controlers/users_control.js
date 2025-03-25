import { asyncHandler } from "../utils/asyncHandeler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import  JWT  from "jsonwebtoken";
import { json } from "express";

//genarate access token & refresh token

const generateAccessNRefreshToken = async (userId)=>{
  try {
    const userid= await User.findById(userId)
    const accessToken= userid.genarateAccessToken() //userid er moddhe access/refrsh token neyar niyom
    const refreshToken= userid.genarateRefrshToken()
//accss to user er kache thake bt refresh token database er moddhe save thake jate kore user er kache bar bar na ask krte hoy pass. DB te save korar niyom. 
    userid.refreshToken = refreshToken
    await userid.save({validateBeforeSave: false})
    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "server side prblm");
    
  }
}



//regiter korar jonno method

const userRegister = asyncHandler(async (req, res) => {
   const {userName, email, fullname, password}=req.body
  console.log(userName, fullname);
  
   if (!userName || userName.trim() === "") {
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
  

//Email & Password check..
const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     // regx formula
    if (!emailRegx.test(email)) {
        throw new ApiError(400, "Invalide email format");
        
    }
    if (password.length<8) {
        throw new ApiError(400, "Pass must be at-least 8 characters");      // password validation chck
        
    }
 


    //user exist or not
const existUser= await User.findOne(
    { $or:[{userName}, {email}] }
)
if (existUser) {
    throw new ApiError(409, "Already exist")
}

//chck img n avatar
const avatarLocalPath = req.files?.avatar[0]?.path;   // multer files dey ja  
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
// create user obcoverImageLocalPathject in DB

const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage.url,
      email,
      userName,
      password
    })

const cratUser = await User.findById(user._id).select(    //data create hoice naki hoy nai ta id er maddhome check korbo ebong select er maddhome password refreshtoken remove krbo
  "-password -refreshToken"
)

if (!cratUser) {
  throw new ApiError(500,"servers problem")
  
}

return res.status(200).json(
  new ApiSuccess(200, cratUser, "User registered successfully")
)


});

//user login

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

  const {accessToken, refreshToken} = await generateAccessNRefreshToken(userExt._id)
  //token gen koray retn astece accss r rfsh token oita var er moddhe store kora jay
  const  login = await User.findById(userExt._id).select(
    "-password -refreshToken"
  )
  //   // Assuming userExt exists 
// userExt.accessToken = accessToken;
// userExt.refreshToken = refreshToken;   aivabe o update kora jay

// // Save the updated user
// await userExt.save();


  // cokies secure
  //jkhn e coks send korar drkr hobe tkhn kicu optn ase ja aro besi secure kore tole nice true korate fntend theke mod krt parbe na server theke mod korte hobe.
  const option = {
    httpOnly: true,
    secure: true
  }
return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(new ApiSuccess(200,{user: accessToken, refreshToken, login}, "user loging successfully"))  

});

// create logout handeler korte hole 1. coks theke del koro & acctken r refrtoken del kore deo. er jonno ekti midwear toiri koro  
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
})  ;

// END of refresh TOken
//acctoken er time jkhn ses hoye jabe tkhn frnEnd code a likhbe if accToken er time ses hoye jay tkhn notun kore refToken deo. jate kore user login thake sei token verify kore dekhbo j token mil ache kina thakle abr session calu thakbe noyto (401 expired).
const refreshAceessToken = asyncHandler(async(req, res)=>{
const incomingrefreshToken=  req.cookie.refreshToken || req.body.refreshToken  
if (!incomingrefreshToken) {
  throw new ApiError(401, "unuthorized access")
}

const decodedRefToken =await JWT.verify(refreshAceessToken, process.env.REFRESH_TOKEN)
const decodedUser =await User.findById(decodedRefToken?._id)

if (!decodedUser) {
  throw new ApiError(401, " Invalide token")
  }
if (incomingrefreshToken !== decodedUser?.refreshToken) {
  throw new ApiError(401, " Invalide refresh token")
  }
const option = {
  httpOnly: true,
  secure: true
}
//genrate accToken & refToken
const {accessToken, NewRefreshToken}=await generateAccessNRefreshToken(decodedUser._id)


 return res
 .status(200)
 .cookie("accessToken", accessToken, option)
 .cookie("refreshToken", NewRefreshToken, option)
 .json(new ApiSuccess(200, {accessToken, refresh: NewRefreshToken}, "Aceess Token Successfully"))

});

// user password
const currentPassword = asyncHandler(async(req, res)=>{
   const { oldpassword, newpassword}= req.body
   const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await user.isPasswordCorrect( oldpassword)

   if (!isPasswordCorrect) {
    throw new Error(400, "Invalid password");
   }

   user.password = newpassword    //newpass userpass er moddhe set & save hoice
   await user.save({ validateBeforeSave: true })
   return res.status(200),json(new ApiSuccess(200, {}, "Password change successfully"))

});

// current user neyar jonno controler (req.user) theke 
 const currentUser = asyncHandler(async(req, res)=>{
  return res.status(200).json( new ApiSuccess(200, req.user, "Current User get successfully"))
 });

 //update option jodi kono user kono kicu update korte cay jemon file ba img tahole oke alada file kore neya valo.
 const updateAccDeatails = asyncHandler(async(req, res)=>{
        const {fullname, email} = req.body
      if (!(fullname || email)) {
        throw new ApiError(400, "all fields are requred")}
     const updateUser =  await User.findByIdAndUpdate(req.user?._id, 
      {$set: {fullname, email}},
      {new: true}).select("-password")
      
      return req.status(200).json(new ApiSuccess(200, updateUser, "Your Account Update successfully"))

 });

 // file update, delete, and upload like avatar 
 const avatarfileUpdate = asyncHandler(async(req, res)=>{
  const avatarpath = req.file?.path   //age localpath ta find krte hobe
  if (!avatarpath) {
    throw new ApiError(400, "Avatar file is missing");
      }
  const userId = await User.findById(req.user?._id);
  if (!userId) {
    throw new ApiError(404, "User not found");
  }

      const oldAvatar = userId.avatar; // Assuming the old avatar's Cloudinary public_id is stored

      // Delete the old avatar from Cloudinary if it exists
      if (oldAvatar) {
        try {
          const deleteAvtar = await cloudinary.uploader.destroy(oldAvatar);
          if (!deleteAvtar) {
            throw new ApiError(400, "Error while deleting old avatar");
          }
        } catch (error) {
          throw new ApiError(500, "Failed to delete old avatar");
        }
      }
        
    const delFromDB = await User.findByIdAndUpdate(req.user._id,    //DB er theke del kore deya
      {$unset:{avatar: ""}}, {new:true})

    if (!delFromDB) {
        throw new ApiError(404, "User not found or could not update");
    }   
      
  const uploadAvatar =  await uploadOnCloudinary(avatarpath) //file upload korar jonno avatar localpath ja pabo oita upload hobe
  if (!uploadAvatar.url) {
    throw new ApiError(400, "update Error while upload on cloudinary");
      }
      const user =await User.findByIdAndUpdate(req.user?._id,
        {$set:{avatar: uploadAvatar.url}}, {new: true}
      )
      return req.status(200).json(200, user, "avatar updated successfully")
 });


 // file update, delete, and upload like coverImage

 const fileImgUpdate = asyncHandler(async(req, res)=>{
  const updateCoverpath = req.file?.path
  if (!updateCoverpath) {
    throw new ApiError(400, "CoverImage file is missing");
      }

      const oldCoverImg = req.file?.coverImage; // Assuming the old avatar's Cloudinary public_id is stored

      // Delete the old coverImg from Cloudinary if it exists
      if (oldCoverImg) {
        try {
          const deleteCoverImg = await cloudinary.uploader.destroy(oldCoverImg);
          if (!deleteCoverImg) {
            throw new ApiError(400, "Error while deleting old avatar");
          }
        } catch (error) {
          throw new ApiError(500, "Failed to delete old avatar");
        }
      }
       
    const delFromDB = await User.findByIdAndUpdate(req.user._id, {$unset:{coverImage: ""}}, {new:true})

    if (!delFromDB) {
        throw new ApiError(404, "User not found or could not update");
    }    
      
  const uploadCoverImg =  await uploadOnCloudinary(updateAvatar) //file upload korar jonno
  if (!uploadCoverImg.url) {
    throw new ApiError(400, "update Error while upload on cloudinary");
      }
      const user =await User.findByIdAndUpdate(req.user?._id,
        {$set:{coverImage: CoverImg.url}}, {new: true}
      )
      return req.status(200).json(200,user, "CoverImage updated successfully")
 });

// Chanel er jonno nirdisto korar jonno
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  
  if (!userName?.trim()) {
    throw new ApiError(400, "User not found");
  };

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName.toLowerCase()    //req.user.find() eivabe na kore amra match formula use krte pari. eita soko doc er moddhe jeita match korbe tar moddhe 1ti doc find kore dibe. 
      }
    },
    {
      $lookup: {
        from: 'subscribes', // The collection you want to join (must be a string)
        localField: '_id', // Field from `User` collection
        foreignField: 'channel', // Field from `subscribe` collection 
        as: 'subscriber' // The name of the array to store the joined data
      }
    },
    {
      $lookup: {
        from: 'subscribes', // The collection you want to join (must be a string)
        localField: '_id', // Field from `User` collection
        foreignField: 'subsriber', // Field from `subscribe` collection 
        as: 'subscribe to' // The name of the array to store the joined data
      }
    },
    {
      $addFields: {
        subscriberCount:{
          $size: "subscriber"     //subscriber count korar jonno
        },
        subscribedCount:{
          $size: "subscriber to"    //subscription count korar jonno
        },
        isSubscribedOrNot: {
          $condition: {
            if:{$in:[req.user?._id, "$subscribers.subsriber"]},
            then: true,
            else: false,
            
          }
        }
         
      }
    },
    {
      $project: {
        fullname: 1,
        userName: 1,
        subscriberCount: 1,
        subscribedCount: 1,
        avatar: 1,
        coverImage:1
      }
    }
  ]);
  if (!channel?.length) {
    throw new ApiError(400, "Chanel does not exist")
  }

  return res.status(200).json(new ApiSuccess(200, channel, "chanel get succssesfully"));
});

const getWatchHistory = asyncHandler(async(req, res)=>{
const user = User.aggregate([
  {
    $match: {
      _id: new mongoose.Type.ObjectId(req.user._id)     //user jei Id dey sei ID mongoose er ID. aggrt er moddhe mongos er kaj cole na. mongoDB direct ney. tai mongos er object ID nite hbe.  
        }
  },
  {
    $lookup: {
      from: 'videos',
      localField: "watchHistory",
      foreignField: "_id",
      as: "watchHistory",
      pipeline: [                         //nested lookup ek table theke onno table er eki lookup
        {$lookup:{
          from: 'User',
          localField: 'owner',
          foreignField: _id,
          as: 'owner',
          pipeline:[
            {$project: {
              userName: 1,
              fullname: 1,
              avatar: 1
            }
        }]
         } },
        {
          $addFields: {
            owner: { $first: $owner}
          }
        }
      ]
    }  
  }
]);
if (!user) {
  throw new ApiError(400,"didn't get the user");
  }
  return res.status(200).json(new ApiSuccess(200, getWatchHistory, "watch history get successfully"))
})





export {userRegister,
        userLoging,
        loguot,
        refreshAceessToken,
        currentUser,
        currentPassword,
        updateAccDeatails,
        fileImgUpdate,
        avatarfileUpdate,
        getUserChannelProfile,
        getWatchHistory
      }