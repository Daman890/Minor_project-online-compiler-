import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-4">Online Compiler</h1>
        <p className="text-gray-400 mb-8">
          Write, run and debug C++, Java, Python & more online
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg"
        >
          Start Coding
        </Link>
      </div>
    </div>
  );
}