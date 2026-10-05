import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthCard className="max-w-[390px]">
      <AuthHeader
        title="Sign up"
        description="Create your account in just a few steps and get started today!"
      />

      <SignupForm />
    </AuthCard>
  );
}
