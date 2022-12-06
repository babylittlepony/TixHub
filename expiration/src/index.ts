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
      // Closing NATS connection
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGTERM", () => natsWrapper.client.close()); // Closing NATS connection on Terminate Signal
    process.on("SIGINT", () => natsWrapper.client.close()); // Closing NATS connection on Interupt Signal
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
