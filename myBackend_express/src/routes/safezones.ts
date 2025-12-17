import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { childId, name, latitude, longitude, radius } = req.body;

    if (!childId || !name || latitude === undefined || longitude === undefined || !radius) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const zone = await prisma.safeZone.create({
      data: {
        childId: Number(childId),
        name,
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radius)
      }
    });

    res.json({ success: true, zone });
  } catch (err) {
    console.error("Safe zone create error:", err);
    res.status(500).json({ error: "Failed to create safe zone" });
  }
});

// LIST ZONES FOR CHILD
router.get("/:childId", async (req, res) => {
  try {
    const childId = Number(req.params.childId);
    const zones = await prisma.safeZone.findMany({
      where: { childId },
      orderBy: { createdAt: "desc" }
    });
    res.json({ zones });
  } catch (err) {
    console.error("Safe zone fetch error:", err);
    res.status(500).json({ error: "Failed to load safe zones" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await prisma.safeZone.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Safe zone delete error:", err);
    res.status(500).json({ error: "Failed to delete safe zone" });
  }
});

export default router;
