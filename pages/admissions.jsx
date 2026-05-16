import Admissions from "@/components/Admissions";
import AdmissionForm from "@/components/AdmissionForm";
import { withAuthPage } from "@/lib/withAuthPage";

export const getServerSideProps = withAuthPage({ path: "/admissions" });

export default function AdmissionsPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-6 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admission Form</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">New admission entry</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Open the form first to create a new admission, then review the submitted records below.
          </p>
        </div>
        <div className="p-4 md:p-6">
          <AdmissionForm embedded />
        </div>
      </div>

      <Admissions />
    </div>
  );
}
