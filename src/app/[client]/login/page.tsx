import { notFound, redirect } from "next/navigation";
import { getClient, getDnLogo } from "~/lib/clients";
import { isAuthenticated } from "~/lib/auth";
import { LoginForm } from "~/components/LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client: clientSlug } = await params;
  const client = getClient(clientSlug);
  if (!client) notFound();

  // Already logged in? Redirect to dashboard.
  if (await isAuthenticated(clientSlug)) {
    redirect(`/${clientSlug}`);
  }

  return <LoginForm clientSlug={client.slug} clientName={client.name} dnLogo={getDnLogo(client)} splash={client.splash} />;
}
