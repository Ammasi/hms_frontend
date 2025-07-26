import { LoginForm } from "../../components/forms/LoginForm";


export default function Home() {
  return (
    <>
      <div className="fixed inset-0 opacity-90 w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/login/login.jpg')` }}/>
      <LoginForm></LoginForm>
    </>
  );
}
