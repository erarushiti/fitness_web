'use client';

import Link from 'next/link';
import "../../app/globals.css";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e5e5e5]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white border border-black rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">Unauthorized Access</h2>
        <p className="text-red-500 text-sm text-center">
          You do not have permission to access this page. Please log in as an admin.
        </p>
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full block text-center rounded-[8px] border border-black px-4 py-2 text-sm font-bold text-black bg-[#EE7838] hover:bg-[#d66b30]"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="w-full block text-center rounded-[8px] border border-black px-4 py-2 text-sm font-bold text-black bg-white hover:bg-gray-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}