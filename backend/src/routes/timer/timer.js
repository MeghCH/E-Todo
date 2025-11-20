const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internal server error" });
}

router.get("/", authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.timer_sessions.findMany({
      where: { user_id: Number(req.user.id) },
      select: {
        id: true,
        user_id: true,
        start_time: true,
        end_time: true,
        duration: true,
        note: true,
      },
      orderBy: { start_time: "desc" },
    });

    res.json(
      sessions.map((s) => ({
        id: s.id,
        user_id: s.user_id,
        start_time: s.start_time,
        end_time: s.end_time,
        duration: s.duration,
        note: s.note,
      }))
    );
  } catch (err) {
    return serverError(res, err);
  }
});

router.post("/start", authenticateToken, async (req, res) => {
  const { note } = req.body;

  try {
    const session = await prisma.timer_sessions.create({
      data: {
        user_id: Number(req.user.id),
        start_time: new Date(),
        note: note || null,
      },
      select: {
        id: true,
        user_id: true,
        start_time: true,
        end_time: true,
        duration: true,
        note: true,
      },
    });

    res.status(201).json({
      id: session.id,
      user_id: session.user_id,
      start_time: session.start_time,
      end_time: session.end_time,
      duration: session.duration,
      note: session.note,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

// POST /timer/stop  → stoppe la dernière session en cours
router.post("/stop", authenticateToken, async (req, res) => {
  try {
    const session = await prisma.timer_sessions.findFirst({
      where: {
        user_id: Number(req.user.id),
        end_time: null,
      },
      orderBy: {
        start_time: "desc",
      },
    });

    if (!session) {
      return res.status(400).json({ msg: "No session active" });
    }

    const endTime = new Date();
    const durationSeconds = Math.floor(
      (endTime.getTime() - session.start_time.getTime()) / 1000
    );

    const updated = await prisma.timer_sessions.update({
      where: { id: session.id },
      data: {
        end_time: endTime,
        duration: durationSeconds,
      },
      select: {
        id: true,
        user_id: true,
        start_time: true,
        end_time: true,
        duration: true,
        note: true,
      },
    });

    res.json({
      id: updated.id,
      user_id: updated.user_id,
      start_time: updated.start_time,
      end_time: updated.end_time,
      duration: updated.duration,
      note: updated.note,
    });
  } catch (err) {
    return serverError(res, err);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.timer_sessions.deleteMany({
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

router.delete("/", authenticateToken, async (req, res) => {
  try {
    await prisma.timer_sessions.deleteMany({
      where: { user_id: Number(req.user.id) },
    });

    res.json({ msg: "Successfully deleted all sessions" });
  } catch (err) {
    return serverError(res, err);
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    const sessions = await prisma.timer_sessions.findMany({
      include: {
        user: {
          select: {
            name: true,
            firstname: true,
          },
        },
      },
      orderBy: {
        start_time: "desc",
      },
    });

    res.json(
      sessions.map((s) => ({
        id: s.id,
        user_id: s.user_id,
        start_time: s.start_time,
        end_time: s.end_time,
        duration: s.duration,
        note: s.note,
        name: s.user.name,
        firstname: s.user.firstname,
      }))
    );
  } catch (err) {
    return serverError(res, err);
  }
});

module.exports = router;
