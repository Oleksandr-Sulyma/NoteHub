'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { isAxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import css from './SignInPage.module.css';

const signInSchema = z.object({
  email: z.string().email('Invalid email or password'),
  password: z.string().min(6, 'Invalid email or password'),
});

type SignInSchema = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const {
    register: loginInput,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onValidationError = () => {
    toast.error('Invalid email or password');
  };

  const onSubmit = async (data: SignInSchema) => {
    const loadingToast = toast.loading('Logging in...');

    try {
      const user = await login(data);
      if (user) {
        setUser(user);
        toast.success(`Welcome back, ${user.username || 'user'}!`, { id: loadingToast });
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        toast.error('Invalid email or password', { id: loadingToast });
      } else {
        toast.error('Connection error. Please try again.', { id: loadingToast });
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit(onSubmit, onValidationError)} className={css.form} noValidate>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            {...loginInput('email')}
            type="email"
            className={`${css.input} ${errors.email ? css.inputError : ''}`}
            placeholder="example@mail.com"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={css.passwordWrapper}>
            <input
              {...loginInput('password')}
              type={showPassword ? 'text' : 'password'}
              className={`${css.input} ${errors.password ? css.inputError : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={css.eyeButton}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </div>
      </form>
    </main>
  );
}
