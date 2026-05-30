import { Router } from "express";
import { callWithOutput, query, oracledb } from "../db";

const router = Router();

// GET /api/transactions  — raw list (direct read for tables/admin views)
router.get("/", async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT transaction_id, visitor_id, transaction_type, facility_id,
              TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
              number_of_days, num_adults, num_children, total_price, status
       FROM transaction
       ORDER BY transaction_id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions/:id/cancel  — cancel_transaction
router.post("/:id/cancel", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid transaction id" });
    }
    const output = await callWithOutput(`BEGIN cancel_transaction(:id); END;`, {
      id: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
    });
    res.json({ output, message: output.join("\n") });
  } catch (err) {
    next(err);
  }
});

export default router;
