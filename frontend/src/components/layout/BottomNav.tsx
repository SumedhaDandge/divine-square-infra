import { Home, Users, Building2, BarChart3, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Leads", path: "/leads" },
  { icon: Building2, label: "Projects", path: "/projects" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className="nav-item"
          activeClassName="active"
        >
          <span className="nav-icon">
            <item.icon className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
