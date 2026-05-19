
import {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Search,
  User,
  LogOut,
  Settings,
  Globe,
  Bot,
  ChevronDown,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useTheme } from '../../contexts/ThemeContext';

import { useAuth } from '../../contexts/AuthContext';

import logo from '../../assets/images/logo.png';

const Navbar = () => {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [userMenu, setUserMenu] =
    useState(false);

  const [notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [language, setLanguage] =
    useState('EN');

  const notificationRef =
    useRef();

  const userMenuRef =
    useRef();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    darkMode,
    setDarkMode,
  } = useTheme();

  const {
    user,
    logout,
  } = useAuth();

  // CLOSE DROPDOWNS
  useEffect(() => {

    const handleClickOutside = (
      e
    ) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target
        )
      ) {
        setNotificationOpen(
          false
        );
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          e.target
        )
      ) {
        setUserMenu(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, []);

  // CLOSE MOBILE MENU ON PAGE CHANGE
  useEffect(() => {

    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  }, [location]);

  const navLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Explore',
      path: '/explore',
    },
    {
      name: 'AI Planner',
      path: '/ai-planner',
    },
    {
      name: 'Trips',
      path: '/trips',
    },
    {
      name: 'Reviews',
      path: '/reviews',
    },
  ];

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

  return (

    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <img
              src={logo}
              alt="AI Tour"
              className="w-10 h-10 object-contain"
            />

            <div>

              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Tour
              </h1>

              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Rwanda Smart Travel
              </p>

            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">

            {navLinks.map(
              (link, index) => (

                <Link
                  key={index}
                  to={link.path}
                  className={`font-medium transition ${
                    location.pathname ===
                    link.path
                      ? 'text-blue-600'
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* AI BUTTON */}
            <Link
              to="/ai-chat"
              className="hidden md:flex items-center gap-2 px-4 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
            >

              <Bot size={18} />

              <span>
                AI Assistant
              </span>

            </Link>

            {/* SEARCH */}
            <button className="hidden md:flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">

              <Search size={20} />

            </button>

            {/* LANGUAGE */}
            <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-full bg-gray-100 dark:bg-gray-800">

              <Globe size={18} />

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="bg-transparent outline-none text-sm dark:text-white"
              >

                <option value="EN">
                  EN
                </option>

                <option value="FR">
                  FR
                </option>

                <option value="RW">
                  RW
                </option>

                <option value="SW">
                  SW
                </option>

              </select>

            </div>

            {/* NOTIFICATIONS */}
            <div
              className="relative"
              ref={notificationRef}
            >

              <button
                onClick={() =>
                  setNotificationOpen(
                    !notificationOpen
                  )
                }
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              >

                <Bell size={20} />

                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

              </button>

              <AnimatePresence>

                {notificationOpen && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="absolute -right-3/4 mt-3 w-[320px] max-w-[90vw] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                  >

                    <div className="p-4 border-b dark:border-gray-800">

                      <h3 className="font-bold dark:text-white">
                        Notifications
                      </h3>

                    </div>

                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">

                      <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">

                        <p className="text-sm dark:text-white">
                          Welcome to AI Tour Rwanda 🎉
                        </p>

                      </div>

                      <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">

                        <p className="text-sm dark:text-white">
                          Your AI planner is ready.
                        </p>

                      </div>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            {/* THEME */}
            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >

              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}

            </button>

            {/* USER */}
            {user ? (

              <div
                className="relative"
                ref={userMenuRef}
              >

                <button
                  onClick={() =>
                    setUserMenu(
                      !userMenu
                    )
                  }
                  className="flex items-center gap-2 px-3 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >

                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">

                    {user?.fullName
                      ?.charAt(0)}

                  </div>

                  <span className="hidden md:block text-sm font-semibold dark:text-white">
                    {user?.fullName}
                  </span>

                  <ChevronDown size={16} />

                </button>

                <AnimatePresence>

                  {userMenu && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                    >

                      <div className="p-4 border-b dark:border-gray-800">

                        <h3 className="font-bold dark:text-white">
                          {user?.fullName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {user?.email}
                        </p>

                      </div>

                      <div className="p-2">

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition"
                        >

                          <User size={18} />

                          Profile

                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white transition"
                        >

                          <Settings size={18} />

                          Settings

                        </Link>

                        <button
                          onClick={
                            handleLogout
                          }
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition"
                        >

                          <LogOut size={18} />

                          Logout

                        </button>

                      </div>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ) : (

              <div className="hidden md:flex items-center gap-3">

                <Link
                  to="/login"
                  className="px-5 h-10 flex items-center rounded-full border border-gray-300 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 h-10 flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  Register
                </Link>

              </div>

            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() =>
                setMenuOpen(
                  !menuOpen
                )
              }
              className="lg:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >

              {menuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}

            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="lg:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-xl max-h-[85vh] overflow-y-auto"
          >

            <div className="flex flex-col p-5 gap-4">

              {navLinks.map(
                (link, index) => (

                  <Link
                    key={index}
                    to={link.path}
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition font-medium"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <Link
                to="/ai-chat"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
              >

                <Bot size={18} />

                AI Assistant

              </Link>

              {!user ? (

                <div className="flex flex-col gap-3 pt-4">

                  <Link
                    to="/login"
                    className="w-full h-12 rounded-2xl border border-gray-300 dark:border-gray-700 flex items-center justify-center dark:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold"
                  >
                    Create Account
                  </Link>

                </div>

              ) : (

                <button
                  onClick={
                    handleLogout
                  }
                  className="w-full h-12 rounded-2xl bg-red-500 text-white font-semibold"
                >
                  Logout
                </button>

              )}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>
  );
};

export default Navbar;

