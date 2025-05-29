'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';

interface HeaderProps {
  children?: React.ReactNode;
}

function formatTitle(path: string) {
  const segments = path.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || '';

  // UUID v4 regex pattern
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(last);

  if (isUUID) return ''; // Don't show title if it's a UUID

  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const pathname = usePathname() || '/';

  const pageTitle = useMemo(() => formatTitle(pathname), [pathname]);
    const [role, setRole] = useState<string | null>(null);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
      }
    }, []);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#111]">{pageTitle}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {/* Replace with your actual user avatar component or use an icon library like react-icons */}
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM2 18a8 8 0 0116 0H2z" />
          </svg>
          <span className='text-[#111]'>Logged in as {role}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
