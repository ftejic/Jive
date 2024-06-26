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

const getUsers = asyncHandler(async (req, res) => {
  const email = req.query.email ? { email: req.query.email } : {};

  const users = await User.find(email)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  res.send(users);
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
    return res.status(201).json({ message: "User Created" });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    await Session.deleteOne({ userId: user._id });

    const session = await createSession(user._id);

    if (session) {
      res.cookie("jive.session-token", session._id, {
        path: "/",
        maxAge: 8 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(201).json({ sessionToken: session._id });
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

const signOut = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies["jive.session-token"];

  if (sessionToken) {
    try {
      await Session.findByIdAndDelete({ _id: sessionToken });
      res
        .clearCookie("jive.session-token", {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .send({ message: "Signed out" });
    } catch (error) {
      res.status(400).send({ message: "Sign out failed" });
    }
  }
});

const changeUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({ message: "Username missing" });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username: username },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  } else {
    res.json(user);
  }
});

const changeProfileImage = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({ message: "Image missing" });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { image: image },
    { new: true }
  ).select("-password");

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  } else {
    res.json(user);
  }
});

module.exports = {
  getUsers,
  registerUser,
  authUser,
  checkAuth,
  signOut,
  changeUsername,
  changeProfileImage,
};
