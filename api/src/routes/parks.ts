import { Router } from "express";
import { query } from "../db";

const router = Router();

// GET /api/parks  — all parks
router.get("/", async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT park_id, park_name, address, state, zipcode
       FROM park
       ORDER BY park_id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/parks/:id — one park with its facilities grouped by type
router.get("/:id", async (req, res, next) => {
  try {
    const parkId = Number(req.params.id);
    if (Number.isNaN(parkId)) {
      return res.status(400).json({ error: "Invalid park id" });
    }

    const parks = await query(
      `SELECT park_id, park_name, address, state, zipcode
       FROM park WHERE park_id = :id`,
      { id: parkId }
    );
    if (parks.length === 0) {
      return res.status(404).json({ error: "No such park" });
    }

    const facilities = await query(
      `SELECT facility_id, facility_name, facility_type,
              daily_price, child_price, cancellation_fee
       FROM facility
       WHERE park_id = :id
       ORDER BY facility_type, facility_id`,
      { id: parkId }
    );

    res.json({ park: parks[0], facilities });
  } catch (err) {
    next(err);
  }
});

export default router;
