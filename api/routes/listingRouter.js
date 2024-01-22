import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listingControllers.js";
import { authenticatedUser } from "../utils/userAuthentication.js";

const router = express.Router();

router.post("/create", authenticatedUser, createListing);
router.delete("/delete/:id", authenticatedUser, deleteListing);
router.post("/update/:id", authenticatedUser, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;