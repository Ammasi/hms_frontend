'use client';
import { useState } from 'react';
import { RegisterForm } from '../../components/forms/register/Form';
import { LoginForm } from '../../components/forms/login/Form';
import { ForgotForm } from '../../components/forms/forgot/Form';

export default function LoginPage() {

  const [formType, setFormType] = useState<'login' | 'register' | 'forgot'>('login');

  return (
    <>
      <div
        className="fixed inset-0 opacity-90 w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/login/login.jpg')` }}
      />
      <div className="relative z-10">
        {formType === 'register' && <RegisterForm onLoginClick={() => setFormType('login')} />}
        {formType === 'login' && (
          <LoginForm
            onRegisterClick={() => setFormType('register')}
            onForgotClick={() => setFormType('forgot')}
          />
        )}
        {formType === 'forgot' && (
          <ForgotForm
            onBackToLogin={() => setFormType('login')}
            onLoginClick={() => setFormType('login')}
          />
        )}
      </div>
    </>
  );
}
