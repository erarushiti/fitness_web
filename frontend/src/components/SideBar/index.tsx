import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  // isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  }, []);

  const navMap: Record<string, NavItem[]> = {
    admin: [
      { name: "All Sessions", path: "/Admin/Sessions/", icon: "fas fa-users" },
      { name: "Create Session", path: "/Admin/Sessions/create-session", icon: "fas fa-chart-bar" },
      { name: "Register", path: "/Admin/register", icon: "fas fa-cog" },
      { name: "Create Supplement", path: "/Admin/Supplements/create-supplements", icon: "fas fa-cog" },
      { name: "All Supplements", path: "/Admin/Supplements/", icon: "fas fa-cog" },
      { name: "All Orders", path: "/Admin/orders/", icon: "fas fa-cog" },
      { name: "All Users", path: "/Admin/users/", icon: "fas fa-cog" },
      { name: "All Contacts", path: "/Admin/contacts/", icon: "fas fa-cog" },
      { name: "All Feedback", path: "/Admin/feedback/", icon: "fas fa-cog" },
      
    ],
    trainer: [
      { name: "Dashboard", path: "/", icon: "fas fa-tachometer-alt" },
      { name: "My Sessions", path: "/trainer/sessions", icon: "fas fa-chalkboard-teacher" },
    ],
    client: [
      { name: "Water Tracer", path: "/WaterTracer", icon: "fas fa-calendar-alt" },
      { name: "Orders", path: "/orders", icon: "fas fa-calendar-alt" },
      { name: "Cart", path: "/Cart", icon: "fas fa-calendar-alt" },
      { name: "Supplements", path: "/supplements", icon: "fas fa-calendar-alt" },
    ],
  };

  const navItems = role ? navMap[role] || [] : [];

  return (
    <>
      {/* Close button for mobile */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-xl font-bold capitalize">{role} Panel</h2>
        <button onClick={onClose}>
          <FaTimes size={24} />
        </button>
      </div>

      {/* Title for desktop */}
      <h2 className="text-2xl font-bold mb-8 capitalize hidden md:block">{role} Panel</h2>

      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.path}
                className={`flex items-center hover:text-gray-300 ${
                  router.pathname === item.path ? "text-blue-400" : ""
                }`}
                onClick={onClose} // close sidebar when clicking a link on mobile
              >
                <i className={`${item.icon} mr-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}

          <li className="mb-4">
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="flex items-center hover:text-gray-300"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
