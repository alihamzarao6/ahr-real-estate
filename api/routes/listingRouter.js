import express from "express";
import { createListing } from "../controllers/listingControllers.js";
import { authenticatedUser } from "../utils/userAuthentication.js";

const router = express.Router();

router.post("/create", authenticatedUser, createListing);

export default router;