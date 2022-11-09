import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;
// Start Mongo Memory Server first
beforeAll(async () => {
  const mongo = await MongoMemoryServer.create();
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
  const payload = {
    id: "12345asd",
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.jwt_key!); // Create the JWT
  const session = { jwt: token }; // Build session object
  const sessionJSON = JSON.stringify(session); // Turn the session to JSON
  const base64 = Buffer.from(sessionJSON).toString("base64"); // Take JSON and encode it as Base64

  return [`session=${base64}`];
};
