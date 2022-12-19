import mongoose from "mongoose"

import { app } from "./app"
import { natsWrapper } from "./nats-wrapper"
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener"
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener"
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener"
import { PaymentCreatedListener } from "./events/listeners/payment-created-event"

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
    // Start NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on("close", () => {
      // Closing NATS
      console.log("NATS connection closed")
      process.exit()
    })
    process.on("SIGTERM", () => natsWrapper.client.close()) // Closing NATS connection on Terminate Signal
    process.on("SIGINT", () => natsWrapper.client.close()) // Closing NATS connection on Interupt Signal

    new TicketCreatedListener(natsWrapper.client).listen() // Listen Ticket Created event
    new TicketUpdatedListener(natsWrapper.client).listen() // Listen Ticket Updated event
    new ExpirationCompleteListener(natsWrapper.client).listen() // Listen Expiration Complete event
    new PaymentCreatedListener(natsWrapper.client).listen() // Listen Payment Created event

    mongoose.set("strictQuery", false)
    await mongoose.connect(process.env.MONGO_URI) // Connect to MongoDB using env
    console.log("Connected to mongodb")
  } catch (error) {
    console.error(error)
  }
}
/*---------------Start Database---------------*/

/*---------------Start Server---------------*/
app.listen(3000, () => {
  console.log("Order service is running...")
  startDB().catch((err) => console.log(err))
})
/*---------------Start Server---------------*/
