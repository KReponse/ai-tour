import { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Search,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { darkMode, setDarkMode } = useTheme();

  const navLinks = [
    "Home",
    "Explore",
    "AI Planner",
    "Trips",
    "Profile",
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 dark:bg-dark/70 border-b border-white/20 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer">

            <img
              src={logo}
              alt="AI Tour"
              className="w-10 h-10 object-contain"
            />

            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Tour
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">

            {navLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-700 dark:text-gray-200 hover:text-primary transition font-medium"
              >
                {link}
              </a>
            ))}

          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <button className="hidden md:flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">

              <Search size={20} />

            </button>

            {/* NOTIFICATION */}
            <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">

              <Bell size={20} />

              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>

            </button>

            {/* THEME TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >

              {darkMode ? <Sun size={20} /> : <Moon size={20} />}

            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >

              {menuOpen ? <X size={24} /> : <Menu size={24} />}

            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white dark:bg-dark shadow-lg"
          >

            <div className="flex flex-col p-4 gap-4">

              {navLinks.map((link, index) => (

                <a
                  key={index}
                  href="#"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary transition font-medium"
                >
                  {link}
                </a>

              ))}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>
  );
};

export default Navbar;