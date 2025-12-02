import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, X, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../store/userSlice";

const links = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);


  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    dispatch(logOut());
    setIsDropdownOpen(false);
    navigate("/sign-in");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="border-b border-white/10  bg-slate-950 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center gap-3" to="/">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Guard</h2>
            <p className="text-xs text-white/50">Platform</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/permission"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Permission
          </Link>
          <Link
            to="/users"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Users
          </Link>
          <a
            href="#pricing"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Pricing
          </a>
          <Link
            to="/plp"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Products
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 relative">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <User
                className="cursor-pointer w-6 h-6 hover:text-white/80 transition"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/sign-in"
              className="text-sm text-white/80 hover:text-white transition px-4 py-2 border rounded-md"
            >
              Sign in
            </a>
          )}
          {/* 
          <a
            href="/sign-up"
            className="text-sm px-4 py-2 rounded-lg font-medium transition text-white border"
          >
            Request access
          </a> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
