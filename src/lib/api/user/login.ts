export const login = async (email: string, password: string) => {
  const loggedInUser = await fetch('https://artem-api.onrender.com/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!loggedInUser.ok) {
    throw new Error('Login failed');
  }
  const loggedInUserJson = await loggedInUser.json();
  if (loggedInUserJson && typeof loggedInUserJson === 'object') {
    const obj = loggedInUserJson as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = obj as Record<string, unknown> & { password?: unknown };
    return (rest as Record<string, unknown>);
  } else {
    return ({
      email,
    });
  }
};