import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"

import { app } from "../app"

declare global {
  var signin: () => Promise<string[]>
}

let mongo: any
// Start Mongo Memory Server first
beforeAll(async () => {
  const mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})

  process.env.jwt_key = "supersecretkey"
})
// Delete each finished test
beforeEach(async () => {
  const collection = await mongoose.connection.db.collections()
  collection.forEach(async (val) => await val.deleteMany({}))
})
// Close connection after finished all test
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = async () => {
  const email = "test@gmail.com"
  const password = "password"

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201)
  const cookie = response.get("Set-Cookie")

  return cookie
}
