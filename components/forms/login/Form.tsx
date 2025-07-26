'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

type LoginFormProps = {
  onRegisterClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onRegisterClick, onForgotClick }: LoginFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.1.14:8000/api/v1/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (response.status === 200 && data.success) {
        router.push('/home');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };


  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">
          Hotel Management Software
        </div>
        <div className="text-center text-sm mb-4">LOGIN TO USER ACCOUNT</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* <div>
         
            <select
              id="role"
              className="border p-2 rounded w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required >
              <option value="">Select Role</option>
              <option value="software">Software Supplier</option>
              <option value="owner">Hotel Owner</option>
              <option value="manager" >Manager/Receptionist</option>
              <option value="employee">Employee</option>
            </select>
          </div> */}

          <div>
            <input
              id="email"
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>


          <div>

            <input
              id="password"
              type="password"
              className="border p-2 rounded w-full"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={onForgotClick} >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            type="button" onClick={onRegisterClick}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  );
};
function async(arg0: string, arg1: {
  method: string; headers: { 'Content-Type': string; }; credentials: string; //  cookies
  body: string;
}) {
  throw new Error('Function not implemented.');
}

