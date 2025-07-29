'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get('http://192.168.1.14:8000/api/v1/auth/verify', {
          withCredentials: true,
        });

        if (res.status === 200 || res.data.success) {
          // setLoading(false);
        } else {
          router.push('/');
        }
      } catch (err: any) {
        console.error('Auth verification error:', err);
        // router.push('/');
      }
    };

    verifyUser();
  }, [router]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 bg-cover bg-center" style={{ backgroundImage: `url('/Home/home.jpg')` }}>
          {children}
        </main>
      </div>
    </div>

  );
}
