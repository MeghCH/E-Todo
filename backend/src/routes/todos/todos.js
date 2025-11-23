const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

function normalizeStatus(status) {
  if (!status) return "not_started";

  const raw = status.trim();

  const allowed = ["not_started", "todo", "in_progress", "done"];
  if (allowed.includes(raw)) return raw;

  const mapHuman = {
    not_started: "not_started",
    in_progress: "in_progress",
    todo: "todo",
    done: "done",
  };

  return mapHuman[raw] || "not_started";
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { user_id: Number(req.user.id) },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        due_time: true,
        status: true,
        user_id: true,
      },
      orderBy: { id: "desc" },
    });

    res.json(
      todos.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        created_at: t.created_at,
        due_time: t.due_time,
        status: t.status,
        user_id: t.user_id,
      }))
    );
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await prisma.todo.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        due_time: true,
        status: true,
        user_id: true,
      },
    });

    if (!todo) return res.status(404).json({ msg: "Not found" });

    res.json({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      created_at: todo.created_at,
      due_time: todo.due_time,
      status: todo.status,
      user_id: todo.user_id,
    });
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
    const finalStatus = normalizeStatus(status);

    const dueDate = new Date(due_time);
    if (Number.isNaN(dueDate.getTime())) {
      return res.status(400).json({ msg: "Invalid due_time" });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        due_time: dueDate,
        status: finalStatus,
        user_id: Number(req.user.id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        due_time: true,
        status: true,
        user_id: true,
      },
    });

    res.status(201).json({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      created_at: todo.created_at,
      due_time: todo.due_time,
      status: todo.status,
      user_id: todo.user_id,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_time, status } = req.body;

  try {
    const existing = await prisma.todo.findFirst({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (!existing) return res.status(404).json({ msg: "Not found" });

    let newDueTime = existing.due_time;
    if (due_time !== undefined) {
      const parsed = new Date(due_time);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ msg: "Invalid due_time" });
      }
      newDueTime = parsed;
    }

    const updated = await prisma.todo.update({
      where: { id: existing.id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        due_time: newDueTime,
        status: status ? normalizeStatus(status) : existing.status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        due_time: true,
        status: true,
        user_id: true,
      },
    });

    res.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      created_at: updated.created_at,
      due_time: updated.due_time,
      status: updated.status,
      user_id: updated.user_id,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.todo.deleteMany({
      where: {
        id: Number(id),
        user_id: Number(req.user.id),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
