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
    const [todos] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE user_id = ? ORDER BY id DESC",
        [req.user.id]
      );
    res.json(todos);
  } catch (error) {
    return serverError(res, error);
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
  } catch (error) {
    return serverError(res, error);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, description, due_time, status } = req.body;

  if (!title || !description || !due_time) {
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    const finalStatus = status && status.trim() ? status : "not_started";

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, due_time, finalStatus, req.user.id]
      );

    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE id = ? AND user_id = ?",
        [result.insertId, req.user.id]
      );

    res.status(201).json(rows[0]);
  } catch (error) {
    return serverError(res, error);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_time, status } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, title, description, due_time, status FROM todo WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    const current = rows[0];

    const newTitle = title ?? current.title;
    const newDescription = description ?? current.description;
    const newDueTime = due_time ?? current.due_time;
    const newStatus = status ?? current.status;

    const [result] = await db.promise().query(
      `UPDATE todo 
         SET title = ?, description = ?, due_time = ?, status = ?
         WHERE id = ? AND user_id = ?`,
      [newTitle, newDescription, newDueTime, newStatus, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    const [updated] = await db
      .promise()
      .query(
        "SELECT id, title, description, created_at, due_time, status, user_id FROM todo WHERE id = ? AND user_id = ?",
        [id, req.user.id]
      );

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: error.sqlMessage || error.message || "Internal server error",
    });
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
  } catch (error) {
    return serverError(res, error);
  }
});

module.exports = router;
