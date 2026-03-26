'use client';

import css from './SignUpPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/clientApi';
import type { RegisterRequest } from '@/types/requests';
import { useAuthStore } from '@/lib/store/authStore';
import { isAxiosError } from 'axios';

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState('');

  const [isPending, setIsPending] = useState(false); //

  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);

    try {
      const formValues = Object.fromEntries(formData) as unknown as RegisterRequest;

      const user = await register(formValues);

      if (user) {
        setUser(user);
        router.push('/profile');
        router.refresh(); //
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      //
      setIsPending(false); //
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            autoComplete="email"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            autoComplete="new-password"
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            {isPending ? 'Registering...' : 'Register'}
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
