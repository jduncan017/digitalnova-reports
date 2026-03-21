import { redirect } from "next/navigation";

export default function HomePage() {
  // For now, redirect to the first client.
  // In the future this could be an internal dashboard or client selector.
  redirect("/finalbit");
}
