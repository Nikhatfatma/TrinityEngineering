"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/lib/utils/validation";
import {
  PortalAuthShell,
  PortalAuthCard,
  PortalAuthHeader,
  LoginSteps,
  PortalAuthButton,
  PortalAuthInput,
  PortalAuthAlert,
} from "@/components/login/PortalLoginLayout";

type LoginStep = "email" | "otp" | "requestAccess" | "requestSuccess";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Request-access form state
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [notice, setNotice] = useState(""); // gray info message (not a hard error)

  // On mount: check if user already has a valid session → redirect immediately
  useEffect(() => {
    fetch("/api/portal/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid) {
          localStorage.setItem("portal_logged_in", "true");
          setRedirecting(true);
          router.replace("/portal/claims");
        } else {
          localStorage.removeItem("portal_logged_in");
          setIsCheckingSession(false);
        }
      })
      .catch(() => {
        setIsCheckingSession(false);
      });
  }, [router]);

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
    setLoading(true);
    try {
      const otpRes = await fetch("/api/portal/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });
      const otpData = await otpRes.json();
      if (!otpData.success) {
        if (otpData.roleMismatch) setError(otpData.error || "Selected role does not match your invitation.");
        else if (otpData.notInvited) {
          // Soften error and offer Request Access
          setError("");
          setInfo("This email hasn't been invited yet. You can request access below.");
          setReqEmail(normalized);
        }
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
    if (resendCooldown > 0 || !email) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch("/api/portal/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
  }, [email, resendCooldown]);

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");
    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/portal/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.roleMismatch) setError(data.error || "Selected role does not match your invitation.");
        else setError(data.error || "Invalid verification code.");
        return;
      }
      localStorage.setItem("portal_logged_in", "true");
      router.push("/portal/claims");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccessSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const cleanName = reqName.trim();
    const cleanEmail = reqEmail.trim().toLowerCase();
    if (!cleanName) { setNotice("Please enter your name."); return; }
    if (!isValidEmail(cleanEmail)) { setNotice("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/portal/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail }),
      });
      const data = await res.json();
      if (!data.success) {
        if (data.alreadyRequested) {
          // Gray info notice — not a hard error
          setNotice("You have already submitted an access request. A member of our team will review and approve the request shortly.");
        } else if (data.alreadyApproved) {
          // Gray info notice — not a hard error
          setNotice("Your access request has been approved. Please return to the login page to sign in and access your account.");
        } else {
          setNotice(data.error || "Could not submit your request. Please try again.");
        }
        return;
      }
      setStep("requestSuccess");
    } catch {
      setNotice("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOtpStep = step === "otp";

  // If we're redirecting an already-authenticated user, show a subtle overlay
  if (redirecting || isCheckingSession) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <span className="material-symbols-outlined animate-spin text-3xl text-gray-400">progress_activity</span>
      </div>
    );
  }

  // ── Request Access Success ────────────────────────────────────────────────
  if (step === "requestSuccess") {
    return (
      <PortalAuthShell>
        <div className="mx-auto w-full max-w-lg">
          <PortalAuthCard compact>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">
                  check_circle
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white sm:text-xl">
                Request Submitted
              </h1>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">
                Your access request has been Submitted. A member of our team will review and approve the request shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                  setInfo("");
                  setReqName("");
                  setReqEmail("");
                }}
                className="mt-1 text-xs font-bold text-primary hover:underline dark:text-accent"
              >
                ← Back to sign-in
              </button>
            </div>
          </PortalAuthCard>
        </div>
      </PortalAuthShell>
    );
  }

  // ── Request Access Form ───────────────────────────────────────────────────
  if (step === "requestAccess") {
    return (
      <PortalAuthShell>
        <div className="mx-auto w-full max-w-lg">
          <PortalAuthCard compact>
            {/* Mini icon */}
            <div className="mb-2.5 flex flex-col items-center text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-accent/10">
                <span className="material-symbols-outlined text-xl text-primary dark:text-accent">
                  person_add
                </span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white sm:text-xl">
                Request Access
              </h1>
            </div>

            {error  && <PortalAuthAlert type="error" compact>{error}</PortalAuthAlert>}
            {notice && <PortalAuthAlert type="info"  compact>{notice}</PortalAuthAlert>}

            <form onSubmit={handleRequestAccessSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <PortalAuthInput
                  icon="person"
                  name="reqName"
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  className="!py-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <PortalAuthInput
                  icon="mail"
                  name="reqEmail"
                  type="email"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="!py-2"
                  required
                />
              </div>

              <PortalAuthButton loading={loading}>
                <span className="material-symbols-outlined text-lg">send</span>
                Submit Request
              </PortalAuthButton>
            </form>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
                setInfo("");
                setNotice("");
              }}
              className="mt-3 block w-full text-center text-xs font-bold text-gray-500 hover:text-primary hover:underline dark:text-gray-400 dark:hover:text-accent"
            >
              ← Back to sign-in
            </button>
          </PortalAuthCard>
        </div>
      </PortalAuthShell>
    );
  }

  // ── Email / OTP steps ─────────────────────────────────────────────────────
  return (
    <PortalAuthShell>
      <div className="mx-auto w-full max-w-lg">
        <PortalAuthCard compact>
          <LoginSteps current={isOtpStep ? 2 : 1} compact />
          <PortalAuthHeader
            compact
            title={isOtpStep ? "Enter Code" : "Client Portal"}
            subtitle={
              isOtpStep
                ? `6-digit code sent to ${email}`
                : "Enter your invited email for a one-time sign-in code."
            }
          />

          {error && <PortalAuthAlert type="error" compact>{error}</PortalAuthAlert>}
          {!isOtpStep && info && <PortalAuthAlert type="info" compact>{info}</PortalAuthAlert>}

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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

              {/* Request Access entry point */}
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                Not invited yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setInfo("");
                    setStep("requestAccess");
                  }}
                  className="font-bold text-primary hover:underline dark:text-accent"
                >
                  Request Access
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] dark:border-gray-800">
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
