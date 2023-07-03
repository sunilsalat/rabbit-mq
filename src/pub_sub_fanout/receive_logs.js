const amqplib = require("amqplib");

const receiveLogs = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const ch = await conn.createChannel();

  let exchange = "logs";
  let msg = process.argv.slice(2).join(" ") || "Hello World!";

  await ch.assertExchange(exchange, "fanout", {
    durable: true,
  });

  const q = await ch.assertQueue("", { exclusive: false });

  ch.bindQueue(q.queue, exchange, "");

  ch.consume(
    q.queue,
    (msg) => {
      if (msg !== null) {
        console.log("Recieved:", msg.content.toString());
      } else {
        console.log("Consumer cancelled by server");
      }
    },
    { noAck: false }
  );
};

receiveLogs();
