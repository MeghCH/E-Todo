const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?",
        [req.user.id]
      );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/todos", authenticateToken, async (req, res) => {
  try {
    const [todos] = await db
      .promise()
      .query("SELECT * FROM todo WHERE user_id = ?", [req.user.id]);

    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
