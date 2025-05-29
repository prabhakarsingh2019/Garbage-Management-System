import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const AppNavbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const hasRole = (role) => user?.role?.toLowerCase() === role.toLowerCase();

  if (loading) return null;

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-white">
            Garbage Management
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <NavLink to="/bins">Bins</NavLink>
                {hasRole("driver") && (
                  <NavLink to="/driver/routes">My Routes</NavLink>
                )}
                {hasRole("admin") && (
                  <>
                    <NavLink to="/admin/routes">Manage Routes</NavLink>
                    <NavLink to="/admin/users">Users</NavLink>
                  </>
                )}
              </>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 text-sm font-medium focus:outline-none hover:bg-gray-700 px-3 py-2 rounded-md"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span>{user?.username}</span>
                  <ChevronDownIcon />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <DropdownLink
                      to={`/users/${user._id}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </DropdownLink>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register" isPrimary>
                  Register
                </NavLink>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute inset-x-0 top-16 bg-gray-800 z-40 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && (
              <>
                <MobileNavLink
                  to="/bins"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bins
                </MobileNavLink>
                {hasRole("driver") && (
                  <MobileNavLink
                    to="/routes"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Routes
                  </MobileNavLink>
                )}
                {hasRole("admin") && (
                  <>
                    <MobileNavLink
                      to="/admin/routes"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Routes
                    </MobileNavLink>
                    <MobileNavLink
                      to="/admin/users"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Users
                    </MobileNavLink>
                  </>
                )}
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated ? (
              <div className="px-5 space-y-1">
                <div className="text-base font-medium text-white">
                  {user?.username}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {user?.email}
                </div>
                <div className="mt-3 space-y-1">
                  <MobileNavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </MobileNavLink>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <MobileNavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </MobileNavLink>
                <MobileNavLink
                  to="/register"
                  isPrimary
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </MobileNavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, isPrimary = false }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium ${
      isPrimary ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-700"
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, isPrimary = false }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      isPrimary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  >
    {children}
  </Link>
);

const MenuIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const XIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default AppNavbar;
