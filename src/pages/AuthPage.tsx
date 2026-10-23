import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/router/Router';
import { AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { validateIndianPhone } from '@/services/otpService';

function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const len = 6;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = (idx: number, digit: string) => {
    const d = digit.replace(/\D/g, '').slice(-1);
    const chars = value.split('');
    chars[idx] = d;
    const next = chars.join('').slice(0, len);
    onChange(next);
    if (d && idx < len - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, len);
    onChange(pasted);
    if (pasted.length === len) inputsRef.current[len - 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: len }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          disabled={disabled}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="input text-center text-xl font-display"
          style={{ width: '3rem', padding: 0, minHeight: '3rem', ...(value[i] ? { borderColor: 'var(--ink)' } : {}) }}
        />
      ))}
    </div>
  );
}

export function AuthPage() {
  const { otpSent, otpLoading, sendOTP, verifyOTP, resetOTP, signInWithGoogle } = useAuth();
  const { navigate } = useRouter();
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  // Auto-submit OTP when full
  useEffect(() => {
    if (otpSent && otpInput.length === 6 && !otpLoading) {
      doVerify(otpInput);
    }
  }, [otpInput, otpSent]);

  // Store return path
  const returnTo = (() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('returnTo') || '/account';
  })();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneInput.replace(/\D/g, '').replace(/^91/, '').slice(-10);
    if (!validateIndianPhone(digits)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setPhoneError(null);
    const result = await sendOTP(digits);
    if (result.error) setPhoneError(result.error);
  };

  const doVerify = async (code: string) => {
    setOtpError(null);
    const result = await verifyOTP(code);
    if (result.error) {
      if (result.error.toLowerCase().includes('expired')) {
        setOtpError('This code has expired. Send a new one.');
      } else {
        setOtpError("That code doesn't match. Try again.");
      }
    } else {
      navigate(returnTo);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6) return;
    await doVerify(otpInput);
  };

  const handleResend = async () => {
    setOtpError(null);
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
    const result = await sendOTP(phoneInput);
    if (result.error) setOtpError(result.error);
  };

  const handleGoogle = async () => {
    setOtpError(null);
    setGoogleLoading(true);
    // Store return path in sessionStorage for OAuth redirect
    sessionStorage.setItem('onepiece_return_to', returnTo);
    const result = await signInWithGoogle();
    if (result.error) {
      setOtpError(result.error);
      setGoogleLoading(false);
    }
  };

  const formattedPhone = phoneInput
    ? `+91 ${phoneInput.replace(/\D/g, '').slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2')}`
    : '';

  return (
    <div className="page" style={{ paddingTop: 'clamp(3rem,6vw,6rem)', paddingBottom: 'clamp(3rem,6vw,6rem)' }}>
      <div className="max-w-[400px] mx-auto">
        <h1 style={{ fontWeight: 400 }} className="mb-2">Sign in</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--ink-2)' }}>
          {otpSent ? `Code sent to ${formattedPhone}` : "We'll text you a six-digit code."}
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="label-field" htmlFor="auth-phone">Mobile number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--ink-2)' }}>
                  +91
                </span>
                <input
                  id="auth-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10));
                    if (phoneError) setPhoneError(null);
                  }}
                  onBlur={() => {
                    const digits = phoneInput.replace(/\D/g, '').slice(-10);
                    if (phoneInput && !validateIndianPhone(digits)) {
                      setPhoneError('Enter a valid 10-digit Indian mobile number.');
                    }
                  }}
                  className="input"
                  style={{ paddingLeft: '3rem' }}
                  inputMode="numeric"
                />
              </div>
              {phoneError && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{phoneError}</p>}
            </div>

            <button
              type="submit"
              disabled={otpLoading || phoneInput.length !== 10}
              className="btn btn-primary w-full"
            >
              {otpLoading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="label-field">Six-digit code</label>
              <OtpInput value={otpInput} onChange={setOtpInput} disabled={otpLoading} />
            </div>

            {otpError && (
              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--error)' }}>
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                {otpError}
              </div>
            )}

            <button
              type="submit"
              disabled={otpLoading || otpInput.length !== 6}
              className="btn btn-primary w-full"
            >
              {otpLoading ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : 'Verify & sign in'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown}
                className="text-sm"
                style={resendCooldown ? { color: 'var(--ink-2)' } : { color: 'var(--brass-text)' }}
              >
                {resendCooldown ? 'Resend in 30s' : 'Resend code'}
              </button>
              <button
                type="button"
                onClick={() => { resetOTP(); setOtpInput(''); setOtpError(null); }}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: 'var(--ink-2)' }}
              >
                <ArrowLeft size={13} />
                Change number
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full hairline-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 label" style={{ background: 'var(--paper)' }}>or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="btn btn-secondary w-full"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg width={16} height={16} viewBox="0 0 24 24" className="shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
          )}
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <Link to="/" className="text-link">Back to shop</Link>
        </div>
      </div>
    </div>
  );
}
