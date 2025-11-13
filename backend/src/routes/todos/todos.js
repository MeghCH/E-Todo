const express = require("express");
const db = require("../../config/db");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [todos] = await db.promise().query("SELECT * FROM todo");
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [todos] = await db
      .promise()
      .query("SELECT * FROM todo WHERE id = ? AND user_id = ?", [
        id,
        req.user.id,
      ]);
    if (todos.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }
    res.json(todos[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { title, description, due_time, status, user_id } = req.body;

  if (!title || !description || !due_time || !user_id) {
    return res.status(400).json({ msg: "Badparameter" });
  }

  if (parseInt(user_id) !== req.user.id) {
    return res.status(403).json({ msg: "Notfound" });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, due_time, status || "not started", user_id]
      );
    const [newTodo] = await db
      .promise()
      .query("SELECT * FROM todo WHERE id = ?", [result.insertId]);
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_time, status, user_id } = req.body;

  try {
    const [existingTodo] = await db
      .promise()
      .query("SELECT user_id FROM todo WHERE id = ?", [id]);
    if (existingTodo.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }
    if (existingTodo[0].user_id !== req.user.id) {
      return res.status(403).json({ msg: "Notfound" });
    }

    await db
      .promise()
      .query(
        "UPDATE todo SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?",
        [title, description, due_time, status, user_id, id]
      );
    const [updatedTodo] = await db
      .promise()
      .query("SELECT * FROM todo WHERE id = ?", [id]);
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [existingTodo] = await db
      .promise()
      .query("SELECT user_id FROM todo WHERE id = ?", [id]);
    if (existingTodo.length === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }
    if (existingTodo[0].user_id !== req.user.id) {
      return res.status(403).json({ msg: "Notfound" });
    }

    await db.promise().query("DELETE FROM todo WHERE id = ?", [id]);
    res.json({ msg: `Successfullydeletedrecordnumber:${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internalservererror" });
  }
});

module.exports = router;
