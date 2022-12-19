import mongoose from "mongoose"

import { app } from "./app"
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener"
import { OrderCreatedListener } from "./events/listeners/order-created-listener"
import { natsWrapper } from "./nats-wrapper"

/*---------------Start Database---------------*/
const startDB = async () => {
  if (!process.env.jwt_key) {
    throw new Error("jwt secret key not found")
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not found")
  }
  if (!process.env.NATS_URL) {
    throw new Error("Nats URL not found")
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Nats Cluster Id not found")
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Nats Client Id not found")
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on("close", () => {
      // Closing NATS connection
      console.log("NATS connection closed")
      process.exit()
    })
    process.on("SIGTERM", () => natsWrapper.client.close()) // Closing NATS connection on Terminate Signal
    process.on("SIGINT", () => natsWrapper.client.close()) // Closing NATS connection on Interupt Signal

    // Events listeners
    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.MONGO_URI) // Connect to MongoDB using env
    console.log("Connected to mongodb")
  } catch (error) {
    console.log(error)
  }
}
/*---------------Start Database---------------*/

/*---------------Start Server---------------*/
app.listen(3000, () => {
  console.log("Payments service is running...")
  startDB().catch((err) => console.log(err))
})
/*---------------Start Server---------------*/
