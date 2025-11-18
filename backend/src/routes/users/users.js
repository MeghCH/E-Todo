const express = require("express");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../../middleware/auth");
const prisma = require("../../../prisma/prismaClient");

const router = express.Router();

router.get("/:identifier", authenticateToken, async (req, res) => {
  const { identifier } = req.params;

  try {
    let user = null;

    if (isNaN(identifier)) {
      user = await prisma.user.findUnique({
        where: { email: identifier },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          firstname: true,
          createdAt: true,
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: Number(identifier) },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          firstname: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      return res.status(404).json({ msg: "Not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      firstname: user.firstname,
      created_at: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, password, firstname, name, currentPassword } = req.body;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  if (email == null || password == null || firstname == null || name == null) {
    console.log("BODY RECU :", req.body);
    return res.status(400).json({ msg: "Bad parameter" });
  }

  try {
    if (!currentPassword || !currentPassword.trim()) {
      return res.status(400).json({ msg: "Mot de passe actuel obligatoire" });
    }

    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { password: true },
    });

    if (!existing) {
      return res.status(404).json({ msg: "Not found" });
    }

    const isValid = await bcrypt.compare(currentPassword, existing.password);
    if (!isValid) {
      return res.status(401).json({ msg: "Mot de passe actuel incorrect" });
    }

    let hashed = existing.password;
    if (password.trim() !== "") {
      hashed = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        password: hashed,
        name,
        firstname,
      },
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true,
        firstname: true,
        name: true,
      },
    });

    res.json({
      id: updated.id,
      email: updated.email,
      password: updated.password,
      created_at: updated.createdAt,
      firstname: updated.firstname,
      name: updated.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ msg: "Not found" });
  }

  try {
    await prisma.todo.deleteMany({
      where: { userId: Number(id) },
    });

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ msg: `Successfully deleted record number: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
