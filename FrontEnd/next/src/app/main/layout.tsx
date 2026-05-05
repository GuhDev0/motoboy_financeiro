import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/src/app/componentes/siderBar/siderBar";
import "@/src/app/globals.css";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/Login");
  }

  return (
    <div className="app-layout">
      <Sidebar title="Gestão Motoboy" logout="Sair" />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
