'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Use App Router hooks

export default function useAdminRedirect() {
  const router = useRouter();
  const pathname = usePathname(); // Get current path to prevent infinite redirects

  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server

    const role = localStorage.getItem('role'); // Get role only from localStorage
    console.log('role from localStorage:', role); // Debugging log

    if (role !== 'admin' && pathname !== '/unauthorized') {
      router.push('/unauthorized');
    }
  }, [router, pathname]);
}