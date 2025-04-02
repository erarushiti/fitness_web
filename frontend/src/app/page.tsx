
import Banner from "@/assets/images/banerrr.png"
import Icon1 from "@/assets/icons/icon1.png"
import Icon2 from "@/assets/icons/icon2.png"
import Icon3 from "@/assets/icons/icon3.png"


export default function Home() {
  return (
    <div className="w-full">
    {/* First Section */}
    <section
      className="py-16 flex flex-col items-center justify-center relative"
      style={{
        background: 'linear-gradient(135deg, black 0%, black 80%, #EE7838 100%)',
      }}
    >
      <div className="text-white flex flex-col items-center justify-center relative w-full">
        {/* Text Section */}
        <div className="text-center absolute inset-0 flex flex-col justify-center items-center z-10 w-full px-8">
          <h1
            className="text-[5rem] font-bold mb-4 w-full"
            style={{
              background: 'linear-gradient(135deg, black 30%, #EE7838 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '2px white',
            }}
          >
            SCULPT YOUR BODY <br />
            EXERCISE FITNESS
          </h1>
          <p
            className="text-[3rem] w-full"
            style={{
              background: 'linear-gradient(135deg, black 30%, #EE7838 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '2px white',
            }}
          >
            ELEVATE YOUR SPIRIT
          </p>
        </div>

        {/* Image Section */}
        <div className="flex justify-center z-20 w-full mt-16">
          <img
            className="max-h-screen object-contain"
            src={Banner.src}
            alt="Fitness Image"
          />
        </div>
      </div>
    </section>

    {/* Second Section */}
    <section className="py-16 flex flex-col items-center justify-center bg-black text-white ">

      <div className="max-w-4xl text-center px-8">
        <h2 className="text-5xl font-bold text-[#EE7838] mb-4">
          WHY CHOOSE US?
        </h2>
        <p className="text-xl">
          Our fitness programs are designed to transform your body and mind.
          We provide expert coaching, state-of-the-art equipment, and a
          supportive community to help you reach your goals.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-40">
  {/* Box 1 */}
  <div className="bg-[#222] text-white w-96 h-64 p-6 rounded-4xl shadow-lg shadow-[#EE7838] relative flex flex-col justify-between">
  {/* Icon Box */}
  <div className="bg-[#111] w-1/3 h-1/3 rounded-full absolute top-4 left-4 flex items-center justify-center shadow-lg shadow-[#EE7838]">
    <img className="h-10" src={Icon1.src} alt="Fitness Image" />
  </div>

  {/* Text at the Bottom */}
  <div className="mt-auto text-center text-lg">
  <div className="flex items-center justify-center space-x-2">
    <p className="text-2xl text-left font-bold">HAPPY GLOBAL CUSTOMERS</p>
    <span className="font-extrabold text-[#EE7838] text-[70px] opacity-20">85%</span>
  </div>
</div>

</div>

  

  {/* Box 2 */}
  <div className="bg-[#222] text-white w-96 h-64 p-6 rounded-4xl shadow-lg shadow-[#EE7838] relative flex flex-col justify-between">
  {/* Icon Box */}
  <div className="bg-[#111] w-1/3 h-1/3 rounded-full absolute top-4 left-4 flex items-center justify-center shadow-lg shadow-[#EE7838]">
    <img className="h-10" src={Icon2.src} alt="Fitness Image" />
  </div>

  {/* Text at the Bottom */}
  <div className="mt-auto text-center text-lg">
  <div className="flex items-center justify-center space-x-2">
    <p className="text-2xl text-left font-bold">ADVANCED GYM EQUIPMENTS</p>
    <span className="font-extrabold text-[#EE7838] text-[70px] opacity-20">92%</span>
  </div>
</div>

</div>


  {/* Box 3 */}
  <div className="bg-[#222] text-white w-96 h-64 p-6 rounded-4xl shadow-lg shadow-[#EE7838] relative flex flex-col justify-between">
  {/* Icon Box */}
  <div className="bg-[#111] w-1/3 h-1/3 rounded-full absolute top-4 left-4 flex items-center justify-center shadow-lg shadow-[#EE7838]">
    <img className="h-10" src={Icon3.src} alt="Fitness Image" />
  </div>

  {/* Text at the Bottom */}
  <div className="mt-auto text-center text-lg flex items-center justify-center w-full">
    <div className="flex items-center justify-center space-x-2 w-full">
      <p className="text-2xl text-left font-bold">QUALIFIED EXPERT TRAINERS</p>
      <span className="font-extrabold text-[#EE7838] text-[70px] opacity-20">99%</span>
    </div>
  </div>


</div>

</div>


    </section>
  </div>
  
  



  
  
  );
}
