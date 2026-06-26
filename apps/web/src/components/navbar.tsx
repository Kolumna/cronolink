import { CuboidIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const navItems = [
  {
    label: "Panel główny",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    label: "Projekty",
    href: "/projects",
    icon: <CuboidIcon />,
  },
   {
    label: "Użytkownicy",
    href: "/users",
    icon: <UsersIcon />,
  },
  // {
  //   label: "Ustawienia",
  //   href: "/settings",
  //   icon: <SettingsIcon />,
  // },
];

export const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="w-54">
      <ul className="flex flex-col">
        {navItems.map((item) => (
          <li key={item.href}>
            <Button
              variant={pathname.includes(item.href) ? "default" : "ghost"}
              size="lg"
              className="w-full justify-start px-4 h-12"
              asChild
            >
              <Link to={item.href}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
