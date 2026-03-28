'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { isAxiosError } from 'axios';
import css from './SignUpPage.module.css';

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const setUser = useAuthStore(state => state.setUser);

  const {
    register: registerInput,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    setServerError('');
    try {
      const { confirmPassword, ...registerData } = data;
      const user = await register(registerData);
      if (user) {
        setUser(user);
        router.push('/profile');
        router.refresh();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const serverResponse = err.response?.data;
        const message =
          serverResponse?.response?.message || serverResponse?.message || 'Registration failed';

        if (message.toLowerCase().includes('email')) {
          setError('email', { type: 'manual', message: 'This email is already taken' });
        } else {
          setServerError(message);
        }
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit(onSubmit)} className={css.form} noValidate>
        <h1 className={css.formTitle}>Sign up</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            {...registerInput('email')}
            type="email"
            className={`${css.input} ${errors.email ? css.inputError : ''}`}
            placeholder="example@mail.com"
          />
          {errors.email && <p className={css.errorText}>{errors.email.message}</p>}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={css.passwordWrapper}>
            <input
              {...registerInput('password')}
              type={showPassword ? 'text' : 'password'}
              className={`${css.input} ${errors.password ? css.inputError : ''}`}
              placeholder="Min 6 characters"
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
          {errors.password && <p className={css.errorText}>{errors.password.message}</p>}
        </div>

        <div className={css.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={css.passwordWrapper}>
            <input
              {...registerInput('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              className={`${css.input} ${errors.confirmPassword ? css.inputError : ''}`}
              placeholder="Repeat your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={css.eyeButton}
              tabIndex={-1}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className={css.errorText}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>

        {serverError && <p className={css.errorSummary}>{serverError}</p>}
      </form>
    </main>
  );
}
