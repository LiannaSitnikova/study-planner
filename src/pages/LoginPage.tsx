import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { normalizeApiError } from '../api/httpClient';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data.username, data.password);
      navigate('/profile');
    } catch (err) {
      setServerError(normalizeApiError(err).message);
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'emilys', { shouldValidate: true });
    setValue('password', 'emilyspass', { shouldValidate: true });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Вхід у систему</h1>
      <p className="text-sm text-gray-500 mb-5">
        Авторизуйтесь для створення та редагування завдань
      </p>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            {...register('username')}
            placeholder="emilys"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            disabled={isSubmitting}
            {...register('password')}
            placeholder="••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Тестовий акаунт: emilys / emilyspass</span>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          Підставити
        </button>
      </div>
    </div>
  );
};