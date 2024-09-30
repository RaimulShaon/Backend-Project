import { Router } from "express";
import { userRegister } from "../controlers/users.js";

const router = Router();

router.route("/register").post(userRegister);
router.post("/login", userRegister);


export default router