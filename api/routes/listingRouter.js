import express from "express";
import {
  createListing,
  deleteListing,
} from "../controllers/listingControllers.js";
import { authenticatedUser } from "../utils/userAuthentication.js";

const router = express.Router();

router.post("/create", authenticatedUser, createListing);
router.delete("/delete/:id", authenticatedUser, deleteListing);

export default router;