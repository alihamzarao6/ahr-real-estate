import express from "express";

import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/userControllers.js";

import {authenticatedUser} from "../utils/userAuthentication.js"

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", authenticatedUser, updateUser);
router.delete("/delete/:id", authenticatedUser, deleteUser);
router.get('/listings/:id', authenticatedUser, getUserListings);
router.get('/:id', authenticatedUser, getUser);

export default router;
