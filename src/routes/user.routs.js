import { Router } from "express";
import { userLoging, loguot, refreshAceessToken, userRegister } from "../controlers/users_control.js";
import upload from "../middlewares/upload_multer.js"
import { verifyJWT } from "../middlewares/auth_midlwear.js";

const router = Router();

// router.route("/register").post(userRegister);
router.post("/register", upload.fields([
    { name: 'avatar', maxCount: 1 }, 
    { name: 'coverImage', maxCount: 2 }
    ]), userRegister);

router.post("/login", userLoging);

router.post("/logout", verifyJWT, loguot)
router.post("/refresh-Token", refreshAceessToken )

export default router