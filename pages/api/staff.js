import { Pool } from "pg";
import { dummyPayroll } from "@/lib/dummyData";

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

if (!global.pgPool) {
  global.pgPool = pool;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await pool.query(`
        SELECT
          id,
          staff_code,
          full_name,
          gender,
          mobile,
          email,
          staff_type,
          designation,
          department,
          subject,
          classes_handling,
          qualification,
          experience_years,
          joining_date,
          employment_type,
          salary_type,
          monthly_salary,
          work_status,
          photo_url,
          created_at
        FROM public.staff
        ORDER BY id DESC
      `);

      return res.status(200).json({
        success: true,
        staff: result.rows,
      });
    }

    if (req.method === "POST") {
      const {
        staff_code,
        full_name,
        gender,
        date_of_birth,
        age,
        blood_group,
        mobile,
        alternate_mobile,
        email,
        address,
        aadhar_last4,
        pan_number,
        photo_url,
        staff_type,
        designation,
        department,
        subject,
        classes_handling,
        qualification,
        experience_years,
        joining_date,
        employment_type,
        salary_type,
        monthly_salary,
        work_status,
        bank_account_name,
        bank_name,
        bank_branch,
        bank_account_number,
        ifsc_code,
        upi_id,
        has_login_access,
        login_account_id,
        emergency_contact_name,
        emergency_contact_mobile,
        notes,
      } = req.body;

      if (!full_name) {
        return res.status(400).json({
          success: false,
          error: "Staff full name is required",
        });
      }

      const result = await pool.query(
        `
        INSERT INTO public.staff (
          staff_code,
          full_name,
          gender,
          date_of_birth,
          age,
          blood_group,
          mobile,
          alternate_mobile,
          email,
          address,
          aadhar_last4,
          pan_number,
          photo_url,
          staff_type,
          designation,
          department,
          subject,
          classes_handling,
          qualification,
          experience_years,
          joining_date,
          employment_type,
          salary_type,
          monthly_salary,
          work_status,
          bank_account_name,
          bank_name,
          bank_branch,
          bank_account_number,
          ifsc_code,
          upi_id,
          has_login_access,
          login_account_id,
          emergency_contact_name,
          emergency_contact_mobile,
          notes
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
          $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
          $31,$32,$33,$34,$35,$36
        )
        RETURNING *
        `,
        [
          staff_code || null,
          full_name,
          gender || null,
          date_of_birth || null,
          age || null,
          blood_group || null,
          mobile || null,
          alternate_mobile || null,
          email || null,
          address || null,
          aadhar_last4 || null,
          pan_number || null,
          photo_url || null,
          staff_type || "Teaching",
          designation || null,
          department || null,
          subject || null,
          classes_handling || null,
          qualification || null,
          experience_years || null,
          joining_date || null,
          employment_type || "Permanent",
          salary_type || "Monthly",
          monthly_salary || 0,
          work_status || "Active",
          bank_account_name || null,
          bank_name || null,
          bank_branch || null,
          bank_account_number || null,
          ifsc_code || null,
          upi_id || null,
          has_login_access || false,
          login_account_id || null,
          emergency_contact_name || null,
          emergency_contact_mobile || null,
          notes || null,
        ]
      );

      return res.status(201).json({
        success: true,
        staff: result.rows[0],
      });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Staff id is required",
        });
      }

      // Better than hard delete: make staff inactive
      const result = await pool.query(
        `
        UPDATE public.staff
        SET 
          work_status = 'Inactive',
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, full_name, work_status
        `,
        [Number(id)]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Staff not found",
        });
      }

      return res.status(200).json({
        success: true,
        staff: result.rows[0],
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (err) {
    console.error("Staff API Error:", err);

    // Return dummy data for demo/development when database is unavailable
    if (req.method === "GET") {
      const dummyStaff = dummyPayroll.map((p, idx) => ({
        id: p.id,
        staff_code: `STF${String(p.id).padStart(4, '0')}`,
        full_name: p.staff_name,
        gender: "Male",
        mobile: `9876543${String(idx).padStart(3, '0')}`,
        email: `${p.staff_name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
        staff_type: "Teaching",
        designation: p.position,
        department: "Education",
        subject: "Various",
        classes_handling: "Multiple",
        qualification: "B.Ed/M.Sc",
        experience_years: 5,
        joining_date: "2019-06-01",
        employment_type: "Permanent",
        salary_type: "Monthly",
        monthly_salary: p.gross_salary,
        work_status: "Active",
      }));

      return res.status(200).json({
        success: true,
        isDemo: true,
        staff: dummyStaff,
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}