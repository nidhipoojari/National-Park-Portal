import { Router } from "express";
import { callWithOutput, query, oracledb } from "../db";

const router = Router();

// GET /api/visitors/by-email?email=...  — resolve a visitor for login.
// Returns the visitor record (incl. is_admin) or 404 if not found.
router.get("/by-email", async (req, res, next) => {
  try {
    const email = String(req.query.email ?? "").trim();
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }
    const rows = await query<{
      VISITOR_ID: number;
      VISITOR_NAME: string;
      VISITOR_EMAIL: string;
      IS_ADMIN: number;
    }>(
      `SELECT visitor_id, visitor_name, visitor_email, is_admin
         FROM visitor
        WHERE LOWER(visitor_email) = LOWER(:email)`,
      { email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email } }
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No visitor found with that email" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/visitors  — add_visitor procedure
// body: { name, email, address, state, zipcode }
router.post("/", async (req, res, next) => {
  try {
    const { name, email, address, state, zipcode } = req.body ?? {};
    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }
    const output = await callWithOutput(
      `BEGIN add_visitor(:name, :email, :addr, :st, :zip); END;`,
      {
        name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: name },
        email: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email },
        addr: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: address ?? null },
        st: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: state ?? null },
        zip: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: zipcode ?? null },
      }
    );
    res.json({ output, message: output.join("\n") });
  } catch (err) {
    next(err);
  }
});

// GET /api/visitors/:name/transactions  — list_visitor_transactions
router.get("/:name/transactions", async (req, res, next) => {
  try {
    const output = await callWithOutput(
      `BEGIN list_visitor_transactions(:name); END;`,
      { name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.params.name } }
    );
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

export default router;
