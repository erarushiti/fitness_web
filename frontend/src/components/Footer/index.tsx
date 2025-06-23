
export default function Footer() {
 return (
    <footer className="rounded-lg shadow-sm bg-black">
      <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Logo and Title */}
          <a
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            aria-label="My Fitness Homepage"
          >
            <img
              className="w-16 sm:w-20 h-auto object-contain"
              src={'/icons/fitness.png'}
              alt="My Fitness Logo"
            />
            <span className="self-center text-lg sm:text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
              My Fitness
            </span>
          </a>

          {/* Navigation Links */}
          <ul className="flex flex-col sm:flex-row flex-wrap items-center mb-6 text-sm sm:text-base font-medium text-gray-400 space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <li>
              <a
                href="#"
                className="hover:underline hover:text-[#EE7838] transition-colors"
                aria-label="About Us"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline hover:text-[#EE7838] transition-colors"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline hover:text-[#EE7838] transition-colors"
                aria-label="Licensing"
              >
                Licensing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline hover:text-[#EE7838] transition-colors"
                aria-label="Contact Us"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Horizontal Rule */}
        <hr className="my-4 sm:my-6 border-gray-700" />

        {/* Copyright Notice */}
        <span className="block text-sm sm:text-base text-center text-[#EE7838]">
          © {new Date().getFullYear()}{" "}
          <a
            href="#"
            className="hover:underline hover:text-white transition-colors"
            aria-label="My Fitness Homepage"
          >
            My Fitness
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
