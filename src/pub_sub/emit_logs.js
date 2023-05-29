const amqplib = require("amqplib");

const emitLogs = async () => {
  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel();

  let exchange = "logs";
  let msg = process.argv.slice(2).join(" ") || "Hello World!";

  await ch.assertExchange(exchange, "fanout", {
    durable: true,
  });

  ch.publish(exchange, "", Buffer.from(msg), { persistent: true });

  setTimeout(function () {
    conn.close();
    process.exit(0);
  }, 500);
};

emitLogs();
