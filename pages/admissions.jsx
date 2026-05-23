import { useState } from "react";
import Admissions from "@/components/Admissions";
import AdmissionForm from "@/components/AdmissionForm";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/admissions" });

export default function AdmissionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsFormOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 border-b border-slate-200 px-5 py-6 text-left transition hover:bg-slate-50 md:px-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Admission Form
            </p>

            <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              New admission entry
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              {isFormOpen
                ? "Fill the form below to create a new admission record."
                : "Click to open the admission form. Submitted records are shown below."}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 sm:inline-flex">
              {isFormOpen ? "Hide Form" : "Open Form"}
            </span>

            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition duration-300 ${
                isFormOpen ? "rotate-180 bg-indigo-100 text-indigo-700" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </button>

        {/* Expandable Body */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isFormOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-4 md:p-6">
              <AdmissionForm embedded />
            </div>
          </div>
        </div>
      </div>

      <Admissions />
    </div>
  );
}