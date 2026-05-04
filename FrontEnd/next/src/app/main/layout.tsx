import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/src/app/componentes/siderBar/siderBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar title="Meu App" logout="Sair" />

      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}