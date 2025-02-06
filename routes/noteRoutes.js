const express = require("express");
const router = express.Router();

const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,
} = require("../controller/noteController");

// Note routes
router.post("/", createNote);
router.get("/:userId/:courseId", getNotes);
router.get("/notes/:id", getNote);
router.patch("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);
router.get("/notes/search", searchNotes);

module.exports = router;
