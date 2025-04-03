"use client";
import Banner from "@/assets/images/banerrr.png"
import Icon1 from "@/assets/icons/icon1.png"
import Icon2 from "@/assets/icons/icon2.png"
import Icon3 from "@/assets/icons/icon3.png"
import { motion } from "framer-motion";

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
    {/* First Section */}
    <section
      className="py-16 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, black 0%, black 80%, #EE7838 100%)",
      }}
    >
      <div className="text-white flex flex-col items-center justify-center relative w-full">
        {/* Text Section */}
        <motion.div
          className="text-center absolute inset-0 flex flex-col justify-center items-center z-10 w-full px-8"
          initial={{ opacity: 0, x: -100 }} // Start off-screen left
          animate={{ opacity: 1, x: 0 }} // Move to normal position
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1
            className="text-[5rem] font-bold mb-4 w-full"
            style={{
              background: "linear-gradient(135deg, black 30%, #EE7838 100%)",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextStroke: "2px white",
            }}
          >
            SCULPT YOUR BODY <br />
            EXERCISE FITNESS
          </h1>
          <p
            className="text-[3rem] w-full"
            style={{
              background: "linear-gradient(135deg, black 30%, #EE7838 100%)",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextStroke: "2px white",
            }}
          >
            ELEVATE YOUR SPIRIT
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex justify-center z-20 w-full mt-16"
          initial={{ opacity: 0, x: 100 }} // Start off-screen right
          animate={{ opacity: 1, x: 0 }} // Move to normal position
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img className="max-h-screen object-contain" src={Banner.src} alt="Fitness Image" />
        </motion.div>
      </div>
    </section>

    {/* Second Section */}
    <section className="py-16 flex flex-col items-center justify-center bg-black text-white">
      {/* Title & Text */}
      <div className="max-w-4xl text-center px-8">
        <motion.h2
          className="text-5xl font-bold text-[#EE7838] mb-4"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          WHY CHOOSE US?
        </motion.h2>
        <motion.p
          className="text-xl"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Our fitness programs are designed to transform your body and mind.
          We provide expert coaching, state-of-the-art equipment, and a
          supportive community to help you reach your goals.
        </motion.p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-[#222] text-white w-96 h-64 p-6 rounded-4xl shadow-lg shadow-[#EE7838] relative flex flex-col justify-between"
            initial={{ opacity: 0, y: 100 }} // Box comes from bottom
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.3 }}
          >
            {/* Icon Box (From Left) */}
            <motion.div
              className="bg-[#111] w-1/3 h-1/3 rounded-full absolute top-4 left-4 flex items-center justify-center shadow-lg shadow-[#EE7838]"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.3 }}
            >
             <img className="h-10 w-auto" src={card.icon.src} alt="Fitness Icon" />

            </motion.div>

            {/* Text & Percentage */}
            <div className="mt-auto text-lg flex justify-between items-center w-full">
              {/* Text (From Left) */}
              <motion.p
                className="text-2xl font-bold text-left"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.3 }}
              >
                {card.title}
              </motion.p>

              {/* Percentage (From Right) */}
              <motion.span
                className="font-extrabold text-[#EE7838] text-[70px] opacity-20"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: index * 0.3 }}
              >
                {card.percentage}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    <section>
      
    </section>
  </div>
  
  



  
  
  );
}
