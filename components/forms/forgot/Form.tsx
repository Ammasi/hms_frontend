'use client';
import { useState, useEffect } from 'react';

type ForgotFormProps = {
  onBackToLogin: () => void;
  onLoginClick: () => void;
};

export const ForgotForm = ({ onBackToLogin, onLoginClick }: ForgotFormProps) => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP + Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer, step]);

  const handleGenerateOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() !== '') {
      setStep(2);
      setTimer(120);
      setMessage('OTP sent successfully to your email.');
    } else {
      setMessage('Please enter a valid email.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp === '1234' && formData.newPassword.length >= 6) {
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        onBackToLogin();
      }, 1500);
    } else {
      setMessage('Invalid OTP or password. Try again.');
    }
  };

  const handleResendOTP = () => {
    setTimer(120);
    setMessage('New OTP sent to your email.');
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="opacity-90 bg-white p-6 rounded shadow w-full max-w-sm">
        <div className="font-bold text-lg text-center mb-2">Hotel Management Software</div>
        <div className="text-center text-sm mb-4">FORGOT PASSWORD</div>

        {message && (
          <div className="text-center text-green-600 text-sm mb-2">{message}</div>
        )}

        <form onSubmit={step === 1 ? handleGenerateOTP : handleResetPassword} className="flex flex-col gap-3">
          {step === 1 && (
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 rounded w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="border p-2 rounded w-full"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Enter New Password"
                className="border p-2 rounded w-full"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
              />
              <div className="text-sm text-gray-600 text-center">
                Time remaining: {formatTimer()}
              </div>
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResendOTP}
                className={`py-2 rounded text-white ${timer > 0 ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                Resend OTP
              </button>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {step === 1 ? 'Generate OTP' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={onLoginClick}
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
