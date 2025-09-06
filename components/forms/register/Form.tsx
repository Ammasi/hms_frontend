'use client';

import { useEffect, useMemo, useState } from 'react';

interface RegisterFormProps {
  onLoginClick: () => void;
}

export const RegisterForm = ({ onLoginClick }: RegisterFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    clientId: '',
    propertyId: '',
    email: '',
    password: '',
  });

  // Show Client/Property only when role is NOT software
  const showClientAndProperty = useMemo(
    () => formData.role.toLowerCase() !== 'software',
    [formData.role]
  );

  // If user switches to software, clear client/property so they won't be submitted
  useEffect(() => {
    if (!showClientAndProperty && (formData.clientId || formData.propertyId)) {
      setFormData((prev) => ({ ...prev, clientId: '', propertyId: '' }));
    }
  }, [showClientAndProperty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build payload WITHOUT clientId/propertyId for software role
      const { role, name, email, password, clientId, propertyId } = formData;
      const payload: Record<string, string> = { role, name, email, password };
      if (showClientAndProperty) {
        payload.clientId = clientId;
        payload.propertyId = propertyId;
      }

      const response = await fetch('http://192.168.1.4:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful');
        console.log(result);
        onLoginClick();
      } else {
        alert(`Error: ${result.message || 'Registration failed'}`);
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong');
    } finally {
      setSubmitting(false);
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

          {/* Only show when role is NOT software */}
          {showClientAndProperty && (
            <>
              <div>
                <input
                  id="clientId"
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Enter your client Id"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                  required={showClientAndProperty}
                />
              </div>
              <div>
                <input
                  id="propertyId"
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Enter your property Id"
                  value={formData.propertyId}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyId: e.target.value })
                  }
                  required={showClientAndProperty}
                />
              </div>
            </>
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};
