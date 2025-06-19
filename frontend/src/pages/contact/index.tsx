"use client";

import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import '../../app/globals.css';

const ContactPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your message has been sent successfully!");
    setMessage("");
    setName("");
    setEmail("");
    setSubject("");
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-black text-white px-4 sm:px-6 pt-20 pb-10 mt-[100px]">
        <div className="max-w-6xl mx-auto">

          {/* Contact Form */}
          <div className="space-y-6 mt-8 animate__animated animate__fadeInUp animate__delay-2s">
            <h2 className="text-2xl font-semibold mb-4 text-center">Send Us Your Request or Complaint</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto"
              style={{ background: "linear-gradient(135deg, black 30%, #EE7838 100%)" }}
            >
              <div>
                <label className="block text-sm font-semibold">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 rounded bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full p-2 rounded bg-black text-white border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#111] py-2 px-6 rounded-lg font-bold text-white hover:bg-orange-600 transition duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>

            {/* Contact Info & Map */}
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 animate__animated animate__fadeIn mt-24">
              Contact My Fitness
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Contact Info */}
              <div className="space-y-6 animate__animated animate__fadeInUp animate__delay-1s">
                {[
                  {
                    icon: <FaInstagram className="text-pink-500 text-xl" />,
                    href: "https://instagram.com/myfitness",
                    text: "@myfitness",
                    hover: "hover:text-pink-300",
                  },
                  {
                    icon: <FaFacebook className="text-blue-600 text-xl" />,
                    href: "https://facebook.com/MyFitnessGym",
                    text: "MyFitness Gym",
                    hover: "hover:text-blue-300",
                  },
                  {
                    icon: <FaEnvelope className="text-red-400 text-xl" />,
                    href: "mailto:info@myfitness.com",
                    text: "info@myfitness.com",
                    hover: "hover:text-red-300",
                  },
                  {
                    icon: <FaPhone className="text-green-400 text-xl" />,
                    text: "+383 49 123 456",
                  },
                  {
                    icon: <FaGlobe className="text-yellow-300 text-xl" />,
                    href: "https://myfitness.online",
                    text: "myfitness.online",
                    hover: "hover:text-yellow-200",
                  },
                  {
                    icon: <MdLocationOn className="text-orange-500 text-2xl" />,
                    text: "Rr. Dardania, nr. 12, Prishtina 10000, Kosovo",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 ease-in-out"
                  >
                    {item.icon}
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline ${item.hover}`}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 animate__animated animate__fadeInUp animate__delay-1s">
                <iframe
                  title="My Fitness Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.204578830507!2d21.162107915263348!3d42.66291397916752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549f896ba95dbb%3A0x9dbde1e9b8d527c4!2sPristina!5e0!3m2!1sen!2s!4v1714388139021!5m2!1sen!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
