import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import { app } from "../app";

let mongo: any;
beforeAll(async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});

  process.env.jwt_key = "supersecretkey";
});

beforeEach(async () => {
  const collection = await mongoose.connection.db.collections();

  collection.forEach(async (val) => await val.deleteMany({}));
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
