const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, firstname } = req.body;

  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: "Badparameter" });
  }

  try {
    const [existingUser] = await db
      .promise()
      .query("SELECT id FROM user WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ msg: "Accountalreadyexists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, name, firstname]
      );

    const token = jwt.sign({ id: result.insertId, email }, process.env.SECRET, {
      expiresIn: "1h",
    });

    const [userInfo] = await db
      .promise()
      .query("SELECT id, email, name, firstname, role FROM user WHERE id = ?", [
        result.insertId,
      ]);

    res.status(201).json({ token, user: userInfo[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Badparameter" });
  }

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM user WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ msg: "InvalidCredentials" });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: "InvalidCredentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    const [userInfo] = await db
      .promise()
      .query("SELECT id, email, name, firstname, role FROM user WHERE id = ?", [
        user.id,
      ]);

    res.json({ token, user: userInfo[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

module.exports = router;
