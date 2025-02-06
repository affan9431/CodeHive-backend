const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controller/announcementController");

// Announcement routes
router.post("/", createAnnouncement);
router.get("/:courseId", getAnnouncements);
router.get("/:id", getAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;
