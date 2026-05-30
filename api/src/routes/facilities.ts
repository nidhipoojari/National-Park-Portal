import { Router } from "express";
import { query, oracledb } from "../db";

const router = Router();

const TYPE_LABELS: Record<number, string> = {
  1: "entrance",
  2: "campsite",
  3: "tour",
  4: "parking",
};

// GET /api/facilities?parkId=101&type=2
router.get("/", async (req, res, next) => {
  try {
    const conditions: string[] = [];
    const binds: oracledb.BindParameters = {};

    if (req.query.parkId) {
      conditions.push("park_id = :parkId");
      binds.parkId = Number(req.query.parkId);
    }
    if (req.query.type) {
      conditions.push("facility_type = :type");
      binds.type = Number(req.query.type);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = await query<{ FACILITY_TYPE: number }>(
      `SELECT facility_id, facility_name, park_id, facility_type,
              daily_price, child_price, cancellation_fee
       FROM facility ${where}
       ORDER BY park_id, facility_type, facility_id`,
      binds
    );

    res.json(
      rows.map((r) => ({
        ...r,
        TYPE_LABEL: TYPE_LABELS[r.FACILITY_TYPE] ?? "unknown",
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
