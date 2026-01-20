import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: () => authApi.requestPasswordReset({ email }),
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

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
              <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
              <p className="text-muted-foreground mt-1">Enter your email to reset your password</p>
            </div>

            {/* Form Section */}
            <div className="px-8 pb-8">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
                  <p className="text-muted-foreground mb-6">
                    If an account exists for {email}, you will receive password reset instructions.
                  </p>
                  <Link to="/login" className="btn-primary w-full block text-center">
                    Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {mutation.error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                      Failed to send reset instructions. Please try again.
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input pl-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #AF40FF 0%, #5B42F3 50%, #00DDEB 100%)' }}
                  >
                    {mutation.isPending ? 'Sending...' : 'Send Reset Instructions'}
                  </button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
