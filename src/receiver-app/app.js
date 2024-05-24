const express = require("express");
const { MqueueHelper } = require("./utils");

const app = express();
const mqHelper = new MqueueHelper();

const exchangeName = "test_exchange";
const exchangeType = "direct";
const isExchangeDurable = true;
const isQueueDurable = false;
const isQueueExclusive = false;
const queue = "random";

// app.post("/receive-msg", async (req, res) => {
const cb = async (msg, ch) => {
  console.log(
    "msg-received-hello-light-1============>",
    JSON.parse(msg.content.toString())
  );
  ch.ack(msg);
};
const cb1 = async (msg, ch) => {
  console.log(
    "msg-received-hello-light-2============>",
    JSON.parse(msg.content.toString())
  );
  ch.ack(msg);
};
const cb2 = async (msg, ch) => {
  console.log(
    "msg-received-heloo-key============>",
    JSON.parse(msg.content.toString())
  );
  ch.ack(msg);
};

mqHelper.receiveMsg(
  exchangeName,
  exchangeType,
  isExchangeDurable,
  isQueueDurable,
  isQueueExclusive,
  "hello-light",
  cb,
  queue
);

mqHelper.receiveMsg(
  exchangeName,
  exchangeType,
  isExchangeDurable,
  isQueueDurable,
  isQueueExclusive,
  "hello-light",
  cb1,
  queue
);

mqHelper.receiveMsg(
  exchangeName,
  exchangeType,
  isExchangeDurable,
  isQueueDurable,
  isQueueExclusive,
  "hello-key",
  cb2,
  queue
);

//   return res.status(200).json({ msg: "ks" });
// });

app.listen(9999, () => {
  console.log("Server started on port 9999...");
});
