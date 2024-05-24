const express = require("express");
const { MqueueHelper } = require("./utils");

const app = express();
const mqHelper = new MqueueHelper();

const exchangeName = "test_exchange";
const exchangeType = "direct";
const isExchangeDurable = true;
const isQueueDurable = true;
const isQueueExclusive = false;
const key = "hello-light"; // routing key
const queue = "random";

// app.post("/receive-msg", async (req, res) => {
const cb = async (msg, ch) => {
  console.log("msg-received============>", JSON.parse(msg.content.toString()));
  ch.ack(msg);
};

mqHelper.receiveMsg(
  exchangeName,
  exchangeType,
  isExchangeDurable,
  isQueueDurable,
  isQueueExclusive,
  key,
  cb,
  queue
);

mqHelper.receiveMsg(
  exchangeName,
  exchangeType,
  isExchangeDurable,
  isQueueDurable,
  isQueueExclusive,
  "hello-key",
  cb,
  queue
);

//   return res.status(200).json({ msg: "ks" });
// });

app.listen(9999, () => {
  console.log("Server started on port 9999...");
});
