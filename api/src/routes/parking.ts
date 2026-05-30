import { Router } from "express";
import { callWithOutput, oracledb } from "../db";

const router = Router();

// GET /api/parking/by-park/:parkName  — list_parking_lots
router.get("/by-park/:parkName", async (req, res, next) => {
  try {
    const output = await callWithOutput(`BEGIN list_parking_lots(:p); END;`, {
      p: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.params.parkName },
    });
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/parking/:facilityId/status  — update_parking_status
// body: { spotsTaken }
router.patch("/:facilityId/status", async (req, res, next) => {
  try {
    const facilityId = Number(req.params.facilityId);
    const { spotsTaken } = req.body ?? {};
    if (Number.isNaN(facilityId) || spotsTaken === undefined) {
      return res
        .status(400)
        .json({ error: "valid facilityId and spotsTaken are required" });
    }
    const output = await callWithOutput(
      `BEGIN update_parking_status(:fid, :spots); END;`,
      {
        fid: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: facilityId },
        spots: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(spotsTaken) },
      }
    );
    res.json({ output, message: output.join("\n") });
  } catch (err) {
    next(err);
  }
});

export default router;
