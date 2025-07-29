'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Props = {
  onRegisterClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onRegisterClick, onForgotClick }: Props) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://192.168.1.14:8000/api/v1/auth/login',
        {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        router.push('/home');
      } else {
        alert(response.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-center font-bold mb-4">Hotel Management Software</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="software">Software Supplier</option>
            <option value="owner">Hotel Owner</option>
            <option value="manager">Manager/Receptionist</option>
            <option value="employee">Employee</option>
          </select>

          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="border p-2 rounded"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="text-right text-sm">
            <button type="button" onClick={onForgotClick} className="text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
