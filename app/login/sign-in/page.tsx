"use client";

import { Suspense, useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isValidEmail } from "@/lib/utils/validation";
import {
  PortalAuthShell,
  PortalAuthCard,
  PortalAuthHeader,
  PortalAuthRoleBadge,
  PortalAuthTextLink,
  LoginSteps,
  PortalAuthButton,
  PortalAuthInput,
  PortalAuthAlert,
} from "@/components/login/PortalLoginLayout";

type LoginStep = "email" | "otp";
type PortalRole = "IA" | "Adjuster";

const ROLE_LABELS: Record<PortalRole, string> = {
  Adjuster: "Adjuster (Carrier)",
  IA: "Independent Adjuster (IA)",
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: PortalRole | null =
    roleParam === "IA" || roleParam === "Adjuster" ? roleParam : null;

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!role) router.replace("/login");
  }, [role, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!role) return;
    setLoading(true);
    try {
      const otpRes = await fetch("/api/portal/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, role }),
      });
      const otpData = await otpRes.json();
      if (!otpData.success) {
        if (otpData.roleMismatch) setError(otpData.error || "Selected role does not match your invitation.");
        else if (otpData.notInvited) setError("You are not invited to this portal.");
        else setError(otpData.error || "Could not send verification code.");
        if (otpData.cooldownSeconds) setResendCooldown(otpData.cooldownSeconds);
        return;
      }
      setEmail(normalized);
      setStep("otp");
      setInfo(
        otpData.emailSent
          ? "Check your inbox for the 6-digit code."
          : "Code generated — tap Resend if needed."
      );
      setResendCooldown(otpData.cooldownSeconds || 60);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || !email || !role) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.roleMismatch) setError(data.error || "Selected role does not match your invitation.");
        else setError(data.error || "Could not resend code.");
        if (data.cooldownSeconds) setResendCooldown(data.cooldownSeconds);
        return;
      }
      setInfo(data.emailSent ? "New code sent." : "New code generated.");
      setResendCooldown(data.cooldownSeconds || 60);
    } catch {
      setError("Could not resend code.");
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown, role]);

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (!role) return;
    setLoading(true);
    try {
      const res = await fetch("/api/portal/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, role }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.roleMismatch) setError(data.error || "Selected role does not match your invitation.");
        else setError(data.error || "Invalid verification code.");
        return;
      }
      router.push("/portal/claims");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  const isOtpStep = step === "otp";

  return (
    <PortalAuthShell>
      <div className="mx-auto w-full max-w-lg">
        <PortalAuthCard compact>
          <LoginSteps current={isOtpStep ? 3 : 2} compact />
          <PortalAuthHeader
            compact
            title={isOtpStep ? "Enter Code" : "Sign In"}
            subtitle={
              isOtpStep
                ? `6-digit code sent to ${email}`
                : "Enter your invited email for a one-time sign-in code."
            }
          />

          {!isOtpStep && <PortalAuthRoleBadge compact label={ROLE_LABELS[role]} />}

          {error && <PortalAuthAlert type="error" compact>{error}</PortalAuthAlert>}
          {!isOtpStep && info && <PortalAuthAlert type="info" compact>{info}</PortalAuthAlert>}

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <PortalAuthInput
                  icon="mail"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="!py-2"
                  required
                />
              </div>
              <PortalAuthButton loading={loading}>
                <span className="material-symbols-outlined text-lg">send</span>
                Send code
              </PortalAuthButton>
              <PortalAuthTextLink compact href="/login">← Change role</PortalAuthTextLink>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  6-digit code
                </label>
                <PortalAuthInput
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="!py-2 !text-center !font-mono !text-lg !tracking-[0.35em] sm:!text-xl"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>
              <PortalAuthButton loading={loading}>
                <span className="material-symbols-outlined text-lg">login</span>
                Sign in
              </PortalAuthButton>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                    setInfo("");
                  }}
                  className="font-bold text-gray-500 hover:text-primary dark:hover:text-accent"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || resendCooldown > 0}
                  className="font-bold text-primary hover:underline disabled:opacity-50 dark:text-accent"
                >
                  {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </PortalAuthCard>
      </div>
    </PortalAuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 text-sm text-gray-500">
          <span className="material-symbols-outlined mr-2 animate-spin">progress_activity</span>
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
