import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Set your password"
        description="Choose a new password to finish setting up your account"
      />

      <ChangePasswordForm />
    </AuthCard>
  );
}
