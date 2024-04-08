const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Session = require("./sessionModel");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: null
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("remove", async function (next) {
  try {
    await Session.deleteMany({userId: this._id});
  } catch (error) {
    next(error)
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
