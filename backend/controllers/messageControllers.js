const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chat } = req.body;

  if (!content || !chat) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let message = await Message.create({ sender: req.user._id, content, chat });

    message = await message.populate("sender", "username image");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "username image email",
    });

    message = await User.populate(message, {
      path: "chat.users",
      select: "username image email",
    });

    await Chat.findByIdAndUpdate(req.body.chat, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username image email")
      .populate("chat");

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
