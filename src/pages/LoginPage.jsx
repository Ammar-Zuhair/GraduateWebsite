import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ setActivePage }) {
  const { locale } = useLanguage();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('students');
      }
    } else {
      setError(result.error || (locale === 'ar' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' 
        : 'Invalid email or password.'));
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center w-full max-w-container-max mx-auto px-4 py-24">
      <div className="w-full max-w-md bg-[#F5E6D3] dark:bg-surface-container p-8 md:p-12 border border-[#c59e62]/20 shadow-md">
        
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-5xl text-[#c59e62] mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock
          </span>
          <h2 className="text-2xl text-primary font-bold">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h2>
          <p className="text-sm text-secondary mt-1">
            {locale === 'ar' ? 'للمشرفين والطلاب المسجلين فقط' : 'For admins and registered students only'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-container border border-error/20 text-error font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
              placeholder="admin@university.edu"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-on-surface-variant font-bold">
              {locale === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-0 border-b-2 border-primary focus:border-[#c59e62] focus:ring-0 py-2 text-sm text-primary w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white text-sm py-4 mt-2 hover:bg-primary/90 transition-all font-bold uppercase cursor-pointer border-0 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading && <span className="material-symbols-outlined animate-spin text-lg">refresh</span>}
            {isLoading 
              ? (locale === 'ar' ? 'جاري الدخول...' : 'Signing in...')
              : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In')
            }
          </button>
        </form>
      </div>
    </main>
  );
}
