import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "../nats-wrapper";

/*---------------Start Database---------------*/
const startDB = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt secret key not found");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not found");
  }
  try {
    await natsWrapper.connect("ticket", "test", "http://nats-srv:4222");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};
/*---------------Start Database---------------*/

/*---------------Start Server---------------*/
app.listen(3000, () => {
  console.log("Ticket service is running...");
  startDB().catch((err) => console.log(err));
});
/*---------------Start Server---------------*/
