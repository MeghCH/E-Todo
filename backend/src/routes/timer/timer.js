const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

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
    console.error(error);
    res.status(500).json({ message: "Erreur démarrage timer" });
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
      return res.status(400).json({ message: "Aucune session active" });
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
    console.error(error);
    res.status(500).json({ message: "Erreur arrêt timer" });
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
    console.error(error);
    res.status(500).json({ message: "Erreur récupération historique" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db
      .promise()
      .query("SELECT user_id FROM timer_sessions WHERE id = ?", [id]);
    if (existing.length === 0 || existing[0].user_id !== req.user.id) {
      return res.status(404).json({ message: "Session non trouvée" });
    }
    await db.promise().query("DELETE FROM timer_sessions WHERE id = ?", [id]);
    res.json({ message: "Session supprimée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur suppression session" });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    await db
      .promise()
      .query("DELETE FROM timer_sessions WHERE user_id = ?", [req.user.id]);
    res.json({ message: "Toutes les sessions supprimées" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur vidage sessions" });
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Accès refusé" });
  }
  try {
    const [sessions] = await db
      .promise()
      .query(
        "SELECT ts.*, u.name, u.firstname FROM timer_sessions ts JOIN users u ON ts.user_id = u.id ORDER BY ts.start_time DESC"
      );
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur récupération historique complet" });
  }
});

module.exports = router;
