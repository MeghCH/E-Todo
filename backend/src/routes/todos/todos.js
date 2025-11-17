const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE user_id = ? ORDER BY id DESC",
        [req.user.id]
      );
    res.json(rows);
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );
    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, description, due_time, status } = req.body;

  if (!title || !description || !due_time) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const finalStatus = status?.trim() || "not_started";

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, due_time, finalStatus, req.user.id]
      );

    const [todo] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE id = ? AND user_id = ?",
        [result.insertId, req.user.id]
      );

    res.status(201).json(todo[0]);
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_time, status } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM todo WHERE id = ? AND user_id = ?", [
        id,
        req.user.id,
      ]);

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    const current = rows[0];
    const newTitle = title ?? current.title;
    const newDesc = description ?? current.description;
    const newDue = due_time ?? current.due_time;
    const newStatus = status ?? current.status;

    await db
      .promise()
      .query(
        "UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ? AND user_id = ?",
        [newTitle, newDesc, newDue, newStatus, id, req.user.id]
      );

    const [updated] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );

    res.json(updated[0]);
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM todo WHERE id = ? AND user_id = ?", [
        id,
        req.user.id,
      ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ msg: "Not found" });

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
