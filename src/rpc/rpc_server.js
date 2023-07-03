const amqplib = require("amqplib");

const receive = async () => {
  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel();

  await ch.assertQueue("rpc_queue", { durable: false });

  ch.prefetch(1);

  ch.consume("rpc_queue", async (msg) => {
    ch.sendToQueue(msg.properties.replyTo, Buffer.from(), {
      correlationId: msg.properties.correlationId,
    });
  });

  ch.ack(msg);
};

receive();
