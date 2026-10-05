import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Login"
        description="Login to your account to continue"
      />

      <LoginForm />
    </AuthCard>
  );
};