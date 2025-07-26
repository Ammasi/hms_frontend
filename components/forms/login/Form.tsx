'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LoginFormProps = {
  onRegisterClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onRegisterClick,onForgotClick }: LoginFormProps) => {
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
    <div className="flex items-center justify-center h-screen ">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">
          Hotel Management Software
        </div>
        <div className="text-center text-sm mb-4">LOGIN TO USER ACCOUNT</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div>
         
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
          </div>

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
            type="button"   onClick={onRegisterClick}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  );
};
