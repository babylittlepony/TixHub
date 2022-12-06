import Queue from "bull";

interface Payload {
  // Payload for Queue Job
  orderId: string;
}

export const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // Process the incoming Queue Job
  console.log(job.data.orderId);
});
