"use client";
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../../../app/globals.css'
import Header from '@/components/Header';
import CustomImage from "@/assets/images/fitness.png";


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
     
      <form className=' flex flex-col items-center' onSubmit={handleSubmit}>
        <div className='flex flex-col w-1/3 mb-[20px]'>
          <label>
            Full Name:
            </label>
            <input className=' p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px]'
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
         
        </div>
        <div className='flex flex-col w-1/3 mb-[20px]'>
          <label>
            Email:
            </label>
            <input className=' p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px]'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          
        </div>
        <div  className='flex flex-col w-1/3 mb-[40px]'>
          <label>
            Phone (Optional):
            </label>
            <input className=' p-[6px] mt-[5px] border-2 border-[#6f6d6d] rounded-[8px]'
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
         
        </div>
        <button className='bg-[#6f6d6d] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] '
          type="submit"
          
        >
          Submit Registration
        </button>
        {error && <p className='text-red-600 text-center text-base'>{error}</p>}
        {success && <p className='text-green-600 text-center text-base'>{success}</p>}
      </form>
    </div>
    <footer className=" rounded-lg shadow-sm bg-black ">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
            <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img className="max-h-screen object-contain" src={CustomImage.src} alt="Fitness Image" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">My Fitness</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline">Contact</a>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm sm:text-center text-[#EE7838]">© 2023 <a href="#`" className="hover:underline ">My Fitnes</a>. All Rights Reserved.</span>
    </div>
</footer>  
    </div>
   
  );
};

export default SessionRegister;