'use client'
import Link from "next/link";
// import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import CustomImage from "@/assets/images/fitness.png";

export function Header() {
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
    <div className="py-2 z-50 bg-[#222] w-full transition-all duration-300">
  <div className="container mx-auto flex items-center h-20">
    <Link href="/" className="flex items-center">
      {/* You can uncomment and add your logo here */}
      <img className="h-10" src={CustomImage.src} alt="Fitness Image" />
      {/* <span className="text-orange-600 font-bold text-xl ml-2"></span> */}
    </Link>
    
    <div className="flex-1 flex gap-10 items-center justify-center">
      {items.map((item, index) => (
       <Link
       key={index}
       href={item.pathName}
       className={`${
         pathname === item.pathName
           ? "text-[#EE7838] font-semibold border-b-2 border-[#EE7838]"
           : "text-gray-600 hover:text-[#EE7838]"
       } transition-colors duration-200`}
     >
       {item.name}
     </Link>
     
      ))}
    </div>
  </div>
</div>


  );
}

export default Header;