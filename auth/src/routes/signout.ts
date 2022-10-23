import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  res.json("Under construction");
});

export { router as signOutRouter };
