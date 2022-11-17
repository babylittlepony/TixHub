import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("NATS not started");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url }); // Initialize the NATS client

    this._client.on("close", () => {
      // Closing NATS connection
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGTERM", () => this.client.close()); // Closing NATS connection on Terminate Signal
    process.on("SIGINT", () => this.client.close()); // Closing NATS connection on Interupt Signal

    return new Promise((resolve, reject) => {
      // Added Promise
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
