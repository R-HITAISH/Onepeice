import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useRouter } from '@/router/Router';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/account');
    }
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

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-display text-4xl mb-2" style={{ fontWeight: 400 }}>
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </h1>
      <p className="label-quiet mb-10">
        {mode === 'signin'
          ? 'Access your order history and saved items.'
          : 'Start buying and tracking one-of-one pieces.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-quiet block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="label-quiet block mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="At least 6 characters"
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
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {mode === 'signin' ? 'Signing in...' : 'Creating...'}
            </>
          ) : mode === 'signin' ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-hairline" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-ivory px-4 label-quiet">or</span>
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

      <div className="mt-8 text-center">
        {mode === 'signin' ? (
          <p className="label-quiet">
            No account?{' '}
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className="text-brass hover:underline"
            >
              Create one
            </button>
          </p>
        ) : (
          <p className="label-quiet">
            Already have an account?{' '}
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className="text-brass hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link to="/" className="label-quiet hover:text-brass">
          Back to home
        </Link>
      </div>
    </div>
  );
}
