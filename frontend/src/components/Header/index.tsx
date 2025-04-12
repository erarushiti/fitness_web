'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import CustomImage from "@/assets/images/fitness.png";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true); // Add sticky effect when scrolling down
      } else {
        setIsSticky(false); // Remove sticky effect when at the top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
//   const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      name: "Home",
      pathName: "/",
    },
    {
      name: "About",
      pathName: "/about",
    },
    {
      name: "Contact Us",
      pathName: "/contact",
    },
  ];

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
          <li><a href="#about" className="hover:text-[#EE7838]">About</a></li>
          <li><a href="#services" className="hover:text-[#EE7838]">Services</a></li>
          <li><a href="#contact" className="hover:text-[#EE7838]">Contact</a></li>
        </ul>
      </nav>
    </div>
  </motion.header>


  );
}

export default Header;