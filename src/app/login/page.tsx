'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasAuthenticatedUserId, useUser } from '@/contexts/UserContext';
import { login } from '@/lib/api/user/login';

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (hasAuthenticatedUserId(user)) {
      router.replace('/account');
    }
  }, [user, router]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = String(formData.get('email') ?? '');
      const password = String(formData.get('password') ?? '');
      
      const loggedInUser = await login(email, password);
      if (loggedInUser && hasAuthenticatedUserId(loggedInUser)) {
          setUser(loggedInUser);
          router.push('/account');
      } else {
          setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        flex items-center justify-center
        min-h-[calc(100vh-82px)]
        sm:px-4 sm:px-6 lg:px-8
        py-12
      "
    >
      <div
        className="
          w-full max-w-2xl
          space-y-8
        "
      >
        <div className="text-center space-y-2">
          <h1
            className="
              text-3xl sm:text-4xl
              font-bold
              text-foreground
            "
          >
            Log In
          </h1>
          <p
            className="
              text-lg
              text-foreground/80
            "
          >
            Welcome back
          </p>
        </div>

        <div
          className="
            bg-muted/50
            border border-border
            rounded-lg
            p-4 sm:p-6 sm:p-8
            space-y-6
          "
        >
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <h2
                className="
                  text-xl font-semibold
                  text-foreground
                  pb-2 border-b border-border
                "
              >
                Account Security
              </h2>

              <div>
                <label
                  htmlFor="email"
                  className="
                    block text-sm font-medium
                    text-foreground
                    mb-2
                  "
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="
                    w-full
                    px-4 py-2
                    rounded-lg
                    bg-background
                    border border-border
                    text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-200
                  "
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="
                    block text-sm font-medium
                    text-foreground
                    mb-2
                  "
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="
                    w-full
                    px-4 py-2
                    rounded-lg
                    bg-background
                    border border-border
                    text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-all duration-200
                  "
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                px-4 py-3
                rounded-lg
                bg-primary hover:bg-primary/90
                text-white
                font-medium
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                active:scale-95
                disabled:opacity-70 disabled:pointer-events-none disabled:active:scale-100
                inline-flex items-center justify-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <span
                    className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden
                  />
                  Logging in…
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-foreground/70">
              Don&apos;t have an account?{' '}
              <a
                href="/signUp"
                className="
                  text-primary hover:text-primary/80
                  font-medium
                  transition-colors duration-200
                "
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-background border border-border shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Login Unsuccessful</h3>
              <p className="text-foreground/60 text-center text-sm mb-6">
                We couldn&apos;t verify your credentials. Please double-check your email and password, and try again.
              </p>
              <button
                type="button"
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors outline-none focus:ring-4 focus:ring-red-500/20 active:scale-95"
              >
                Try Again
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

