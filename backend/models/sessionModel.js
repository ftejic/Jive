const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: Date,
      expires: 0,
    },
  },
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
