import { Suspense } from "react";
import InvitationPage from "@/components/InvitationPage";

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<InviteLoading />}>
      <InvitationRoute params={params} />
    </Suspense>
  );
}

async function InvitationRoute({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <InvitationPage token={token} />;
}

function InviteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6 text-center">
      <p className="font-(family-name:--font-cormorant) text-3xl text-[#8C7355]">Preparing your invitation…</p>
    </main>
  );
}
