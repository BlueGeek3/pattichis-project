// backend/src/api.js
import express from "express";
import { pool } from "./db.js";

const router = express.Router();

async function q(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * Health check
 * GET /ms-api/health
 */
router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    console.error("health error:", err);
    res.status(500).json({ status: "error", error: String(err.message || err) });
  }
});

/**
 * List symptoms
 * GET /ms-api/symptoms
 */
router.get("/symptoms", async (_req, res) => {
  try {
    const rows = await q(
      "SELECT ID AS id, name FROM symptoms ORDER BY ID ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("symptoms error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * History entries for a user
 * GET /ms-api/history?username=demo
 * Uses:
 *   symptomshistorylog(username,date,hours,painScore,ID,symptomId)
 *   symptoms(ID,name)
 */
router.get("/history", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  try {
    const rows = await q(
      `SELECT
         shl.ID          AS id,
         shl.date        AS date,
         shl.hours       AS hours,
         shl.painScore   AS painScore,
         s.name          AS symptomName
       FROM symptomshistorylog shl
       JOIN symptoms s ON shl.symptomId = s.ID
       WHERE shl.username = ?
       ORDER BY shl.date DESC, shl.ID DESC`,
      [username]
    );
    res.json(rows);
  } catch (err) {
    console.error("history error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * Distinct dates that have logs for a user
 * GET /ms-api/dates?username=demo
 */
router.get("/dates", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  try {
    const rows = await q(
      `SELECT DISTINCT DATE_FORMAT(date, '%Y-%m-%d') AS date
       FROM symptomshistorylog
       WHERE username = ?
       ORDER BY date DESC`,
      [username]
    );
    res.json(rows.map(r => r.date));
  } catch (err) {
    console.error("dates error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * Create a symptom log
 * POST /ms-api/log
 * body: { username, date, hours, painScore, symptomId }
 */
router.post("/log", async (req, res) => {
  const { username, date, hours, painScore, symptomId } = req.body || {};

  if (!username || !date || !symptomId) {
    return res
      .status(400)
      .json({ error: "username, date and symptomId are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO symptomshistorylog
         (username, date, hours, painScore, symptomId)
       VALUES (?, ?, ?, ?, ?)`,
      [
        username,
        date,
        hours ?? 0,
        painScore ?? 0,
        symptomId,
      ]
    );

    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error("log error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * Create a daily rating
 * POST /ms-api/rating
 * body: { username, date, rating }
 */
router.post("/rating", async (req, res) => {
  const { username, date, rating } = req.body || {};

  if (!username || !date || rating == null) {
    return res
      .status(400)
      .json({ error: "username, date and rating are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO dailyrating (Username, Date, Rating)
       VALUES (?, ?, ?)`,
      [username, date, rating]
    );

    res.json({ ok: true, daily_id: result.insertId });
  } catch (err) {
    console.error("rating error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
