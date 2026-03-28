import Image from "next/image";
import { ClientSelector } from "~/components/ClientSelector";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Image
            src="/dn-logo.png"
            alt="DigitalNova Studio"
            width={200}
            height={60}
            unoptimized
            className="mx-auto mb-8 h-10 w-auto"
          />
          <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-[#e4e4e7]">
            Client Portal
          </h1>
          <p className="text-base text-[#71717a]">
            Enter your client ID to continue
          </p>
        </div>
        <ClientSelector />
      </div>
    </div>
  );
}
