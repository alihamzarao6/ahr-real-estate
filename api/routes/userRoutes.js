import express from "express";

import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
} from "../controllers/userControllers.js";

import {authenticatedUser} from "../utils/userAuthentication.js"

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", authenticatedUser, updateUser);
router.delete("/delete/:id", authenticatedUser, deleteUser);
router.get('/listings/:id', authenticatedUser, getUserListings);

export default router;
