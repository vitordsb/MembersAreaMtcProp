import { redirect } from "next/navigation";
import ContactButton from "@/components/dashboard/ContactButton";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { apiFetch } from "@/lib/api/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface Student {
  id: string;
  name: string;
  email: string;
  stage: string;
  isActive: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let displayName = (user.user_metadata?.name as string | undefined) ?? "";
  try {
    const student = await apiFetch<Student>("/members/me");
    displayName = student.name || displayName;
  } catch {
    // silencioso — se falhar, cai pro fallback
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar email={user.email ?? ""} name={displayName} />
        <main className="flex-1 overflow-y-auto bg-[color:var(--color-surface)] px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
      <ContactButton />
    </div>
  );
}
