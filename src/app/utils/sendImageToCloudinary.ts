
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: config.cloudName, 
    api_key: config.apiKey, 
    api_secret: config.apiSecret,
});

export const sendImageToCloudinary = async (imageName : string , path : string) => {
    return new Promise((resolve , reject) => {
        cloudinary.uploader.upload(path , { public_id: imageName } , function (err, result){
            if(err){
                reject(err) ;
            }
            resolve(result) ;
            fs.unlink(path , (err) => {
                if(err){
                    console.log(err) ;
                }
                else{
                    console.log(`file is deleted succes fully !`) ;
                }
            })
        })
    })
} 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.cwd()+"/uploads/")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
export const upload = multer({ storage: storage })
