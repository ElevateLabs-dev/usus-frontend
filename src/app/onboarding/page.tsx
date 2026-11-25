"use client";

import { useState } from "react";

import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingStepOne } from "@/components/onboarding/onboarding-step-one";
import { OnboardingStepTwo } from "@/components/onboarding/onboarding-step-two";
import { OnboardingStepThree } from "@/components/onboarding/onboarding-step-three";

import {
  signupCompany,
  verifyCompanyEmail,
  type CompanySignupRequest,
} from "@/services/auth-service";

import {useRouter} from "next/navigation";
import { routeUtils } from "@/config/role-navigation";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Company information
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Company details
  const [companyType, setCompanyType] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [otherCompanyType, setOtherCompanyType] = useState("");
  const [otherReferralSource, setOtherReferralSource] = useState("");


  const router = useRouter();
  // Step 3: Verification
  const [signupData, setSignupData] =
    useState<CompanySignupRequest | null>(null);

  const [resendIn, setResendIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const onboardingData: CompanySignupRequest = {
    company_name: companyName.trim(),
    email: companyEmail.trim(),
    full_name: fullName.trim(),
    password,
    company_type:
      companyType === "Other"
        ? otherCompanyType.trim()
        : companyType,
    referral_source:
      referralSource === "Other"
        ? otherReferralSource.trim()
        : referralSource,
  };

  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
      return err.message;
    }

    return "Something went wrong. Please try again.";
  }

  // Submit company registration and request OTP
  async function handleSendOtp() {
    setError("");

    if (
      !onboardingData.company_type ||
      !onboardingData.referral_source
    ) {
      setError("Please complete all company details.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupCompany(onboardingData);

      setSignupData(onboardingData);
      setResendIn(response.resend_in);
      setCurrentStep(3);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  // Verify OTP with backend
  async function handleVerifyOtp(otp: string) {
    setError("");

    setIsLoading(true);

    try {
      await verifyCompanyEmail({
        email: companyEmail.trim(),
        code: otp,
      });

      setIsVerified(true);

      setTimeout(() => {
      router.push(routeUtils.company_admin[0].href); // Redirect to the company admin dashboard
      }, 1000);

      // The backend has now created the organisation
      // and issued the authentication tokens.
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  // Request another OTP using the original signup details
  async function handleResendOtp(): Promise<number | null> {
  if (!signupData) {
    setError("Your registration details could not be found.");
    return null;
  }

  setError("");
  setIsLoading(true);

  try {
    const response = await signupCompany(signupData);

    setResendIn(response.resend_in);

    return response.resend_in;
  } catch (err) {
    setError(getErrorMessage(err));
    return null;
  } finally {
    setIsLoading(false);
  }
}

  return (
    <OnboardingLayout>
      <OnboardingProgress currentStep={currentStep} totalSteps={3} />

      {currentStep === 1 && (
        <OnboardingStepOne
          companyName={companyName}
          companyEmail={companyEmail}
          fullName={fullName}
          password={password}
          confirmPassword={confirmPassword}
          onCompanyNameChange={setCompanyName}
          onCompanyEmailChange={setCompanyEmail}
          onFullNameChange={setFullName}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onContinue={() => {
            setError("");
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <div>
          {error && (
            <p
              role="alert"
              className="mb-4 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <OnboardingStepTwo
            companyType={companyType}
            referralSource={referralSource}
            otherCompanyType={otherCompanyType}
            otherReferralSource={otherReferralSource}
            onCompanyTypeChange={setCompanyType}
            onReferralSourceChange={setReferralSource}
            onOtherCompanyTypeChange={setOtherCompanyType}
            onOtherReferralSourceChange={setOtherReferralSource}
            onContinue={handleSendOtp}
            onBack={() => {
              setError("");
              setCurrentStep(1);
            }}
          />

          {isLoading && (
            <p className="mt-4 text-center text-sm text-[var(--usus-text-muted)]">
              Sending verification code...
            </p>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <OnboardingStepThree
          companyEmail={companyEmail}
          resendIn={resendIn}
          isLoading={isLoading}
          error={error}
          isVerified={isVerified}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => {
            setError("");
            setCurrentStep(2);
          }}
        />
      )}
    </OnboardingLayout>
  );
}