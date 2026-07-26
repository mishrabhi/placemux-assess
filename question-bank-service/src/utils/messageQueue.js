import amqplib from "amqplib";

let connection = null;
let channel = null;

export const connectQueue = async () => {
  if (!process.env.RABBITMQ_URL) {
    console.log("RABBITMQ_URL not set — message queue disabled");
    return null;
  }

  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    return { connection, channel };
  } catch (err) {
    console.error("RabbitMQ connection failed:", err.message);
    return null;
  }
};

export const publishMessage = async (queue, payload) => {
  try {
    if (!channel) {
      await connectQueue();
    }

    if (!channel) {
      console.log("No channel available — skipping publish for", queue);
      return;
    }

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  } catch (err) {
    console.error("Failed to publish message:", err.message);
  }
};

export const closeQueue = async () => {
  try {
    await channel?.close();
    await connection?.close();
  } catch (err) {
    // ignore
  }
};

export default {
  connectQueue,
  publishMessage,
  closeQueue,
};
