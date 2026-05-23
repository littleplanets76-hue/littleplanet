import { Pool } from "pg";
import { dummyAdmissions } from "@/lib/dummyData";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  try {
    const result = await pool.query(
      `SELECT id, father_name, father_mobile, mother_name, mother_mobile, created_at FROM parents ORDER BY id DESC`
    );
    res.status(200).json({ success: true, parents: result.rows });
  } catch (err) {
    // Return dummy data for demo/development
    const dummyParents = dummyAdmissions.map((a, idx) => ({
      id: a.id,
      father_name: a.father_name,
      father_mobile: `9876543${String(idx).padStart(3, '0')}`,
      mother_name: "Mother " + a.student_name,
      mother_mobile: `8765432${String(idx).padStart(3, '0')}`,
      created_at: a.admission_date,
    }));
    
    res.status(200).json({ success: true, isDemo: true, parents: dummyParents });
  }
}
