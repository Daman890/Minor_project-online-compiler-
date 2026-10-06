import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-400">
        Online Compiler
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/saved"
              className="text-gray-300 hover:text-white transition"
            >
              Saved Codes
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}