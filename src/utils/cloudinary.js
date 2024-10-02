
    import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
    import fs from 'fs';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.Cloudinary_cloud_name, 
        api_key: process.env.Cloudinary_api_key, 
        api_secret: process.env.Cloudinary_api_secret  // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const uploadOnCloudinary= async(localStorage)=>{
        try {
            if (!localStorage) return null
                
            const uploadResult = await cloudinary.uploader
            .upload(localStorage,{
                resource_type: "auto"
            })
            console.log(uploadResult, response.url);
            return response

            
        } catch (error) {
            fs.unlink(localStorage)     //remove file from 
        }
       
    }
     
    

export {uploadOnCloudinary}