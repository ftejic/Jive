const express = require("express");
const {
  registerUser,
  authUser,
  checkAuth,
  getUsers,
  signOut,
  changeUsername,
  changeProfileImage
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getUsers);
router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(authUser);
router.route("/sign-out").delete(signOut);
router.route("/check-auth").get(checkAuth);
router.route("/change-username").patch(protect, changeUsername);
router.route("/change-profile-image").patch(protect, changeProfileImage);

module.exports = router;
