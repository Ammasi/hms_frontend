'use client';

 
import { useState } from 'react';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onLoginClick()

  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">
          User Register
        </div>
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
              <option value="manager" >Manager/Receptionist</option>
              <option value="employee">Employee</option>
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
          <div>

            <input
              id="clientId"
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Enter your client Id"
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
              required
            />
          </div>
          <div>

            <input
              id="propertyId"
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Enter your property Id"
              value={formData.propertyId}
              onChange={(e) =>
                setFormData({ ...formData, propertyId: e.target.value })
              }
              required
            />
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
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  );
};
