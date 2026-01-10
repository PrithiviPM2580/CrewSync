import { joinWorkspaceController } from "@/controllers/member.controller.js";
import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { isAuthenticated } from "@/middlewares/isAunticates.middleware.js";
import { apiLimitter } from "@/middlewares/rate-limiter.middleware.js";
import { joinWorkspaceSchema } from "@/validator/member.validator.js";
import { Router } from "express";
import validateRequestMiddleware from "@/middlewares/request-validate.middleware.js";

const router: Router = Router();

router
  .route("/workspace/:inviteCode/join")
  .post(
    apiLimitter,
    isAuthenticated,
    validateRequestMiddleware(joinWorkspaceSchema),
    asyncHandler(joinWorkspaceController)
  );

export default router;
