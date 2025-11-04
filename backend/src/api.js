import { Router } from "express";
import { pool } from "./db.js";

const router = Router();

// GET /ms-api/symptoms
router.get("/symptoms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT ID as id, name FROM symptoms ORDER BY ID");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /ms-api/history?username=demo
router.get("/history", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });
  try {
    const [rows] = await pool.query(
      `SELECT h.ID as id, h.date, h.hours, h.painScore, h.symptomId, s.name as symptomName
       FROM symptomshistorylog h
       JOIN symptoms s ON s.ID = h.symptomId
       WHERE h.username = ?
       ORDER BY h.date DESC, h.ID DESC`, [username]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /ms-api/log
router.post("/log", async (req, res) => {
  const { username, date, hours, painScore, symptomId } = req.body || {};
  for (const k of ["username","date","hours","painScore","symptomId"]) {
    if (req.body?.[k] === undefined) return res.status(400).json({ error: `missing ${k}` });
  }
  try {
    const [r] = await pool.query(
      `INSERT INTO symptomshistorylog (username, date, hours, painScore, symptomId)
       VALUES (?,?,?,?,?)`,
      [username, date, hours, painScore, symptomId]
    );
    res.json({ ok: true, id: r.insertId });
  } catch (e) { res.status(400).json({ ok:false, error: e.message }); }
});

// POST /ms-api/rating
router.post("/rating", async (req, res) => {
  const { username, date, rating } = req.body || {};
  for (const k of ["username","date","rating"]) {
    if (req.body?.[k] === undefined) return res.status(400).json({ error: `missing ${k}` });
  }
  try {
    const [r] = await pool.query(
      `INSERT INTO dailyrating (Username, Date, Rating) VALUES (?,?,?)`,
      [username, date, rating]
    );
    res.json({ ok: true, daily_id: r.insertId });
  } catch (e) { res.status(400).json({ ok:false, error: e.message }); }
});

// GET /ms-api/dates?username=demo
router.get("/dates", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT date FROM symptomshistorylog WHERE username=? ORDER BY date DESC",
      [username]
    );
    res.json(rows.map(r => r.date));
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// ---------------- USERS API ----------------




router.get("/user", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "username required" });

  try {
    const [rows] = await pool.query(
      "SELECT username, Password, Email, MobileNumber, DateOfBirth, DoctorsEmail FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // date format
    if (user.DateOfBirth) {
      user.DateOfBirth = user.DateOfBirth.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    
    res.json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// PUT /ms-api/user?username=demo
router.put("/user", async (req, res) => {
  const { username } = req.query;
  const { Password, Email, MobileNumber, DateOfBirth, DoctorsEmail } = req.body;
  if (!username) return res.status(400).json({ error: "username required" });

  try {
    const [result] = await pool.query(
      `UPDATE users 
       SET Password = ?, Email = ?, MobileNumber = ?, DateOfBirth = ?, DoctorsEmail = ?
       WHERE username = ?`,
      [Password, Email, MobileNumber, DateOfBirth, DoctorsEmail, username]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;
