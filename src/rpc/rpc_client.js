const amqplib = require("amqplib");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

const send = async () => {
  const conn = await amqplib.connect("amqp://localhost");
  const ch = await conn.createChannel();
  const q = await ch.assertQueue("", { exclusive: true });
  const correlationId = math.random();
  var num = parseInt(args[0]);

  ch.prefetch(1);

  ch.consume(
    q.queue,
    async (msg) => {
      if (msg.properties.correlationId == correlationId) {
        console.log(" [.] Got %s", msg.content.toString());
        setTimeout(function () {
          connection.close();
          process.exit(0);
        }, 500);
      }
    },
    {
      noAck: true,
    }
  );

  channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
    correlationId: correlationId,
    replyTo: q.queue,
  });
};

send();
