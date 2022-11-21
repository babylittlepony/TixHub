import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/orders", async (res: Response, req: Request) => {
  res.json();
});

export { router as newOrderRouter };
