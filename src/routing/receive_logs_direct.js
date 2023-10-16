/* To simplify things we will assume that 'severity' can be one of 'info', 'warning', 'error'. */
const amqplib = require("amqplib");

const receiveLogs = async () => {
    try {
        var args = process.argv.slice(2);

        if (args.length == 0) {
            console.log(
                "Usage: receive_logs_direct.js [info] [warning] [error]"
            );
            process.exit(1);
        }

        const conn = await amqplib.connect("amqp://localhost");
        const ch = await conn.createChannel();

        let exchange = "direct_logs";

        await ch.assertExchange(exchange, "direct", {
            durable: true,
        });

        const q = await ch.assertQueue("", { exclusive: false, durable: true });

        args.forEach(function (severity) {
            ch.bindQueue(q.queue, exchange, severity);
        });

        ch.consume(
            q.queue,
            (msg) => {
                console.log(
                    " [x] %s: '%s'",
                    msg.fields.routingKey,
                    msg.content.toString(),
                    "sdfsdf"
                );
                ch.ack(msg);
            },
            {
                noAck: false,
            }
        );
    } catch (error) {
        console.log(error);
    }
};

receiveLogs();
