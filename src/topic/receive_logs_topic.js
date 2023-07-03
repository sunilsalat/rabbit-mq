/* To simplify things we will assume that 'severity' can be one of 'info', 'warning', 'error'. */
const amqplib = require("amqplib");

const receiveLogs = async () => {
  var args = process.argv.slice(2);

  const conn = await amqplib.connect("amqp://localhost");

  const ch = await conn.createChannel();

  const exchange = "topic_logs";

  await ch.assertExchange(exchange, "topic", { durable: false });

  const q = await ch.assertQueue("", {
    exclusive: true,
  });

  args.forEach(function (key) {
    ch.bindQueue(q.queue, exchange, key);
  });

  ch.consume(
    q.queue,
    function (msg) {
      console.log(
        " [x] %s:'%s'",
        msg.fields.routingKey,
        msg.content.toString()
      );
    },
    {
      noAck: true,
    }
  );
};

receiveLogs();
