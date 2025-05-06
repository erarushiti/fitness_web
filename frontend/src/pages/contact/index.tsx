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

      <div className="min-h-screen bg-black text-white p-6 pt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 animate__animated animate__fadeIn mt-24">
            Contact My Fitness
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info Section */}
            <div className="space-y-6 animate__animated animate__fadeInUp animate__delay-1s">
              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaInstagram className="text-pink-500 text-xl hover:scale-125 transition-transform duration-200" />
                <a
                  href="https://instagram.com/myfitness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-pink-300"
                >
                  @myfitness
                </a>
              </div>

              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaFacebook className="text-blue-600 text-xl hover:scale-125 transition-transform duration-200" />
                <a
                  href="https://facebook.com/MyFitnessGym"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-blue-300"
                >
                  MyFitness Gym
                </a>
              </div>

              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaEnvelope className="text-red-400 text-xl hover:scale-125 transition-transform duration-200" />
                <a href="mailto:info@myfitness.com" className="hover:underline hover:text-red-300">
                  info@myfitness.com
                </a>
              </div>

              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaPhone className="text-green-400 text-xl hover:scale-125 transition-transform duration-200" />
                <span>+383 49 123 456</span>
              </div>

              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <FaGlobe className="text-yellow-300 text-xl hover:scale-125 transition-transform duration-200" />
                <a
                  href="https://myfitness.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-yellow-200"
                >
                  myfitness.online
                </a>
              </div>

              <div className="flex items-center gap-3 hover:scale-110 transition-all duration-300 ease-in-out">
                <MdLocationOn className="text-orange-500 text-2xl hover:scale-125 transition-transform duration-200" />
                <span>Rr. Dardania, nr. 12, Prishtina 10000, Kosovo</span>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 animate__animated animate__fadeInUp animate__delay-1s">
              <iframe
                title="My Fitness Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.204578830507!2d21.162107915263348!3d42.66291397916752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549f896ba95dbb%3A0x9dbde1e9b8d527c4!2sPristina!5e0!3m2!1sen!2s!4v1714388139021!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6 mt-16 animate__animated animate__fadeInUp animate__delay-2s">
            <h2 className="text-2xl font-semibold mb-4 text-center">Send Us Your Request or Complaint</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 rounded-lg shadow-lg max-w-md mx-auto"
              style={{ background: "linear-gradient(135deg, black 30%, #EE7838 100%)" }}
            >
              <div>
                <label className="block text-sm font-semibold">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#111] border border-gray-300 text-gray-100 rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#111] border border-gray-300 text-gray-100 rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-[#111] border border-gray-300 text-gray-100 rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="bg-[#111] border border-gray-300 text-gray-100 rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5"
                  required
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#111] py-[10px] px-[20px] rounded-[8px] font-bold mb-[50px] text-white"                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
};

export default ContactPage;
