import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useToastStore } from '@/stores';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const token = searchParams.get('reset_password_token') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      authApi.resetPassword({
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    onSuccess: () => {
      addToast({
        type: 'success',
        message: 'Password has been reset successfully!',
        duration: 5000,
      });
      navigate('/login');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      return;
    }
    mutation.mutate();
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-danger/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Invalid Reset Link</h2>
          <p className="text-muted-foreground mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="btn-primary">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          top: '88px',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        {/* Gradient border wrapper */}
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple via-violet to-cyan rounded-2xl blur-sm opacity-75" />
          <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-border">
            {/* Logo Section */}
            <div className="pt-8 pb-4 text-center bg-gradient-to-b from-muted/50 to-transparent">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
              <p className="text-muted-foreground mt-1">Enter your new password</p>
            </div>

            {/* Form Section */}
            <div className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {mutation.error && (
                  <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                    {(mutation.error as any)?.response?.data?.error?.message || 'Failed to reset password. The link may have expired.'}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password_confirmation"
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="input pl-10"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  {password && passwordConfirmation && password !== passwordConfirmation && (
                    <p className="text-danger text-sm">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending || password !== passwordConfirmation}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #AF40FF 0%, #5B42F3 50%, #00DDEB 100%)' }}
                >
                  {mutation.isPending ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
