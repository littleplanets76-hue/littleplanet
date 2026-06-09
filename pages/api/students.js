import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  try {
    const result = await pool.query(
      `SELECT id, full_name, gender, date_of_birth, age, class, blood_group, nationality, religion, medium, admission_id, student_unique_id, created_at FROM students ORDER BY id DESC`
    );
    res.status(200).json({ success: true, students: result.rows });
  } catch (err) {
    console.error("Students API Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
