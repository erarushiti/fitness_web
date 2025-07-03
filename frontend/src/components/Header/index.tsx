"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [token, setToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
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

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header

    className={`fixed top-0 left-0 w-full bg-black text-white p-4 shadow-lg z-50 ${isSticky ? 'shadow-lg' : ''}`}
    initial={{ opacity: 1 }}
    animate={{ opacity: isSticky ? 1 : 1 }} // Keep opacity constant
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto flex justify-between items-center">
    <img className="max-h-screen object-contain" src={CustomImage.src} alt="Fitness Image" />
      <nav>
        <ul className="flex space-x-6">
          <li><a href="/" className="hover:text-[#EE7838]">Home</a></li>
          <li><a href="/about" className="hover:text-[#EE7838]">About</a></li>
          <li><a href="/trainers" className="hover:text-[#EE7838]">Trainers</a></li>
          <li><a href="/exercise" className="hover:text-[#EE7838]">Exercise</a></li>
          <li><a href="/contact" className="hover:text-[#EE7838]">Contact Us</a></li>
          <li><a href="/login" className="hover:text-[#EE7838]">Login</a></li>
          <li><a href="/WaterTracer" className="hover:text-[#EE7838]">WaterTracer</a></li>
        </ul>
      </nav>
    </div>
  </motion.header>

      className={`fixed top-0 left-0 w-full bg-black text-white p-4 sm:p-6 z-50 ${
        isSticky ? "shadow-lg" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src={'/icons/fitness.png'}
            alt="Fitness Logo"
            width={50}
            height={50}
            className="w-[50px] sm:w-18 lg:w-18 h-auto object-contain"
            priority
          />
        </Link>


        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row absolute lg:static top-16 left-0 w-full lg:w-auto bg-black lg:bg-transparent p-4 lg:p-0 z-40`}
        >
          <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 text-base sm:text-lg">
            <li>
              <Link
                href="/"
                className="hover:text-[#EE7838] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[#EE7838] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[#EE7838] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/trainers"
                className="hover:text-[#EE7838] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trainers
              </Link>
            </li>
            <li>
              <Link
                href="/exercise"
                className="hover:text-[#EE7838] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Exercise
              </Link>
            </li>
            {token ? (
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center hover:text-[#EE7838] transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="hover:text-[#EE7838] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
            {token && (
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-[#EE7838] underline transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
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