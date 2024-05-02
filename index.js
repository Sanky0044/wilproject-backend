import express from 'express'
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import cookieParser from "cookie-parser";
import multer from "multer";

/*
import fs from fs; //file server

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dsbbepeox', 
  api_key: '615239515114269', 
  api_secret: '8l30kWL7eEIfNSnk_M8YQx9Y8jk' 
});

const uploadOnCloudinary = async (localFilePath) => {
  try{
    if (!localFilePath) return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //File has been uploaded successful
    console.log("File is uploaded on cloudinary",
    response.url);
    return response
  } catch (error){
    fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload
    return null;
  }
}
*/

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

app.post("/BackEnd/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  });

app.use("/BackEnd/auth", authRoutes)
app.use("/BackEnd/posts", postRoutes)
app.use("/BackEnd/users", userRoutes)


app.listen(8800, ()=>{
    console.log("connected!")
})