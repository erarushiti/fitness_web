// src/app/layout.tsx
import Header from "../components/Header/index";
import "../app/globals.css"; 
import DashboardLayout from '../components/DashboardLayout';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#111] text-white">
        <Header />
        {children}
        
      </body>
    </html>
  );
}
