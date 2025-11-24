// backend/src/api.js
import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// Small helper for SELECTs
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
    res.status(500).json({
      status: "error",
      error: String(err.message || err),
    });
  }
});

/**
 * GET one user
 * GET /ms-api/user?username=demo
 * Returns: { username, Email, MobileNumber, DateOfBirth, DoctorsEmail }
 */
router.get("/user", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const rows = await q(
      `SELECT username,
              Email,
              MobileNumber,
              DateOfBirth,
              DoctorsEmail
       FROM users
       WHERE username = ?`,
      [username]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Normalize DateOfBirth to YYYY-MM-DD string (if it's a Date object)
    if (user.DateOfBirth instanceof Date) {
      user.DateOfBirth = user.DateOfBirth.toISOString().split("T")[0];
    }

    res.json(user);
  } catch (e) {
    console.error("GET /user error:", e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

/**
 * Update user
 * PUT /ms-api/user?username=demo
 * Body: { Email, MobileNumber, DateOfBirth, DoctorsEmail }
 */
router.put("/user", async (req, res) => {
  const { username } = req.query;
  const { Email, MobileNumber, DateOfBirth, DoctorsEmail } = req.body || {};

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE users
       SET Email = ?,
           MobileNumber = ?,
           DateOfBirth = ?,
           DoctorsEmail = ?
       WHERE username = ?`,
      [Email, MobileNumber, DateOfBirth, DoctorsEmail, username]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("PUT /user error:", e);
    res.status(500).json({ error: e.message || String(e) });
  }
});

/**
 * List symptoms
 * GET /ms-api/symptoms
 * Returns: [{ id, name }]
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
 * Returns: [{ id, date, hours, painScore, symptomName }]
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
 * Returns: ["YYYY-MM-DD", ...]
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
    res.json(rows.map((r) => r.date));
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
      [username, date, hours ?? 0, painScore ?? 0, symptomId]
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

/**
 * GET /ms-api/history/last-week?username=demo
 * Returns symptom history for the last 7 days (MySQL).
 */
router.get("/history/last-week", async (req, res) => {
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
         AND shl.date >= (CURDATE() - INTERVAL 7 DAY)
       ORDER BY shl.date DESC, shl.ID DESC`,
      [username]
    );

    res.json(rows);
  } catch (err) {
    console.error("history last-week error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/bloodpressure', async (req, res) => {
  try {
    const { username, systolic, diastolic, date } = req.body;

    // Basic validation
    if (!username || !systolic || !diastolic || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `
      INSERT INTO bloodpressure (username, systolic, diastolic, date)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      username, systolic, diastolic, date
    ]);

    res.json({
      message: "Blood pressure entry created",
      insertId: result.insertId || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


export default router;
