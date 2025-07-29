'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        'http://192.168.1.14:8000/api/v1/auth/logout',
        {},
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        router.push('/');  
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      alert('Logout error');
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-blue-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Hotel Management</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  );
}
