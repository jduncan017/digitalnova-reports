import { AdminLoginForm } from "~/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-[#e4e4e7]">
            Admin
          </h1>
          <p className="text-base text-[#71717a]">
            Enter your admin password
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
