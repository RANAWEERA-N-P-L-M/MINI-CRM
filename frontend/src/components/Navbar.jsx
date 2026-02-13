import { Link, useNavigate } from 'react-router-dom';
import { authUtils } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authUtils.isAuthenticated();
  const { user } = authUtils.getAuthData();

  // Handle logout
  const handleLogout = () => {
    authUtils.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              MINI CRM
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Submit Inquiry
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="text-white px-3 py-2 text-sm">
                    Welcome, {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="space-y-1">
              <Link
                to="/"
                className="text-white block hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Submit Inquiry
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white block hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white block hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-white block hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;