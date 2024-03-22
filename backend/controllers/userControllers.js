const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");

const createSession = asyncHandler(async (userId) => {
  const session = await Session.create({
    userId,
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
  });

  return session;
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled.");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist.");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({ message: "User Created" });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {

    await Session.deleteOne({userId: user._id});

    const session = await createSession(user._id);

    if (session) {
      res.status(201).json({ sessionToken: session._id });
    } else {
      res.status(400);
      throw new Error("Session not found.");
    }
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies["jive.session-token"];

  if (!sessionToken) {
    res.status(401);
    throw new Error("Session token not found in cookies.");
  }

  const session = await Session.findOne({ _id: sessionToken });

  if (!session) {
    res.status(401);
    throw new Error("Session not found in the database.");
  }

  const user = await User.findOne({ _id: session.userId }).select("-password");

  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }

  res.status(200).json({ user, message: "authorized" });
});

module.exports = { registerUser, authUser, checkAuth };