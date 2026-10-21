import { AskAdminNote } from "@/components/auth/ask-admin-note";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Reset password"
        description="Forgotten your password?"
      />

      <AskAdminNote message="Ask your manager or company admin to resend your invite. You will receive an email with a new temporary password." />
    </AuthCard>
  );
}
