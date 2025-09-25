// 13-9-2025 role based dashboard show   suriya 
// app/(public)/login/page.tsx   

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import { RegisterForm } from "../../components/forms/register/Form";
import { LoginForm } from "../../components/forms/login/Form";
import { ForgotForm } from "../../components/forms/forgot/Form";

export default function LoginPage() {
  const [formType, setFormType] = useState<"login" | "register" | "forgot">(
    "login"
  );
  const router = useRouter();
  const { user } = useAuth();


  useEffect(() => {

    if (!user) return;

    const role = (user.role ?? "").toString().toLowerCase();
    if (role === "receptionist") {
      router.replace("/dashboard");
    } else {
      router.replace("/clients");
    }
  }, [user, router]);



  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <div
          className="fixed inset-0 opacity-90 w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url('/login/login.jpg')` }}
        />
        <div className="relative z-10">
          {formType === "register" && (
            <RegisterForm onLoginClick={() => setFormType("login")} />
          )}
          {formType === "login" && (
            <LoginForm
              onRegisterClick={() => setFormType("register")}
              onForgotClick={() => setFormType("forgot")}
            />
          )}
          {formType === "forgot" && (
            <ForgotForm
              onBackToLogin={() => setFormType("login")}
              onLoginClick={() => setFormType("login")}
            />
          )}
        </div>
      </Suspense>
    </main>
  );
}
