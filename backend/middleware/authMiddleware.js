const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");

const protect = asyncHandler(async (req, res, next) => {
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

  req.user = user;
  next();
});

module.exports = protect;
