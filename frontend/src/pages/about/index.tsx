// 'use client';
// import '../../app/globals.css';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// // Images
// import au1 from '@/assets/images/au1.jpg';
// import au2 from '@/assets/images/au2.jpg';
// import au3 from '@/assets/images/au3.jpg';
// import au4 from '@/assets/images/au4.jpg';
// import au5 from '@/assets/images/au5.jpg';
// import au6 from '@/assets/images/au6.jpg';
// import au7 from '@/assets/images/au7.jpg';
// import au8 from '@/assets/images/au8.jpg';
// import au9 from '@/assets/images/au9.jpg';
// import au10 from '@/assets/images/au10.jpg';
// import au11 from '@/assets/images/au11.jpg';

// const quotes = [
//   "Believe you can and you're halfway there.",
//   "Success is not final, failure is not fatal: It is the courage to continue that counts.",
//   "Don't watch the clock; do what it does. Keep going.",
//   "The only limit to our realization of tomorrow is our doubts of today.",
//   "Hardships often prepare ordinary people for an extraordinary destiny.",
//   "The future belongs to those who believe in the beauty of their dreams.",
//   "It always seems impossible until it's done.",
//   "Dream big and dare to fail.",
//   "Push yourself, because no one else is going to do it for you.",
//   "You are stronger than you think.",
//   "Make each day your masterpiece."
// ];

// const images = [au1, au2, au3, au4, au5, au6, au7, au8, au9, au10, au11];

// const About = () => {
//   // const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };
//   const [quotes, setQuotes] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchQuotes() {
//       try {
//         const res = await fetch("http://localhost:8080/api/quote");
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data = await res.json();
//         setQuotes(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchQuotes();
//   }, []);
//   // useEffect(() => {
//   //   const interval = setInterval(nextSlide, 5000);
//   //   return () => clearInterval(interval);
//   // }, []);
//   // Change slide every 5 seconds (only if quotes exist)
//     useEffect(() => {
//       if (quotes.length === 0) return;
//       const interval = setInterval(() => {
//         setCurrentIndex((i) => (i + 1) % quotes.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }, [quotes]);

//   return (
//     <>
//       {/* Fixed Header */}
//       <div className="fixed top-0 w-full z-50">
//         <Header />
//       </div>

//       {/* Main Page Content */}
//       <div className="pt-[80px] min-h-screen w-full bg-gradient-to-br from-black via-[#1a1a1a] to-[#EE7838] text-white">
//         {/* Hero Section */}
//         <section className="flex flex-col items-center justify-center px-4 py-10">
//           <h1 className="text-4xl md:text-6xl font-bold mb-10 text-center text-[#EE7838] tracking-wide z-20">
//             Ignite Your Inner Fire
//           </h1>

//           <div className="relative w-full max-w-7xl">
//             <div className="relative w-full h-96 md:h-[500px] mb-4 overflow-hidden">
//               <Image
//                 src={images[currentIndex]}
//                 alt={`Motivation ${currentIndex + 1}`}
//                 className="w-full h-full object-cover rounded-xl shadow-2xl"
//                 width={1200}
//                 height={700}
//               />
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
//                 <div className="relative inline-block px-6 py-4">
//                   <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/70 to-black/30 blur-md opacity-80 pointer-events-none" />
//                   <p className="relative text-2xl md:text-4xl font-semibold italic text-[#EE7838] z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
//                     "{quotes[currentIndex]}"
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Arrows */}
//             <button
//               onClick={() =>
//                 setCurrentIndex((prevIndex) =>
//                   prevIndex === 0 ? images.length - 1 : prevIndex - 1
//                 )
//               }
//               className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition z-20"
//             >
//               &#10094;
//             </button>
//             <button
//               onClick={nextSlide}
//               className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition z-20"
//             >
//               &#10095;
//             </button>
//           </div>
//         </section>

//         {/* About Us Section */}
//         <section className="px-6 py-20 max-w-7xl mx-auto space-y-16">
//           <div className="text-center">
//             <h2 className="text-5xl font-extrabold text-[#EE7838] mb-4">About Us</h2>
//             <p className="text-xl max-w-3xl mx-auto text-gray-300">
//               More than a fitness brand — we're a mindset revolution. We exist to empower people to unlock their full physical and mental potential.
//             </p>
//           </div>

//           {/* Our Story */}
//           <div className="grid md:grid-cols-2 gap-10 items-center">
//             <div className="text-center md:text-left">
//               <h3 className="text-3xl font-bold text-[#EE7838] mb-4">Our Story</h3>
//               <p className="text-gray-300 leading-relaxed">
//                 Born out of passion, forged in sweat. What started as a few training sessions among friends has grown into a full-blown movement. We’ve built this platform to bring real transformation — not just bodies, but lives.
//               </p>
//             </div>
//             <div className="flex justify-center items-center">
//               <div className="w-[300px] h-[200px] rounded-xl overflow-hidden shadow-md">
//                 <Image
//                   src={au3}
//                   alt="Team training"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Core Values */}
//           <div>
//             <h3 className="text-3xl font-bold text-[#EE7838] text-center mb-8">Our Core Values</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
//               {[
//                 { title: "Discipline", desc: "We show up — every day, every rep." },
//                 { title: "Authenticity", desc: "No gimmicks, no filters — just real progress." },
//                 { title: "Community", desc: "You’re never alone. We rise together." },
//                 { title: "Growth", desc: "Always improving. Always pushing forward." },
//               ].map((item, idx) => (
//                 <div key={idx} className="bg-[#1e1e1e] p-6 rounded-xl shadow hover:shadow-xl transition">
//                   <h4 className="text-xl font-semibold text-[#EE7838] mb-2">{item.title}</h4>
//                   <p className="text-gray-400 text-sm">{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Mission */}
//           <div className="grid md:grid-cols-2 gap-10">
//             <div>
//               <h3 className="text-3xl font-bold text-[#EE7838] mb-4">Our Mission</h3>
//               <p className="text-gray-300 text-lg leading-relaxed">
//                 We believe fitness is not a luxury — it's a necessity. Our mission is to break barriers and build confidence in every person who dares to try. No matter your starting point, you belong here.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold text-[#EE7838] mb-4">Why We Exist</h3>
//               <p className="text-gray-300 text-lg leading-relaxed">
//                 We were tired of seeing empty promises and unrealistic transformations. So we created a platform with no shortcuts, no BS — just expert training, honest guidance, and a community that never lets you quit.
//               </p>
//             </div>
//           </div>

//           {/* CTA */}
//           <div className="text-center mt-12">
//             <h3 className="text-3xl font-bold text-[#EE7838] mb-4">Join the Revolution</h3>
//             <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
//               It’s more than fitness — it’s about becoming who you were meant to be. We’re building something real. Be part of it.
//             </p>
//             <button className="bg-[#EE7838] text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-500 transition">
//               Start Your Journey
//             </button>
//           </div>
//         </section>
//       </div>

//       {/* Footer */}
//       <Footer />
//     </>
//   );
// };

// export default About;
"use client";

import React, { useEffect, useState } from "react";
import '../../app/globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

interface Quote {
  id: string;
  text: string;
  author: string;
  image: string; // image filename like "1749413388734.JPG"
  createdAt: string;
  updatedAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch("http://localhost:8080/api/quote");
        if (!res.ok) throw new Error("Failed to fetch quotes");
        const data: Quote[] = await res.json();
        setQuotes(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes]);

  if (loading) return <div className="text-white p-10 text-center">Loading...</div>;
  if (error) return <div className="text-red-500 p-10 text-center">Error: {error}</div>;
  if (quotes.length === 0) return <div className="text-white p-10 text-center">No quotes found</div>;

  const currentQuote = quotes[currentIndex];
  // Assuming images are in public/uploads folder
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      <main className="pt-[80px] min-h-screen w-full bg-gradient-to-br from-black via-[#1a1a1a] to-[#EE7838] text-white flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-10 text-center text-[#EE7838] tracking-wide z-20">
          Ignite Your Inner Fire
        </h1>

        <div className="relative w-full max-w-7xl rounded-xl overflow-hidden shadow-2xl mb-10">
            {currentQuote.image ?  (
              // <Image
              //   src={`http://localhost:8080/uploads/${currentQuote.image}`}
              //   alt={`Quote by ${currentQuote.author || "Unknown"}`}
              //   width={1200} 
              //   height={700} 
              //   className="object-cover w-full h-[400px] md:h-[500px] rounded-xl"
              //   priority
              // />
             <img
  src={`http://localhost:8080/uploads/${currentQuote.image}`}
  alt={`Quote by ${currentQuote.author || "Unknown"}`}
  style={{ width: '1200px', height: '700px', objectFit: 'cover' }}
  className="rounded-xl"
/>

          ) : ( 
            <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center bg-gray-800 rounded-xl">
              No Image Available
            </div>
          )}

          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 p-6">
            <p className="text-2xl md:text-4xl italic text-[#EE7838] drop-shadow-lg text-center">
              "{currentQuote.text}"
            </p>
            {currentQuote.author && (
              <p className="mt-4 text-gray-300 italic text-center">- {currentQuote.author}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentIndex((i) => (i === 0 ? quotes.length - 1 : i - 1))}
            className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition"
          >
            &#10094;
          </button>
          <button
            onClick={() => setCurrentIndex((i) => (i + 1) % quotes.length)}
            className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition"
          >
            &#10095;
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
