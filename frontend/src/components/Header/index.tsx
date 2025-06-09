"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import fitnessImage from "@/assets/images/fitness.png";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if running in browser before accessing localStorage
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full bg-black text-white p-4 z-50 ${
        isSticky ? "shadow-lg" : ""
      }`}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src={fitnessImage}
          alt="Fitness Logo"
          width={100} // Adjust width as needed
          height={50} // Adjust height as needed
          className="object-contain"
          priority // Optimize for header image
        />
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-[#EE7838]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-[#EE7838]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#EE7838]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/trainers" className="hover:text-[#EE7838]">
                Trainers
              </Link>
            </li>
            <li>
              <Link href="/exercise" className="hover:text-[#EE7838]">
                Exercise
              </Link>
            </li>
            {/* <li>
              <Link href="/supplements" className="hover:text-[#EE7838]">
                Supplements
              </Link>
            </li> */}
            {token ? (
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                  }}
                  className="flex items-center hover:text-[#EE7838]"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link href="/login" className="hover:text-[#EE7838]">
                  Login
                </Link>
              </li>
            )}
            {token && (
              <li>
                <Link href="/dashboard" className="hover:text-[#EE7838] underline">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}

export default Header;