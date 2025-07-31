'use client';
import {  useState } from 'react';
import { useRouter } from 'next/navigation';
// import axios from 'axios';
import Sidebar from '../../../components/layout/Sidebar';
import Navbar from '../../../components/layout/Navbar';
// import Cookies from 'js-cookie';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   const verifyUser = async () => {

  //     const token = Cookies.get('auth_token') || localStorage.getItem('auth_token');
  //     console.log('Verification token:', token);

  //     if (!token) {
  //       console.error('No token found in cookies or storage');
  //       router.push('/');
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(
  //         'http://192.168.1.14:8000/api/v1/auth/verify',
  //         {
  //           withCredentials: true
  //         }
  //       );

  //       console.log('Verification response:', response.data);

  //       if (!response.data?.success) {
  //         throw new Error('Verification failed');
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Full verification error:', {

  //       });

  //       Cookies.remove('auth_token', { path: '/' });
  //       localStorage.removeItem('auth_token');
  //       router.push('/');
  //     }
  //   };

  //   verifyUser();
  // }, [router]);

  // if (loading) return <div className="p-10 text-center">Loading...</div>;

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
