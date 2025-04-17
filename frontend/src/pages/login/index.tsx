'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import '../../app/globals.css'


export interface User {
    id: string;
    email: string;
    role: 'client' | 'trainer' | 'admin';
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
  }

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:8080/api/auth/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('Login successful! Redirecting...');
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
      <div className="flex flex-col w-1/3 mb-[20px]">
        <label className="text-white">Email:</label>
        <input
          className="p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px] bg-transparent text-white"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col w-1/3 mb-[40px]">
        <label className="text-white">Password:</label>
        <input
          className="p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px] bg-transparent text-white"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button
        className="bg-[#6f6d6d] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Submit Login'}
      </button>
      {error && <p className="text-red-600 text-center text-base">{error}</p>}
      {success && <p className="text-green-600 text-center text-base">{success}</p>}
    </form>
  );
};

export default LoginForm;