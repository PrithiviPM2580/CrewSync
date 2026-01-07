import asyncHandler from "@/middlewares/async-handler.middleware.js";
import { failedUrl } from "@/utils/index.util.js";
import { Router } from "express";
import passport from "passport";
import { googleCallbackController } from "@/controllers/auth.controller.js";

const router: Router = Router();

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: failedUrl }),
    asyncHandler(googleCallbackController)
  );

export default router;
