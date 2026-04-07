import { SignupPayload } from '@/types/user';

export async function register(payload: SignupPayload) {
  const signUpRes = await fetch('https://artem-api.onrender.com/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!signUpRes.ok) {
    throw new Error('Sign up failed');
  }

  let createdUserJson: unknown = null;
  try {
    createdUserJson = await signUpRes.json();
  } catch {
    createdUserJson = null;
  }

  // Store a safe subset in context + localStorage (avoid passwords).
  if (createdUserJson && typeof createdUserJson === 'object') {
    const obj = createdUserJson as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = obj as Record<string, unknown> & { password?: unknown };

    return {
      ...rest,
      role: payload.role,
      email: payload.email,
    };
  } else {
    return {
      role: payload.role,
      email: payload.email,
    };
  }
}