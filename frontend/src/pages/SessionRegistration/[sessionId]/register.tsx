// pages/sessions/[sessionId]/register.tsx
import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Register for Session</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Phone (Optional):
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{ padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default SessionRegister;