const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [users] = await db
      .promise()
      .query(
        "SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?",
        [req.user.id]
      );
    if (users.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.get("/todos", authenticateToken, async (req, res) => {
  try {
    const [todos] = await db
      .promise()
      .query("SELECT * FROM todo WHERE user_id = ?", [req.user.id]);
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

module.exports = router;
