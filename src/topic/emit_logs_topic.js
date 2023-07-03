const amqplib = require("amqplib");

const emitLogs = async () => {
  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel("");

  const exchange = "topic_logs";
  var args = process.argv.slice(2);
  var key = args.length > 0 ? args[0] : "anonymous.info";
  var msg = args.slice(1).join(" ") || "Hello World!";

  await ch.assertExchange(exchange, "topic", { durable: false });
  ch.publish(exchange, key, Buffer.from(msg));
  console.log(" [x] Sent %s:'%s'", key, msg);

  setTimeout(function () {
    conn.close();
    process.exit(0);
  }, 500);
};

emitLogs();
