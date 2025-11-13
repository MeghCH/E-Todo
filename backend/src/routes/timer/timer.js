const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internalservererror" });
}

router.post("/start", authenticateToken, async (req, res) => {
  const { note } = req.body;

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO timer_sessions (user_id, start_time, note) VALUES (?, NOW(), ?)",
        [req.user.id, note || null]
      );

    const [session] = await db
      .promise()
      .query("SELECT * FROM timer_sessions WHERE id = ?", [result.insertId]);

    res.status(201).json(session[0]);
  } catch (error) {
    return serverError(res, error);
  }
});

router.post("/stop", authenticateToken, async (req, res) => {
  try {
    const [activeSession] = await db
      .promise()
      .query(
        "SELECT * FROM timer_sessions WHERE user_id = ? AND end_time IS NULL ORDER BY start_time DESC LIMIT 1",
        [req.user.id]
      );

    if (activeSession.length === 0) {
      return res.status(400).json({ msg: "Nosessionactive" });
    }

    const session = activeSession[0];

    await db
      .promise()
      .query(
        "UPDATE timer_sessions SET end_time = NOW(), duration = TIMESTAMPDIFF(SECOND, start_time, NOW()) WHERE id = ?",
        [session.id]
      );

    const [updatedSession] = await db
      .promise()
      .query("SELECT * FROM timer_sessions WHERE id = ?", [session.id]);

    res.json(updatedSession[0]);
  } catch (error) {
    return serverError(res, error);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [sessions] = await db
      .promise()
      .query(
        "SELECT * FROM timer_sessions WHERE user_id = ? ORDER BY start_time DESC",
        [req.user.id]
      );

    res.json(sessions);
  } catch (error) {
    return serverError(res, error);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM timer_sessions WHERE id = ? AND user_id = ?", [
        id,
        req.user.id,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }

    res.json({ msg: `Successfullydeletedrecordnumber:${id}` });
  } catch (error) {
    return serverError(res, error);
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    await db
      .promise()
      .query("DELETE FROM timer_sessions WHERE user_id = ?", [req.user.id]);

    res.json({ msg: "Successfullydeletedallsessions" });
  } catch (error) {
    return serverError(res, error);
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    const [sessions] = await db.promise().query(
      `SELECT ts.*, u.name, u.firstname 
         FROM timer_sessions ts 
         JOIN user u ON ts.user_id = u.id 
         ORDER BY ts.start_time DESC`
    );

    res.json(sessions);
  } catch (error) {
    return serverError(res, error);
  }
});

module.exports = router;
