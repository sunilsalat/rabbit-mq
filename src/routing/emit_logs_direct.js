const amqplib = require("amqplib");

const emitLogs = async () => {
  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel();

  let exchange = "direct_logs";
  var args = process.argv.slice(2);
  var msg = args.slice(1).join(" ") || "Hello World!";
  var severity = args.length > 0 ? args[0] : "info";

  await ch.assertExchange(exchange, "direct", {
    durable: true,
  });

  ch.publish(exchange, severity, Buffer.from(msg));

  setTimeout(function () {
    conn.close();
    process.exit(0);
  }, 500);
};

emitLogs();
