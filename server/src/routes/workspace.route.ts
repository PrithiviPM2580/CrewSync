import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { Router } from "express";
import { createWorkspaceController } from "@/controllers/workspace.controller.js";

const router: Router = Router();

router
  .route("/create/new")
  .post(apiLimitter, asyncHandler(createWorkspaceController));

export default router;
