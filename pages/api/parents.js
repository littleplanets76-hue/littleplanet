import { Pool } from "pg";
import { createPoolOptions } from "@/lib/postgresConfig";

const pool = new Pool(createPoolOptions());

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const parentId = Number(req.query.id || req.body?.id);

    if (!Number.isInteger(parentId) || parentId <= 0) {
      return res.status(400).json({ success: false, error: "Valid parent id is required" });
    }

    const { father_name, father_mobile, mother_name, mother_mobile } = req.body || {};
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `
          UPDATE public.parents
          SET father_name = $1,
              father_mobile = $2,
              mother_name = $3,
              mother_mobile = $4
          WHERE id = $5
          RETURNING id, father_name, father_mobile, mother_name, mother_mobile, created_at
        `,
        [father_name || null, father_mobile || null, mother_name || null, mother_mobile || null, parentId]
      );

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, error: "Parent not found" });
      }

      await client.query(
        `
          UPDATE public.admissions
          SET father_name = $1,
              father_mobile = $2,
              mother_name = $3,
              mother_mobile = $4
          WHERE parent_id = $5
        `,
        [father_name || null, father_mobile || null, mother_name || null, mother_mobile || null, parentId]
      );

      await client.query("COMMIT");
      return res.status(200).json({ success: true, parent: result.rows[0] });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Parents API Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    } finally {
      client.release();
    }
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  try {
    const result = await pool.query(
      `SELECT id, father_name, father_mobile, mother_name, mother_mobile, created_at FROM parents ORDER BY id DESC`
    );
    res.status(200).json({ success: true, parents: result.rows });
  } catch (err) {
    console.error("Parents API Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
