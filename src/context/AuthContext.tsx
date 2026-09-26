import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { sendOTP as sendOTPService, verifyOTP as verifyOTPService } from '@/services/otpService';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  phone: string;
  otpSent: boolean;
  otpLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<{ error: string | null }>;
  verifyOTP: (otp: string) => Promise<{ error: string | null }>;
  resetOTP: () => void;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    setOtpLoading(true);
    const result = await sendOTPService(phoneNumber);
    setOtpLoading(false);
    if (!result.error) {
      setPhone(phoneNumber);
      setOtpSent(true);
    }
    return result;
  };

  const verifyOTP = async (otp: string) => {
    setOtpLoading(true);
    const result = await verifyOTPService(phone, otp);
    setOtpLoading(false);
    return result;
  };

  const resetOTP = () => {
    setOtpSent(false);
    setPhone('');
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/account' },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetOTP();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        phone,
        otpSent,
        otpLoading,
        sendOTP,
        verifyOTP,
        resetOTP,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
