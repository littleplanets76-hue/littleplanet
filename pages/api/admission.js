import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureFeePaymentsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.fee_payments (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      admission_id INTEGER NOT NULL REFERENCES public.admissions(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
      fee_type VARCHAR(50) NOT NULL,
      receipt_no VARCHAR(50) UNIQUE NOT NULL,
      payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
      amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
      payment_mode VARCHAR(30) NOT NULL DEFAULT 'Cash',
      reference_no VARCHAR(100),
      collected_by VARCHAR(100),
      remarks TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function cleanValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const result = await pool.query(
        `
        SELECT 
          id,
          student_name,
          gender,
          date_of_birth,
          age,
          blood_group,
          aadhar_last4,
          nationality,
          religion,
          class_applying_for,
          previous_school_name,
          previous_class,
          transfer_certificate,
          medium,
          program,
          father_name,
          father_mobile,
          father_occupation,
          mother_name,
          mother_mobile,
          mother_occupation,
          guardian_name,
          mother_aadhar_last4,
          mother_bank_account,
          bank_name,
          branch_name,
          ifsc_code,
          address,
          door_no,
          street,
          city,
          village,
          pin_code,
          emergency_contact,
          admission_status,
          created_at,
          parent_id,
          admission_fee_mode,
          fees,
          discount,
          final_fee
        FROM public.admissions
        ORDER BY created_at DESC, id DESC
        `
      );

      return res.status(200).json({
        success: true,
        admissions: result.rows,
      });
    }

    if (req.method === "DELETE") {
      const admissionId = Number(req.query.id);

      if (!Number.isInteger(admissionId) || admissionId <= 0) {
        return res.status(400).json({
          success: false,
          error: "Valid admission id is required",
        });
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const admissionResult = await client.query(
          "SELECT id, parent_id FROM public.admissions WHERE id = $1 FOR UPDATE",
          [admissionId]
        );

        const admission = admissionResult.rows[0];

        if (!admission) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            error: "Admission not found",
          });
        }

        await client.query("DELETE FROM public.fee_payments WHERE admission_id = $1", [admissionId]);
        await client.query("DELETE FROM public.students WHERE admission_id = $1", [admissionId]);
        await client.query("DELETE FROM public.admissions WHERE id = $1", [admissionId]);

        if (admission.parent_id) {
          await client.query(
            `
              DELETE FROM public.parents p
              WHERE p.id = $1
                AND NOT EXISTS (
                  SELECT 1
                  FROM public.admissions a
                  WHERE a.parent_id = p.id
                )
            `,
            [admission.parent_id]
          );
        }

        await client.query("COMMIT");

        return res.status(200).json({
          success: true,
          deletedAdmissionId: admissionId,
          deletedParentId: admission.parent_id || null,
        });
      } catch (deleteError) {
        await client.query("ROLLBACK");
        throw deleteError;
      } finally {
        client.release();
      }
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed",
      });
    }

    const body = req.body;

    const fees = cleanNumber(body.fees);
    const discount = cleanNumber(body.discount);

    // discount is percentage
    const discountAmount = Math.round((fees * discount) / 100);
    const finalFee = Math.max(fees - discountAmount, 0);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await ensureFeePaymentsTable(client);

      const parentResult = await client.query(
        `
          INSERT INTO public.parents (
            father_name,
            father_mobile,
            mother_name,
            mother_mobile
          ) VALUES ($1, $2, $3, $4)
          RETURNING id;
        `,
        [
          cleanValue(body.father_name),
          cleanValue(body.father_mobile),
          cleanValue(body.mother_name),
          cleanValue(body.mother_mobile),
        ]
      );

      const parent = parentResult.rows[0];

      const admissionResult = await client.query(
        `
          INSERT INTO public.admissions (
            student_name,
            gender,
            date_of_birth,
            age,
            blood_group,
            aadhar_last4,
            nationality,
            religion,

            class_applying_for,
            previous_school_name,
            previous_class,
            transfer_certificate,
            medium,
            program,
            admission_fee_mode,

            fees,
            discount,
            final_fee,

            father_name,
            father_mobile,
            father_occupation,

            mother_name,
            mother_mobile,
            mother_occupation,

            guardian_name,

            mother_aadhar_last4,
            mother_bank_account,
            bank_name,
            branch_name,
            ifsc_code,

            address,
            door_no,
            street,
            city,
            village,
            pin_code,
            emergency_contact,
            parent_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,

            $9, $10, $11, $12, $13, $14, $15,

            $16, $17, $18,

            $19, $20, $21,

            $22, $23, $24,

            $25,

            $26, $27, $28, $29, $30,

            $31, $32, $33, $34, $35, $36, $37, $38
          )
          RETURNING *;
        `,
        [
          cleanValue(body.student_name),
          cleanValue(body.gender),
          cleanValue(body.dob),
          cleanValue(body.age),
          cleanValue(body.blood_group),
          cleanValue(body.aadhar),
          cleanValue(body.nationality),
          cleanValue(body.religion),

          cleanValue(body.class_applying),
          cleanValue(body.previous_school),
          cleanValue(body.previous_class),
          body.tc === "Yes" ? true : body.tc === "No" ? false : null,
          cleanValue(body.medium),
          cleanValue(body.program),
          cleanValue(body.admission_fee_mode),

          fees,
          discount,
          finalFee,

          cleanValue(body.father_name),
          cleanValue(body.father_mobile),
          cleanValue(body.father_occupation),

          cleanValue(body.mother_name),
          cleanValue(body.mother_mobile),
          cleanValue(body.mother_occupation),

          cleanValue(body.guardian_name),

          cleanValue(body.mother_aadhar),
          cleanValue(body.bank_account),
          cleanValue(body.bank_name),
          cleanValue(body.branch),
          cleanValue(body.ifsc),

          cleanValue(body.address),
          cleanValue(body.door_no),
          cleanValue(body.street),
          cleanValue(body.city),
          cleanValue(body.village),
          cleanValue(body.pin_code),
          cleanValue(body.emergency),
          parent.id,
        ]
      );

      const admission = admissionResult.rows[0];

      const studentResult = await client.query(
        `
          INSERT INTO public.students (
            full_name,
            gender,
            date_of_birth,
            age,
            class,
            blood_group,
            nationality,
            religion,
            medium,
            admission_id,
            student_unique_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id;
        `,
        [
          cleanValue(body.student_name),
          cleanValue(body.gender),
          cleanValue(body.dob),
          cleanValue(body.age),
          cleanValue(body.class_applying),
          cleanValue(body.blood_group),
          cleanValue(body.nationality),
          cleanValue(body.religion),
          cleanValue(body.medium),
          admission.id,
          `STU-${admission.id}`,
        ]
      );

      const student = studentResult.rows[0];

      const feePaymentResult = await client.query(
        `
          INSERT INTO public.fee_payments (
            admission_id,
            student_id,
            fee_type,
            receipt_no,
            payment_date,
            amount_paid,
            payment_mode,
            reference_no,
            collected_by,
            remarks
          ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8, $9)
          RETURNING *;
        `,
        [
          admission.id,
          student.id,
          "Admission Confirmation Fee",
          `ADM-${admission.id}-${student.id}`,
          2000,
          cleanValue(body.admission_fee_mode) || "Cash",
          null,
          cleanValue(body.father_name) || cleanValue(body.student_name) || "Admission Desk",
          "Initial admission payment",
        ]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        data: {
          ...admission,
          parent_id: parent.id,
          fee_payment: feePaymentResult.rows[0],
        },
      });
    } catch (transactionError) {
      await client.query("ROLLBACK");
      throw transactionError;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Admission API Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
