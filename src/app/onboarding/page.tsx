"use client";

import { useState } from "react";

import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { OnboardingStepOne } from "@/components/onboarding/onboarding-step-one";
import { OnboardingStepTwo } from "@/components/onboarding/onboarding-step-two";
import { OnboardingStepThree } from "@/components/onboarding/onboarding-step-three";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Screen 1: Organisation information
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // Screen 2: Company details
  const [companyType, setCompanyType] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [otherCompanyType, setOtherCompanyType] = useState("");
  const [otherReferralSource, setOtherReferralSource] = useState("");

  // Screen 3: Email verification
  const [isVerified, setIsVerified] = useState(false);

  const onboardingData = {
    company_name: companyName.trim(),
    company_email: companyEmail.trim(),
    full_name: fullName.trim(),
    company_type:
      companyType === "Other" ? otherCompanyType.trim() : companyType,
    referral_source:
      referralSource === "Other"
        ? otherReferralSource.trim()
        : referralSource,
  };

  const handleSendOtp = () => {
    console.log("OTP should be sent to:", companyEmail);
    console.log("Onboarding information:", onboardingData);

    // Backend OTP sending will be connected here.
    setCurrentStep(3);
  };

  const handleVerifyOtp = (otp: string) => {
    console.log("OTP entered:", otp);

    // Backend OTP verification will be connected here.
    // Do not mark the user as verified until the backend confirms it.
  };

  const handleResendOtp = () => {
    console.log("A new OTP should be sent to:", companyEmail);

    // Backend OTP resend will be connected here.
  };

  return (
    <OnboardingLayout>
      <OnboardingProgress currentStep={currentStep} totalSteps={3} />

      {currentStep === 1 && (
        <OnboardingStepOne
          companyName={companyName}
          companyEmail={companyEmail}
          fullName={fullName}
          onCompanyNameChange={setCompanyName}
          onCompanyEmailChange={setCompanyEmail}
          onFullNameChange={setFullName}
          onContinue={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
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
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <OnboardingStepThree
          companyEmail={companyEmail}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => setCurrentStep(2)}
        />
      )}
    </OnboardingLayout>
  );
}