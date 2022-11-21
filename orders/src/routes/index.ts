import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders", async (res: Response, req: Request) => {
  res.json();
});

export { router as indexOrderRouter };
