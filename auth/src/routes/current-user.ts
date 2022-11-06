import express from "express";

import { extractJwt } from "@tixproject/common";

const router = express.Router();

router.get("/api/users/currentuser", extractJwt, (req, res) => {
  res.json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
