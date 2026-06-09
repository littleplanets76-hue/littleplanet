import React, { useEffect, useMemo, useState } from "react";
import ParentsTable from "../components/ParentsTable";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/parents" });

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingParent, setEditingParent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/parents")
      .then((res) => res.json())
      .then((data) => {
        setParents(data.parents || []);
        setLoading(false);
      });
  }, []);

  const filteredParents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return parents;
    }

    return parents.filter((parent) =>
      [
        parent.id,
        parent.father_name,
        parent.father_mobile,
        parent.mother_name,
        parent.mother_mobile,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [parents, search]);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parents</h1>
          <p className="mt-1 text-sm text-slate-500">{filteredParents.length} of {parents.length} records shown</p>
        </div>
        <label className="w-full max-w-md">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search parents by name, mobile, or ID"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </label>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ParentsTable parents={filteredParents} onEdit={setEditingParent} />
      )}

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      {editingParent && (
        <ParentEditModal
          parent={editingParent}
          saving={saving}
          onClose={() => setEditingParent(null)}
          onSave={async (form) => {
            setSaving(true);
            setError("");

            try {
              const response = await fetch(`/api/parents?id=${editingParent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(data.error || "Unable to update parent");
              }

              setParents((current) =>
                current.map((item) => (item.id === data.parent.id ? data.parent : item))
              );
              setEditingParent(null);
            } catch (saveError) {
              setError(saveError.message || "Unable to update parent");
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </div>
  );
}

function ParentEditModal({ parent, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    father_name: parent.father_name || "",
    father_mobile: parent.father_mobile || "",
    mother_name: parent.mother_name || "",
    mother_mobile: parent.mother_mobile || "",
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
        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h2 className="text-xl font-black text-slate-900">Edit parent</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["father_name", "Father name"],
            ["father_mobile", "Father mobile"],
            ["mother_name", "Mother name"],
            ["mother_mobile", "Mother mobile"],
          ].map(([name, label]) => (
            <label key={name} className="text-sm font-semibold text-slate-700">
              {label}
              <input
                name={name}
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
