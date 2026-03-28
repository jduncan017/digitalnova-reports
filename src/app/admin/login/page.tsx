import Image from "next/image";
import { AdminLoginForm } from "~/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-[#0f1115]">
      {/* Left: form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div
          className="w-full max-w-xl rounded-2xl p-6 sm:p-16 xl:p-20"
          style={{
            border: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
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

      {/* Right: splash image */}
      <div className="relative hidden w-1/3 2xl:block">
        <Image
          src="/splash-images/digitalnova.webp"
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.1) 40%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
