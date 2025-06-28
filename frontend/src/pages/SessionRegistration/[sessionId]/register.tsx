"use client";
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../../../app/globals.css'
import Header from '@/components/Header';
import CustomImage from "@/assets/images/fitness.png";
import Footer from '@/components/Footer';


// Define the Registration interface
export interface Registration {
  id: string;
  sessionId: string;
  fullName: string;
  email: string;
  phone?: string;
  registeredAt: string;
  createdAt: string;
}

// Define form data interface
interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

const SessionRegister: React.FC = () => {
  const router = useRouter();
  const { sessionId } = router.query; // Get sessionId from URL (Next.js dynamic route)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // Fixed type to string | null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/sessions/${sessionId}/register`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      setSuccess('Registration successful! We will contact you soon.');
      setError(null);
      setFormData({ fullName: '', email: '', phone: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
      setSuccess(null);
    }
  };

  return (
    <div>
         <Header/>
       <div className='bg-[#111] min-h-screen pt-[147px] '>
      <h1 className='text-center text-3xl font-extrabold text-white mb-[50px]'>Register for Session</h1>
     
      <form className='flex flex-col items-center px-4' onSubmit={handleSubmit}>
  <div className='flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6'>
    <label className="text-white font-medium mb-1">Full Name:</label>
    <input
      className='p-2 mt-1 border-2 border-[#6f6d6d] rounded-lg'
      type="text"
      name="fullName"
      value={formData.fullName}
      onChange={handleChange}
      required
    />
  </div>

  <div className='flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6'>
    <label className="text-white font-medium mb-1">Email:</label>
    <input
      className='p-2 mt-1 border-2 border-[#6f6d6d] rounded-lg'
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>

  <div className='flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-8'>
    <label className="text-white font-medium mb-1">Phone (Optional):</label>
    <input
      className='p-2 mt-1 border-2 border-[#6f6d6d] rounded-lg'
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
    />
  </div>

  <button
    className='bg-[#6f6d6d] py-3 px-6 rounded-lg font-bold text-white hover:bg-[#5c5a5a] transition-colors duration-200 mb-6'
    type="submit"
  >
    Submit Registration
  </button>

  {error && <p className='text-red-600 text-center text-base'>{error}</p>}
  {success && <p className='text-green-600 text-center text-base'>{success}</p>}
</form>

    </div>
  <Footer/>
    </div>
   
  );
};

export default SessionRegister;