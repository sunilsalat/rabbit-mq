const amqplib = require("amqplib");

class MqueueHelper {
  static connection;
  static channel;
  constructor() {}

  async getClient() {
    if (!MqueueHelper.connection) {
      MqueueHelper.connection = await amqplib.connect("amqp://localhost");
      MqueueHelper.channel = await MqueueHelper.connection.createChannel();
      console.log("Client connected to rbmq");
    }

    return MqueueHelper.channel;
  }

  async sendMsg(
    exchangeName,
    exchangeType,
    isExchangeDurable = false,
    isMessageInChannelPsersitant = false,
    key = "", // routing key
    msg,
    queue
  ) {
    try {
      let ch = await this.getClient();

      await ch.assertExchange(exchangeName, exchangeType, {
        durable: isExchangeDurable,
      });

      ch.publish(exchangeName, key, Buffer.from(JSON.stringify(msg)), {
        persistent: isMessageInChannelPsersitant,
      });

      if (queue) {
        await ch.assertQueue(queue, {
          durable: false,
        });

        ch.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      }

      console.log(" [x] Sent %s", msg);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async receiveMsg(
    exchangeName,
    exchangeType,
    isExchangeDurable = false,
    isQueueDurable = false,
    isQueueExclusive = false,
    key = "", //binding key
    cb,
    queueName
  ) {
    try {
      let ch = await this.getClient();

      await ch.assertExchange(exchangeName, exchangeType, {
        durable: isExchangeDurable,
      });

      const { queue } = await ch.assertQueue(queueName, {
        durable: isQueueDurable,
        exclusive: isQueueExclusive,
      });

      await ch.bindQueue(queue, exchangeName, key);

      //   await ch.assertQueue(queue, {
      //     durable: false,
      //   });

      ch.consume(
        queue,
        async (msg) => {
          if (msg) {
            await cb(msg, ch);
          }
        },
        {
          noAck: false, // manual ack mode , means consumer has to acknowledges
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { MqueueHelper };
