import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { createMongoId } from "@tixproject/common";

declare global {
  // Declaring global function
  var signin: () => string[];
}

jest.mock("../nats-wrapper.ts");

let mongo: any;
// Start Mongo Memory Server first
beforeAll(async () => {
  jest.clearAllMocks();
  mongo = await MongoMemoryServer.create().catch((err) => console.error(err));
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});

  process.env.jwt_key = "supersecretkey";
});
// Delete each finished test
beforeEach(async () => {
  const collection = await mongoose.connection.db.collections();
  collection.forEach(async (val) => await val.deleteMany({}));
});
// Close connection after finished all test
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  //Creating the global function
  const payload = {
    id: createMongoId(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.jwt_key!); // Create the JWT
  const session = { jwt: token }; // Build session object
  const sessionJSON = JSON.stringify(session); // Turn the session to JSON
  const base64 = Buffer.from(sessionJSON).toString("base64"); // Take JSON and encode it as Base64

  return [`session=${base64}`];
};
