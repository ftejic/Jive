const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId not provided");
    return res.sendStatus(400);
  }

  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  return res.send(chat[0]);
});

const getChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username image email",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId not provided");
    return res.sendStatus(400);
  }

  let chatData = {
    chatName: null,
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const wholeChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(wholeChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  const users = JSON.parse(req.body.users);
  users.push(req.user); // add loged in user

  if (users.length < 2) {
    return res.status(400).send("Group should have at least 2 members");
  }

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users,
      isGroupChat: true,
      groupAdmins: [req.user._id],
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteGroupChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).send({ message: "Id missing" });
  }

  try {
    await Chat.findByIdAndDelete(chatId);
    res.status(200).send({ message: "Group deleted" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).send({ message: "Id or name missing" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId, groupAdmins: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const search = asyncHandler(async (req, res) => {
  const searchTerm = req.body.searchTerm;

  try {
    const privateChatUser = await User.findOne({
      username: { $regex: searchTerm, $options: "i" },
    });

    let chats = await Chat.find({
      $or: [
        { chatName: { $regex: searchTerm, $options: "i" } },
        {
          $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            {
              users: {
                $elemMatch: { $ne: req.user._id, $eq: privateChatUser?._id },
              },
            },
          ],
        },
      ],
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username image email",
        },
      })
      .sort({ updatedAt: -1 });

    const user = await User.findOne({ email: searchTerm });

    res.status(200).json({ chats, user });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const addGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { groupAdmins: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const removeGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Chat Id or User Id missing" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { groupAdmins: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const changeGroupImage = asyncHandler(async (req, res) => {
  const { chatId, image } = req.body;

  if (!image || !chatId) {
    return res.status(400).send({ message: "Image or ChatId missing" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { image: image },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username image email",
      },
    });

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

module.exports = {
  accessChat,
  getChats,
  createChat,
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  addGroupAdmin,
  removeGroupAdmin,
  search,
  changeGroupImage,
};
