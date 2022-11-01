import express from "express";

const router = express.Router();

router.get("/api/users/signout", (req, res) => {
  req.session = null;

  console.log("Sign out success");
  res.send({});
});

export { router as signOutRouter };
