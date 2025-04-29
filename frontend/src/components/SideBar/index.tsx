import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
  { name: 'All Sessions', path: '/login', icon: 'fas fa-users' },
  { name: 'Create Session', path: '/analytics', icon: 'fas fa-chart-bar' },
  { name: 'Settings', path: '/settings', icon: 'fas fa-cog' },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.path}
                className={`flex items-center hover:text-gray-300 ${
                  router.pathname === item.path ? 'text-blue-400' : ''
                }`}
              >
                <i className={`${item.icon} mr-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}
          <li className="mb-4">
            <a href="#" className="flex items-center hover:text-gray-300">
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