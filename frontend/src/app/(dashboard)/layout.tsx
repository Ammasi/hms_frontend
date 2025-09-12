'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
import AuthProvider from '../context/AuthContext';
import { verifyUser } from '../../../lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialUser, setInitialUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = await verifyUser();
        setInitialUser(data?.user ?? null);
        console.log("Login details", data?.user);
        setLoading(false);
      } catch (error) {
        console.error("Verification failed:", error);
        router.push('/');
      }
    };

    checkUser();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <AuthProvider initialUser={initialUser}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-cover bg-center" style={{ backgroundImage: `url('/Home/home.jpg')` }}>
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
