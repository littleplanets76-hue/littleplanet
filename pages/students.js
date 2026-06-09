import React, { useEffect, useMemo, useState } from "react";
import StudentsTable from "../components/StudentsTable";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/students" });

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      });
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) =>
      [
        student.id,
        student.full_name,
        student.gender,
        student.age,
        student.class,
        student.blood_group,
        student.nationality,
        student.religion,
        student.medium,
        student.admission_id,
        student.student_unique_id,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [students, search]);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="mt-1 text-sm text-slate-500">{filteredStudents.length} of {students.length} records shown</p>
        </div>
        <label className="w-full max-w-md">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students by name, class, ID, or details"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <StudentsTable students={filteredStudents} onEdit={setEditingStudent} />
      )}

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      {editingStudent && (
        <StudentEditModal
          student={editingStudent}
          saving={saving}
          onClose={() => setEditingStudent(null)}
          onSave={async (form) => {
            setSaving(true);
            setError("");

            try {
              const response = await fetch(`/api/students?id=${editingStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(data.error || "Unable to update student");
              }

              setStudents((current) =>
                current.map((item) => (item.id === data.student.id ? data.student : item))
              );
              setEditingStudent(null);
            } catch (saveError) {
              setError(saveError.message || "Unable to update student");
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </div>
  );
}

function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function StudentEditModal({ student, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    full_name: student.full_name || "",
    gender: student.gender || "",
    date_of_birth: toDateInput(student.date_of_birth),
    age: student.age || "",
    class: student.class || "",
    blood_group: student.blood_group || "",
    nationality: student.nationality || "",
    religion: student.religion || "",
    medium: student.medium || "",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-black text-slate-900">Edit student</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["full_name", "Full name", "text"],
            ["gender", "Gender", "text"],
            ["date_of_birth", "Date of birth", "date"],
            ["age", "Age", "number"],
            ["class", "Class", "text"],
            ["blood_group", "Blood group", "text"],
            ["nationality", "Nationality", "text"],
            ["religion", "Religion", "text"],
            ["medium", "Medium", "text"],
          ].map(([name, label, type]) => (
            <label key={name} className="text-sm font-semibold text-slate-700">
              {label}
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={updateField}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            Cancel
          </button>
          <button disabled={saving} className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
