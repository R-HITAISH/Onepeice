import { supabase } from '@/lib/supabase';

export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  const tenDigit = cleaned.length === 10 ? cleaned : cleaned.replace(/^91/, '');
  return /^[6-9]\d{9}$/.test(tenDigit);
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const tenDigit = cleaned.length === 10 ? cleaned : cleaned.replace(/^91/, '');
  return `+91${tenDigit}`;
}

export async function sendOTP(phoneNumber: string): Promise<{ error: string | null }> {
  if (!validateIndianPhone(phoneNumber)) {
    return { error: 'Enter a valid 10-digit Indian mobile number.' };
  }

  const formatted = formatPhoneNumber(phoneNumber);

  const { error } = await supabase.auth.signInWithOtp({
    phone: formatted,
  options: { channel: 'sms' },
  });

  if (error) {
    if (error.message.includes('rate limit') || error.message.includes('too many')) {
      return { error: 'Too many attempts. Wait a minute before trying again.' };
    }
    return { error: error.message };
  }

  return { error: null };
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<{ error: string | null }> {
  if (!otp || otp.length !== 6) {
    return { error: 'Enter the 6-digit code.' };
  }

  const formatted = formatPhoneNumber(phoneNumber);

  const { error } = await supabase.auth.verifyOtp({
    phone: formatted,
    token: otp,
    type: 'sms',
  });

  if (error) {
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      return { error: 'Invalid or expired code. Try again or resend.' };
    }
    return { error: error.message };
  }

  return { error: null };
}
