'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';
import type { AccessNotification, EmailNote } from '@/types/general';

export function useFirstNotification() {
  const { value, setValue } = useLocalStorage<AccessNotification>('access', {
    notified: false,
  });

  useEffect(() => {
    async function sendEmail(email: EmailNote) {
      try {
        const response = await fetch('https://email-api-alpha-six.vercel.app/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(email),
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    if (value.notified) return;

    setValue({ notified: true });
    void sendEmail({
      name: 'Someone',
      email: 'john.doe@example.com',
      message: 'Someone accessed artem app',
      authenticated: false,
    });
  }, [value, setValue]);
}
