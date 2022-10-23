import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.json("Under construction");
});

export { router as signInRouter };
