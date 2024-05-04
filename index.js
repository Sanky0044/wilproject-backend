import express from 'express'
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import cookieParser from "cookie-parser";
import multer from "multer";


import fs from 'fs'; //file server

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dsbbepeox', 
  api_key: '615239515114269', 
  api_secret: '8l30kWL7eEIfNSnk_M8YQx9Y8jk' 
});

const uploadOnCloudinary = async (localFilePath, fileName) => {
  try{
    if (!localFilePath) return null;
    //upload the file on cloudinary
    // Remove spaces from the filename
    const sanitizedFileName = fileName.replace(/\s+/g, '').replace(/\.[^.]+$/, '');
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: sanitizedFileName,
    });
    //File has been uploaded successful
    console.log("File is uploaded on cloudinary",
    response.url);
    return response
  } catch (error){
    fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload
    console.error("Error uploading file to cloudinary:", error);
    return null;
  }
}


const app = express ()

app.use(express.json())
app.use(cookieParser());
app.use(cors(
  { credentials: true, origin: 'https://wilproject-frontend.onrender.com' }
  )); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

//app.get("/test", (req,res)=>{
    //res.json("It Works!")
//})

const upload = multer({ storage });
/*
app.post("/BackEnd/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  });
*/
app.post("/BackEnd/upload", upload.single("file"), async function (req, res) {
  try {
      const file = req.file;
      if (!file) {
          throw new Error("No file uploaded");
      }
      const modifiedFileName = (Date.now() + file.originalname).replace(/\s+/g, '');
      // Remove spaces from the filename
      //const sanitizedFileName = fileName.replace(/\s+/g, '');
      const response = await uploadOnCloudinary(file.path, modifiedFileName);
      if (!response) {
          throw new Error("Failed to upload file to Cloudinary");
      }
      //file.modifiedFileName = modifiedFileName;
      console.log("Modified FileName:", modifiedFileName);
      
      res.status(200).json(modifiedFileName); // Respond with the Cloudinary URL of the uploaded image
  } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
});


app.use("/BackEnd/auth", authRoutes)
app.use("/BackEnd/posts", postRoutes)
app.use("/BackEnd/users", userRoutes)


app.listen(8800, ()=>{
    console.log("connected!")
})