import express from "express"
import {register,login,logout} from "../controllers/auth.js";
import {addPost} from "../controllers/post.js"


const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

//router.get("/test", addPost)

export default router