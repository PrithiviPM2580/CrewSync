import { Router } from "express";

const router: Router = Router();

router.route("/current").get();

export default router;
