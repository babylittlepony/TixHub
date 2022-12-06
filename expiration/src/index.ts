import { OrderCreatedListener } from "./events/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

/*---------------Start Database---------------*/
const startDB = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("Nats URL not found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Nats Cluster Id not found");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Nats Client Id not found");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      // Listening to NATS Close event and closed the process
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGTERM", () => natsWrapper.client.close()); // Closing NATS connection on Terminate Signal
    process.on("SIGINT", () => natsWrapper.client.close()); // Closing NATS connection on Interupt Signal

    new OrderCreatedListener(natsWrapper.client).listen(); // Order Created event listener
  } catch (error) {
    console.log(error);
  }
};
/*---------------Start Database---------------*/

/*---------------Start Server---------------*/
startDB()
  .then(() => console.log("Expiration service is running..."))
  .catch((err) => console.log(err));
/*---------------Start Server---------------*/
