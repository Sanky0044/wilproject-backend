import express from 'express'
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express ()

app.use(express.json())
app.use(cookieParser());
app.use(cors(
  { credentials: true, origin: 'https://wilproject-frontend.onrender.com' }
  )); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../Frontend/public/upload");
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