'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { login } from '@/lib/api/user/login';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Not connected yet: mock a short delay so the UI behaves like a real request.
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const email = String(formData.get('email') ?? '');
      const password = String(formData.get('password') ?? '');
      setUser(await login(email, password));
      router.push('/account');
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
    </div>
  );
}

