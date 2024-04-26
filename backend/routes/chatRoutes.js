const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  getChats,
  createGroupChat,
  deleteGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  addGroupAdmin,
  removeGroupAdmin,
  search,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, getChats);
router.route("/group-create").post(protect, createGroupChat);
router.route("/group-delete").delete(protect, deleteGroupChat);
router.route("/group-rename").put(protect, renameGroup);
router.route("/group-remove").put(protect, removeFromGroup);
router.route("/group-add").put(protect, addToGroup);
router.route("/group-add-admin").put(protect, addGroupAdmin);
router.route("/group-remove-admin").put(protect, removeGroupAdmin);
router.route("/search").post(protect, search);

module.exports = router;
