import { Home, Users, Building2, User, CheckSquare } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: CheckSquare, label: "Tasks", path: "/tasks" },
  { icon: Users, label: "Leads", path: "/leads" },
  { icon: Building2, label: "Projects", path: "/projects" },
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
          <span className="nav-icon mb-1">
            <item.icon className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-medium leading-none">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
