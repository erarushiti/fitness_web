
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";


interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC = () => {
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
    ],
    trainer: [
      { name: "Dashboard", path: "/", icon: "fas fa-tachometer-alt" },
      { name: "My Sessions", path: "/trainer/sessions", icon: "fas fa-chalkboard-teacher" },
    ],
    client: [
      { name: "Dashboard", path: "/", icon: "fas fa-tachometer-alt" },
      { name: "Water Tracer", path: "/WaterTracer", icon: "fas fa-calendar-alt" },
    ],
  };

  const navItems = role ? navMap[role] || [] : [];

  return (
    <div className="w-64 bg-[#1c1c1c] text-white p-6">
      <h2 className="text-2xl font-bold mb-8 capitalize">{role} Panel</h2>

      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.path}

                className={`flex items-center hover:text-gray-300 ${router.pathname === item.path ? 'text-blue-400' : ''}`}

              >
                <i className={`${item.icon} mr-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}
          <li className="mb-4">

            <a
              href="#"
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="flex items-center hover:text-gray-300"
            >

              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
