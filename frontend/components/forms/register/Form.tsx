// 16-9-2025 receptionist or manager   show name, clientId, propertyId, email, password 
// 16-9-2025  owner   show name, clientId, email, password .  software   show name, email, password ,handleSubmit function move 

'use client';

import { useEffect, useMemo, useState } from 'react';
import { RegisterUser } from '../../../lib/api';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export const RegisterForm = ({ onLoginClick }: RegisterFormProps) => {

  const [formData, setFormData] = useState({
    role: '',
    name: '',
    clientId: '',
    propertyId: '',
    email: '',
    password: '',
  });

  // derived booleans for which fields to show / require
  const roleLower = (formData.role || '').toLowerCase();

  const showClientId = useMemo(
    () => roleLower === 'owner' || roleLower === 'manager' || roleLower === 'receptionist',
    [roleLower]
  );
  const showPropertyId = useMemo(
    () => roleLower === 'manager' || roleLower === 'receptionist',
    [roleLower]
  );

  // when role changes and a field is no longer relevant, clear it
  useEffect(() => {
    setFormData((prev) => {
      let next = { ...prev };
      if (!showClientId && next.clientId) next.clientId = '';
      if (!showPropertyId && next.propertyId) next.propertyId = '';
      return next;
    });
  }, [showClientId, showPropertyId]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {

      const { role, name, email, password, clientId, propertyId } = formData;
      const payload: Record<string, string> = { role, name, email, password };

      if (showClientId) payload.clientId = clientId;
      if (showPropertyId) payload.propertyId = propertyId;


      const { data } = await RegisterUser(payload);

      alert('Registration successful');
      console.log(data);
      onLoginClick();
    } catch (error: any) {

      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      alert(`Error: ${message}`);
      console.error('Register error:', error);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">User Register</div>
        <div className="text-center text-sm mb-4">User Register Login Form</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <select
              id="role"
              className="border p-2 rounded w-full"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="">Select Role</option>
              <option value="software">Software Supplier</option>
              <option value="owner">Hotel Owner</option>
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <div>
            <input
              id="name"
              type="text"
              className="border p-2 rounded w-full"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Client ID (owner/manager/receptionist) */}
          {showClientId && (
            <div>
              <input
                id="clientId"
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Enter your client Id"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
              />
            </div>
          )}

          {/* Property ID (manager/receptionist only) */}
          {showPropertyId && (
            <div>
              <input
                id="propertyId"
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Enter your property Id"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <input
              id="email"
              type="email"
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"

            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
