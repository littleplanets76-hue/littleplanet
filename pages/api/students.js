import { Pool } from "pg";
import { dummyStudents } from "@/lib/dummyData";

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
    // Return dummy data for demo/development
    return res.status(200).json({
      success: true,
      isDemo: true,
      students: dummyStudents.map(s => ({
        id: s.id,
        full_name: s.name,
        gender: "Male",
        class: s.class,
        status: s.status,
      })),
    });
  }
}
