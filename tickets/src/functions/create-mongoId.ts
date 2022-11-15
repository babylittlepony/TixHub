import mongoose from "mongoose";

const createMongoId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};

export { createMongoId };
