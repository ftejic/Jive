const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  getChats,
  createChat,
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  addGroupAdmin,
  removeGroupAdmin,
  search,
  changeGroupImage,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, getChats);
router.route("/create").post(protect, createChat);
router.route("/group-create").post(protect, createGroupChat);
router.route("/group-delete").delete(protect, deleteGroupChat);
router.route("/group-rename").patch(protect, renameGroup);
router.route("/group-remove").patch(protect, removeFromGroup);
router.route("/group-add").patch(protect, addToGroup);
router.route("/group-add-admin").patch(protect, addGroupAdmin);
router.route("/group-remove-admin").patch(protect, removeGroupAdmin);
router.route("/group-change-image").patch(protect, changeGroupImage);
router.route("/search").post(protect, search);

module.exports = router;
