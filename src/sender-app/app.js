const express = require("express");
const { MqueueHelper } = require("./utils");

const exchangeName = "test_exchange";
const exchangeType = "direct";
const isExchangeDurable = true;
const isMessageInChannelPsersitant = true;
const key = "hello-key"; // routing key
const queue = "";

const app = express();
app.use(express.json());
const mqHelper = new MqueueHelper();

app.post("/send-msg", async (req, res) => {
  const { msg } = req.body;

  for (let i = 0; i < 100; i++) {
    let key = i % 2 === 0 ? "hello-light" : "hello-key";

    await mqHelper.sendMsg(
      exchangeName,
      exchangeType,
      isExchangeDurable,
      isMessageInChannelPsersitant,
      key,
      msg
    );
  }

  return res.status(200).json({ msg: "message sent to exchange" });
});

app.listen(8888, () => {
  console.log("Server started on port 8888...");
});
