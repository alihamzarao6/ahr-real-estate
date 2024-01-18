import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listingControllers.js";
import { authenticatedUser } from "../utils/userAuthentication.js";

const router = express.Router();

router.post("/create", authenticatedUser, createListing);
router.delete("/delete/:id", authenticatedUser, deleteListing);
router.post("/update/:id", authenticatedUser, updateListing);

export default router;