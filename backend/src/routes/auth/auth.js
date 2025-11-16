const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, firstname } = req.body;

  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const [existing] = await db
      .promise()
      .query("SELECT id FROM user WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ msg: "Account already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)",
        [email, hashed, name, firstname]
      );

    const token = jwt.sign({ id: result.insertId, email }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const [rows] = await db
      .promise()
      .query(
        "SELECT id, email, name, firstname, role, created_at FROM user WHERE id = ?",
        [result.insertId]
      );

    res.status(201).json({ token, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM user WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    const [rows] = await db
      .promise()
      .query(
        "SELECT id, email, name, firstname, role, created_at FROM user WHERE id = ?",
        [user.id]
      );

    res.json({ token, user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
