'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 

export default function useAdminRedirect() {
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    if (typeof window === 'undefined') return; 

    const role = localStorage.getItem('role'); 
    console.log('role from localStorage:', role); 

    if (role !== 'admin' && pathname !== '/unauthorized') {
      router.push('/unauthorized');
    }
  }, [router, pathname]);
}