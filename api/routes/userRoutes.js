import express from "express";

import { test, updateUser } from "../controllers/userControllers.js";

import {authenticatedUser} from "../utils/userAuthentication.js"

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", authenticatedUser, updateUser);

export default router;
