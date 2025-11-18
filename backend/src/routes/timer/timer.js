const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

function serverError(res, err) {
  console.error(err);
  return res.status(500).json({ msg: "Internalservererror" });
}

router.post("/start", authenticateToken, async (req, res) => {
  const { note } = req.body;

  try {
    const session = await prisma.timerSession.create({
      data: {
        userId: req.user.id,
        startTime: new Date(),
        note: note || null,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    return serverError(res, error);
  }
});

router.post("/stop", authenticateToken, async (req, res) => {
  try {
    const session = await prisma.timerSession.findFirst({
      where: {
        userId: req.user.id,
        endTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!session) {
      return res.status(400).json({ msg: "Nosessionactive" });
    }

    const endTime = new Date();
    const durationSeconds = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000
    );

    const updatedSession = await prisma.timerSession.update({
      where: { id: session.id },
      data: {
        endTime,
        duration: durationSeconds,
      },
    });

    res.json(updatedSession);
  } catch (error) {
    return serverError(res, error);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.timerSession.findMany({
      where: { userId: req.user.id },
      orderBy: {
        startTime: "desc",
      },
    });

    res.json(sessions);
  } catch (error) {
    return serverError(res, error);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.timerSession.deleteMany({
      where: {
        id: Number(id),
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ msg: "Notfound" });
    }

    res.json({ msg: `Successfullydeletedrecordnumber:${id}` });
  } catch (error) {
    return serverError(res, error);
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    await prisma.timerSession.deleteMany({
      where: { userId: req.user.id },
    });

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
    const sessions = await prisma.timerSession.findMany({
      include: {
        user: {
          select: {
            name: true,
            firstname: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      user_id: s.userId,
      start_time: s.startTime,
      end_time: s.endTime,
      duration: s.duration,
      note: s.note,
      name: s.user.name,
      firstname: s.user.firstname,
    }));

    res.json(formatted);
  } catch (error) {
    return serverError(res, error);
  }
});

module.exports = router;
