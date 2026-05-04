import Link from "next/link";
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
  {
    id: 1,
    name: "Dashboard",
    icon: "📊",
    href: "/main", 
  },
  {
    id: 2,
    name: "Gain",
    icon: "💰",
    href: "/main/Gain", 
  },
  {
    id: 3,
    name: "Expense",
    icon: "💸",
    href: "/main/Expense", 
  },
];

export default function Sidebar({ title, logout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        
        <div className="sidebar-header">
          <p className="sidebar-subtitle">Financeiro MotoBoy</p>
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
              className="sidebar-link"
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
              <span className="sidebar-arrow">→</span>
            </Link>
          ))}
        </nav>

      </div>

      <div className="sidebar-footer">
        <button className="logout-button">
          {logout}
        </button>
      </div>
    </aside>
  );
}