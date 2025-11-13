const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/:identifier", authenticateToken, async (req, res) => {
  const { identifier } = req.params;
  try {
    let query =
      "SELECT id, email, password, name, firstname, created_at FROM user WHERE ";
    let params = [];

    if (isNaN(identifier)) {
      query += "email = ?";
      params = [identifier];
    } else {
      query += "id = ?";
      params = [parseInt(identifier)];
    }

    const [users] = await db.promise().query(query, params);
    if (users.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, name } = req.body;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Notfound" });
  }

  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: "Badparameter" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        "UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
        [email, hashedPassword, name, firstname, id]
      );
    const [updatedUser] = await db
      .promise()
      .query(
        "SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?",
        [id]
      );
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Notfound" });
  }

  try {
    await db.promise().query("DELETE FROM todo WHERE user_id = ?", [id]);
    await db.promise().query("DELETE FROM user WHERE id = ?", [id]);
    res.json({ msg: `Successfullydeletedrecordnumber:${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

module.exports = router;
