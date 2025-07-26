'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.email === 'admin' &&
      formData.password === '1234' &&
      formData.role !== ''
    ) {
      router.push('/home');
    } else {
      alert('Invalid credentials or missing role');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">
          Hotel Management Software
        </div>
        <div className="text-center text-sm mb-4">LOGIN TO USER ACCOUNT</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="role" className="block mb-1 text-sm text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              className="border p-2 rounded w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required >
              <option value="">Select Role</option>
              <option>Business Owner</option>
              <option>Software Supplier</option>
              <option>Hotel Owner</option>
              <option>Manager/Receptionist</option>
              <option>Guest</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-gray-700">
              Email or Username
            </label>
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
            <label htmlFor="password" className="block mb-1 text-sm text-gray-700">
              Password
            </label>
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
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
