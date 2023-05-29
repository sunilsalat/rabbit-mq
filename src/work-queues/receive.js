const amqplib = require("amqplib");

const receiver = async () => {
  const queue = "task";
  const conn = await amqplib.connect("amqp://localhost");

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue, { durable: true });

  // Listener
  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      console.log("Recieved:", msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log("Consumer cancelled by server");
    }
  });
};

receiver();
