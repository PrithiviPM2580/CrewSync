import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";
import { currentUserController } from "@/controllers/user.controller.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";

const router: Router = Router();

router
  .route("/current")
  .get(apiLimitter, isAuthenticated, asyncHandler(currentUserController));

export default router;
