'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import Cookies from "js-cookie";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://192.168.1.14:8000/api/v1/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },

        });
        if (response.status === 200) {
          console.log("response", response.data.user)  
          setLoading(false);
          return;
        }
        if (response.status === 304) {
          setLoading(false);
          return;
        }

        throw new Error('Verification failed');
      } catch (error) {
        console.error('Full verification error:', error);
        router.push('/');
      }
    };

    verifyUser();
  }, [router]);

  if (loading) return <div className="p-10  text-center">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-cover bg-center" style={{ backgroundImage: `url('/Home/home.jpg')` }}>
          {children}
        </main>
      </div>
    </div>
  );
}
