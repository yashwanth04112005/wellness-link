import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth(); 

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white hover:text-gray-100 transition duration-300 mb-4 md:mb-0">
          WellnessLink
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8 text-lg">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-gray-200 transition duration-300 ${isActive ? 'font-semibold text-white border-b-2 border-white' : ''}`
            }
          >
            Public Sessions
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-sessions"
                className={({ isActive }) =>
                  `hover:text-gray-200 transition duration-300 ${isActive ? 'font-semibold text-white border-b-2 border-white' : ''}`
                }
              >
                My Sessions
              </NavLink>
              <NavLink
                to="/my-sessions/new"
                className={({ isActive }) =>
                  `hover:text-gray-200 transition duration-300 ${isActive ? 'font-semibold text-white border-b-2 border-white' : ''}`
                }
              >
                New Session
              </NavLink>
              <span className="text-gray-200 cursor-default px-2">
                Hello, {user?.email || 'User'}!
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hover:text-gray-200 transition duration-300 ${isActive ? 'font-semibold text-white border-b-2 border-white' : ''}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `hover:text-gray-200 transition duration-300 ${isActive ? 'font-semibold text-white border-b-2 border-white' : ''}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;