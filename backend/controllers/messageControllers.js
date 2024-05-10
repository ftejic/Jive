const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chat } = req.body;
  let { isImage } = req.body;

  const key = Buffer.from(process.env.CRYPTOKEY, "hex");

  if (!content || !chat) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  if (!isImage) {
    isImage = false;
  }

  try {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encryptedMessage = cipher.update(content, "utf8", "hex");
    encryptedMessage += cipher.final("hex");

    let message = await Message.create({
      sender: req.user._id,
      content: encryptedMessage,
      chat,
      isImage,
      iv: iv.toString("hex"),
    });

    message = await message.populate("sender", "username image");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "username image email",
    });

    message.content = content;

    await Chat.findByIdAndUpdate(req.body.chat, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getMessages = asyncHandler(async (req, res) => {

  const key = Buffer.from(process.env.CRYPTOKEY, "hex");

  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username image email")
      .populate("chat");

    messages.forEach((message) => {
      const iv = Buffer.from(message.iv, "hex");
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(message.content, "hex", "utf8");
      decrypted += decipher.final("utf8");
      message.content = decrypted;
    });

    res.json(messages);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  getMessages,
};
