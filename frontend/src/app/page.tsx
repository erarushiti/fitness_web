"use client";
import Banner from "@/assets/images/banerrr.png"
import Icon1 from "@/assets/icons/icon1.png"
import Icon2 from "@/assets/icons/icon2.png"
import Icon3 from "@/assets/icons/icon3.png"
import { motion } from "framer-motion";
import Photo2 from "@/assets/images/photo2.png"
import Photo1 from "@/assets/images/photo1.png"
import Photo3 from "@/assets/images/photo3.png"
import F1 from "@/assets/icons/f1.png"
import F2 from "@/assets/icons/f2.png"
import F3 from "@/assets/icons/f3.png"
import F4 from "@/assets/icons/f4.png"
import F5 from "@/assets/icons/f5.png"
import Sessions  from "@/components/Sessions";
import Footer from "@/components/Footer";
import FeedbackPage from "@/components/Feedback";


const cards = [
  {
    icon: Icon1,
    title: "HAPPY GLOBAL CUSTOMERS",
    percentage: "85%",
  },
  {
    icon: Icon2,
    title: "ADVANCED GYM EQUIPMENTS",
    percentage: "92%",
  },
  {
    icon: Icon3,
    title: "QUALIFIED EXPERT TRAINERS",
    percentage: "99%",
  },
];
export default function Home() {
 return (
    <div className="w-full">
      {/* First Section (Hero) */}
      <section
        className="py-8 sm:py-12 lg:py-16 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, black 0%, black 80%, #EE7838 100%)",
        }}
      >
        <div className="text-white flex flex-col items-center justify-center relative w-full px-4 sm:px-6 lg:px-8">
          {/* Text Section */}
          <motion.div
            className="text-center absolute inset-0 flex flex-col justify-center items-center z-10 w-full px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 w-full"
              style={{
                background: "linear-gradient(135deg, black 30%, #EE7838 100%)",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextStroke: "1px white",
              }}
            >
              SCULPT YOUR BODY <br />
              EXERCISE FITNESS
            </h1>
            <p
              className="text-xl sm:text-2xl lg:text-3xl w-full"
              style={{
                background: "linear-gradient(135deg, black 30%, #EE7838 100%)",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextStroke: "1px white",
              }}
            >
              ELEVATE YOUR SPIRIT
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex justify-center w-full mt-8 sm:mt-12 lg:mt-16"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              className="w-full max-w-xl h-auto object-contain"
              src={Banner.src}
              alt="Fitness Image"
            />
          </motion.div>
        </div>
      </section>

      {/* Second Section (Why Choose Us) */}
      <section className="py-8 sm:py-12 lg:py-16 flex flex-col items-center justify-center bg-black text-white">
        {/* Title & Text */}
        <div className="max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EE7838] mb-4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            WHY CHOOSE US?
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg lg:text-xl"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Our fitness programs are designed to transform your body and mind. We
            provide expert coaching, state-of-the-art equipment, and a supportive
            community to help you reach your goals.
          </motion.p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-[#222] text-white w-full max-w-sm h-64 p-6 rounded-3xl shadow-lg shadow-[#EE7838] relative flex flex-col justify-between"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              {/* Icon Box */}
              <motion.div
                className="bg-[#111] w-16 h-16 sm:w-20 sm:h-20 rounded-full absolute top-4 left-4 flex items-center justify-center shadow-lg shadow-[#EE7838]"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.3 }}
              >
                <img
                  className="h-8 sm:h-10 w-auto"
                  src={card.icon.src}
                  alt="Fitness Icon"
                />
              </motion.div>

              {/* Text & Percentage */}
              <div className="mt-auto text-base sm:text-lg flex justify-between items-center w-full">
                <motion.p
                  className="text-xl sm:text-2xl font-bold text-left"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: index * 0.3,
                  }}
                >
                  {card.title}
                </motion.p>
                <motion.span
                  className="font-extrabold text-[#EE7838] text-5xl sm:text-6xl opacity-20"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: index * 0.3,
                  }}
                >
                  {card.percentage}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Third Section (Image + Text) */}
      <section className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-screen px-4 sm:px-6 lg:px-8 bg-black">
        <div className="relative flex justify-center">
          <img
            className="w-full max-w-md sm:max-w-lg h-auto rounded-[10px]"
            src={Photo2.src}
            alt="Fitness Image"
          />
          <img
            className="absolute w-32 sm:w-40 h-auto rounded-[10px] top-[-20px] sm:top-[-30px] left-[calc(100%-8rem)] sm:left-[calc(100%-10rem)] rotate-12 sm:rotate-30"
            src={Photo1.src}
            alt="Fitness Image"
          />
          <img
            className="absolute w-32 sm:w-40 h-auto rounded-[10px] bottom-[-20px] sm:bottom-[-30px] left-[calc(100%-8rem)] sm:left-[calc(100%-10rem)] -rotate-12 sm:-rotate-30"
            src={Photo3.src}
            alt="Fitness Image"
          />
        </div>
        <div className="pt-6 w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-exbamld">
            DEDICATED TO
            <br />
            IGNITING YOUR
            <br />
            <span className="font-extrabold text-[#EE7838]">
              {" "}
              FITNESS HEALTH
            </span>
          </h3>
          <p className="mt-4 text-base sm:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga,
            sapiente eius provident veniam quis ut et maxime omnis earum at
            distinctio. Odit quae itaque voluptatum magni aliquam rem dolor enim.
          </p>
        </div>
      </section>

      {/* Fourth Section (Image Gallery) */}
      <section className="bg-black pb-8 sm:pb-12">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-16 px-4 sm:px-6 lg:px-8">
          {[F1, F2, F3, F4, F5].map((img, index) => (
            <img
              key={index}
              className="w-32 sm:w-40 lg:w-48 h-auto object-contain"
              src={img.src}
              alt="Fitness Image"
            />
          ))}
        </div>
      </section>

      {/* Fifth Section (Sessions) */}
      <section className="bg-gradient-to-t from-[#EE7838] to-black py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <Sessions />
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="bg-black py-12 sm:py-16 lg:py-20">
        <FeedbackPage />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
