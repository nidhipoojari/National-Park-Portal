import { Router } from "express";
import { callWithOutput, oracledb } from "../db";

const router = Router();

// GET /api/stats?start=YYYY-MM-DD&end=YYYY-MM-DD  — statistics_report
router.get("/", async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "start and end are required" });
    }
    const output = await callWithOutput(
      `BEGIN statistics_report(TO_DATE(:s, 'YYYY-MM-DD'), TO_DATE(:e, 'YYYY-MM-DD')); END;`,
      {
        s: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(start) },
        e: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(end) },
      }
    );
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

export default router;
