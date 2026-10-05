import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Reset password"
        description="Enter your email and we'll send you a link to reset your password."
      />

      <ForgotPasswordForm />
    </AuthCard>
  );
}
