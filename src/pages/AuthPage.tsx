import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/router/Router';
import { AlertTriangle, Loader2, ArrowLeft, Phone } from 'lucide-react';
import { validateIndianPhone } from '@/services/otpService';

export function AuthPage() {
  const { otpSent, otpLoading, sendOTP, verifyOTP, resetOTP, signInWithGoogle } = useAuth();
  const { navigate } = useRouter();
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateIndianPhone(phoneInput)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    const result = await sendOTP(phoneInput);
    if (result.error) setError(result.error);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await verifyOTP(otpInput);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/account');
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
    const result = await sendOTP(phoneInput);
    if (result.error) setError(result.error);
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
      setGoogleLoading(false);
    }
  };

  const formattedPhone = phoneInput
    ? `+91 ${phoneInput.replace(/\D/g, '').slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2')}`
    : '';

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-display text-4xl mb-2" style={{ fontWeight: 400 }}>
        {otpSent ? 'Verify your number' : 'Sign in'}
      </h1>
      <p className="label-quiet mb-10">
        {otpSent
          ? `OTP sent to ${formattedPhone}`
          : 'Enter your mobile number to get a one-time password.'}
      </p>

      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div>
            <label className="label-quiet block mb-1.5">Mobile number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-muted pointer-events-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="input-field pl-12"
                placeholder="9876543210"
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 text-error font-body text-sm">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={otpLoading || phoneInput.length !== 10}
            className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {otpLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <Phone size={15} />
                Send OTP
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div>
            <label className="label-quiet block mb-1.5">6-digit code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-field text-center text-2xl tracking-[0.5em] font-display"
              placeholder="------"
              inputMode="numeric"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 text-error font-body text-sm">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={otpLoading || otpInput.length !== 6}
            className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {otpLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & sign in'
            )}
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown}
              className="font-body text-xs text-brass hover:underline disabled:text-muted disabled:no-underline"
            >
              {resendCooldown ? 'Resend in 30s' : 'Resend OTP'}
            </button>
            <button
              type="button"
              onClick={() => { resetOTP(); setOtpInput(''); setError(null); }}
              className="flex items-center gap-1.5 font-body text-xs text-muted hover:text-brass transition-colors"
            >
              <ArrowLeft size={13} />
              Change number
            </button>
          </div>
        </form>
      )}

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hairline" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-bone px-4 label-quiet">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="btn btn-dark w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <Loader2 size={15} className="animate-spin" />
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

      <div className="mt-10 text-center">
        <Link to="/" className="label-quiet hover:text-brass">
          Back to home
        </Link>
      </div>
    </div>
  );
}
