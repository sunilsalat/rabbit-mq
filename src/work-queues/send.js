const amqplib = require("amqplib");

const sender = async () => {
    const queue = "task";
    const conn = await amqplib.connect("amqp://localhost");
    const ch2 = await conn.createChannel();
    ch2.assertQueue(queue, {
        durable: true,
    });

    //   setInterval(() => {
    ch2.sendToQueue(queue, Buffer.from("something to do"), {
        persistent: true,
    });
    //   }, 1000);

    setTimeout(function () {
        conn.close();
        process.exit(0);
    }, 500);
};

sender();
