const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        firstname: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      firstname: user.firstname,
      created_at: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/todos", authenticateToken, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        dueTime: true,
        status: true,
        userId: true,
      },
      orderBy: { id: "desc" },
    });

    res.json(
      todos.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        created_at: t.createdAt,
        due_time: t.dueTime,
        status: t.status,
        user_id: t.userId,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
