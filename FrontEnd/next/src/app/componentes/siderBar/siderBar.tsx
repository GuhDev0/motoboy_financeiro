"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/src/services/autheService";
import "./css/siderbar.css";

type SidebarItem = {
  id: number;
  name: string;
  icon: string;
  href: string;
};

type SidebarProps = {
  title: string;
  logout: string;
};

const menu: SidebarItem[] = [
  { id: 1, name: "Dashboard", icon: "📊", href: "/main/Dashboard" },
  { id: 2, name: "Ganhos",    icon: "💰", href: "/main/Gain" },
  { id: 3, name: "Despesas",  icon: "💸", href: "/main/Expense" },
];

export default function Sidebar({ title, logout }: SidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <>
      {/* Botão hamburguer — mobile only */}
      <button
        className="sidebar-toggle"
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {/* Overlay escuro — mobile only */}
      <div
        className={`sidebar-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-content">

          <div className="sidebar-header">
    
            <h1 className="sidebar-title">{title}</h1>
            <p className="sidebar-description">
              Acesse suas próximas páginas pelo menu abaixo.
            </p>
          </div>


          <nav className="sidebar-nav">
            {menu.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
                <span className="sidebar-arrow">→</span>
              </Link>
            ))}
          </nav>

        </div>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            {logout}
          </button>
        </div>
      </aside>
    </>
  );
}
