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

export const consumeQueue = async (queue, onMessage) => {
  try {
    if (!channel) {
      await connectQueue();
    }

    if (!channel) {
      console.log("No channel available — cannot consume", queue);
      return;
    }

    await channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString());
            await onMessage(payload);
            channel.ack(msg);
          } catch (err) {
            console.error("Failed to process message:", err.message);
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false },
    );
  } catch (err) {
    console.error("Failed to consume queue:", err.message);
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
  consumeQueue,
  closeQueue,
};
