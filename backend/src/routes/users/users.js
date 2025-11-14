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

    const [rows] = await db.promise().query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, name, currentPassword } = req.body;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  if (email == null || password == null || firstname == null || name == null) {
    console.log("BODY RECU :", req.body);
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    if (!currentPassword || !currentPassword.trim()) {
      return res.status(400).json({ msg: "Mot de passe actuel obligatoire" });
    }

    const [rows] = await db
      .promise()
      .query("SELECT password FROM user WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ msg: "Mot de passe actuel incorrect" });
    }

    let hashed = user.password;
    if (password.trim() !== "") {
      hashed = await bcrypt.hash(password.trim(), 10);
    }

    await db
      .promise()
      .query(
        "UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
        [email, hashed, name, firstname, id]
      );

    const [updated] = await db
      .promise()
      .query(
        "SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?",
        [id]
      );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  try {
    await db.promise().query("DELETE FROM todo WHERE user_id = ?", [id]);
    await db.promise().query("DELETE FROM user WHERE id = ?", [id]);

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
