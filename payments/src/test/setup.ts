import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { createMongoId } from "@tixproject/common";

declare global {
  // Declaring global function
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper.ts");

// Stripe Secret Key
process.env.STRIPE_KEY =
  "sk_test_51MCimNFj3dASAkzQObChKcDQKFBdJZQaLfzNSMrle1Z8VNy57Sm8YUy7xOAqciXs2R94988gNnSWnKjZRusmpDFp00Y5ji1mGR";

let mongo: any;
// Start Mongo Memory Server first
beforeAll(async () => {
  jest.clearAllMocks();
  mongo = await MongoMemoryServer.create();
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

global.signin = (id?: string) => {
  //Creating the global function
  const payload = {
    id: id || createMongoId(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.jwt_key!); // Create the JWT
  const session = { jwt: token }; // Build session object
  const sessionJSON = JSON.stringify(session); // Turn the session to JSON
  const base64 = Buffer.from(sessionJSON).toString("base64"); // Take JSON and encode it as Base64

  return [`session=${base64}`];
};
