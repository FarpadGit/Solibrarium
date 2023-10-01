import LoginForm from "@/components/forms/LoginForm";

export default function Login() {
  return (
    <div className="w-3/4">
      <LoginForm redirectURL="/" />
    </div>
  );
}
