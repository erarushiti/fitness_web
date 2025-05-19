import { useState, useEffect } from "react";
// import img from "next/img"; // Correct import for Next.js img
import { useRouter } from "next/router";
import axios from "axios"; // Add axios for API requests
import "../../app/globals.css";
import female from "../../assets/images/female.png";
import male from "../../assets/images/male.png";
import losew from "../../assets/images/losew.png";
import gain from "../../assets/images/gain.png";
import light from "../../assets/images/light.png";
import medium from "../../assets/images/medium.png";
import active from "../../assets/images/active.png";

// Interface for form values
interface FormValues {
  gender: string;
  age: string;
  goal: string;
  activity: string;
}

// Interface for supplement data
interface Supplement {
  id: string; // UUID as string
  name: string;
  description: string;
  price: number;
  img: string | null;
  goal: string;
  gender: string;
  activity: string;
  age: string;
  userId: string;
}

const StartToday: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [values, setValues] = useState<FormValues>(() => {
    const savedValues = typeof window !== "undefined" ? sessionStorage.getItem("startTodayValues") : null;
    return savedValues ? JSON.parse(savedValues) : { gender: "", age: "", goal: "", activity: "" };
  });
  const [supplements, setSupplements] = useState<Supplement[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("startTodayValues")) {
      setStep(6);
    }
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/supplement");
      if (!response.ok) throw new Error(`Failed to fetch supplements: ${response.statusText}`);
      const data: Supplement[] = await response.json();
      console.log("Fetched supplements:", data);
      setSupplements(data);
    } catch (error) {
      console.error("Error fetching supplements:", error);
    }
  };

  useEffect(() => {
    document.body.style.background = "#1c1c1c";
    document.body.style.padding = "50px 0 50px 0";
    fetchSupplements();

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleChangeAndNext = (name: keyof FormValues, value: string) => {
    const updatedValues: FormValues = { ...values, [name]: value };
    setValues(updatedValues);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("startTodayValues", JSON.stringify(updatedValues));
    }
    nextStep();
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

const handleSeeMore = async (supplement: Supplement) => {
  try {
    const response = await fetch(`http://localhost:8080/api/supplement/${supplement.id}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: Include userId if authenticated
      // body: JSON.stringify({ userId: 'your-user-id' }),
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate payment: ${response.statusText}`);
    }

    const data = await response.json();
    const { url } = data;

    window.location.href = url;
  } catch (error) {
    console.error('Error initiating payment:', error);
    // alert(`Failed to initiate payment: ${error.message || 'Unknown error'}`);
  }
};

  const handleSubmit = () => {
    console.log("Submit clicked, form values:", values);
    const { gender, age, goal, activity } = values;
    let matchingSupplements = supplements.filter(
      (supplement) =>
        (!gender || supplement.gender.toLowerCase() === gender.toLowerCase()) &&
        (!age || supplement.age === age) &&
        (!goal || supplement.goal.toLowerCase() === goal.toLowerCase()) &&
        (!activity || supplement.activity.toLowerCase() === activity.toLowerCase())
    );
    console.log("Matching supplements:", matchingSupplements);

    if (matchingSupplements.length > 0) {
      setStep(6);
    } else {
      console.log("No matching supplements found. Showing all supplements as fallback.");
      setStep(6);
    }
  };

  const resetForm = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
    setStep(1);
    setValues({
      gender: "",
      age: "",
      goal: "",
      activity: "",
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="container mx-auto px-4 py-[50px]">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-[200px]">Select Your Gender</h2>
              <div className="flex justify-center gap-4">
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.gender === "male" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("gender", "male")}
                >
                  <img src={male.src} alt="male" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Male</p>
                </div>
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.gender === "female" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("gender", "female")}
                >
                  <img src={female.src} alt="female" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Female</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-[200px]">Select Your Age Group</h2>
              <div className="grid grid-cols-2 gap-4">
                {["18-29", "30-39", "40-54", "55+"].map((group) => (
                  <div
                    key={group}
                    className={`p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                      values.age === group ? "border-[#EE7838]" : "border-gray-700"
                    } hover:border-[#EE7838]`}
                    onClick={() => handleChangeAndNext("age", group)}
                  >
                    <p className="text-white">{group}</p>
                  </div>
                ))}
              </div>
              <div className="mt-[50px]">
                <button
                  className="px-4 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
                  onClick={prevStep}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-[200px]">Select Your Goal</h2>
              <div className="flex justify-center gap-4">
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.goal === "lose" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("goal", "lose")}
                >
                  <img src={losew.src} alt="lose weight" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Lose Weight</p>
                </div>
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.goal === "gain" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("goal", "gain")}
                >
                  <img src={gain.src} alt="gain weight" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Gain Weight</p>
                </div>
              </div>
              <div className="mt-[50px]">
                <button
                  className="px-4 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
                  onClick={prevStep}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-[200px]">How Active Are You?</h2>
              <div className="flex justify-center gap-4">
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.activity === "low" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("activity", "low")}
                >
                  <img src={light.src} alt="low activity" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Low</p>
                </div>
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.activity === "moderate" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("activity", "moderate")}
                >
                  <img src={medium.src} alt="moderate activity" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">Moderate</p>
                </div>
                <div
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition bg-black border-2 ${
                    values.activity === "high" ? "border-[#EE7838]" : "border-gray-700"
                  } hover:border-[#EE7838]`}
                  onClick={() => handleChangeAndNext("activity", "high")}
                >
                  <img src={active.src} alt="high activity" width={150} height={150} className="rounded object-contain" />
                  <p className="mt-2 text-white">High</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="px-4 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
                  onClick={prevStep}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Your Input Summary</h2>
              <ul className="text-left space-y-2 bg-black p-6 rounded-lg shadow border-2 border-[#EE7838]">
                <li className="text-white">
                  <strong>Gender:</strong> {values.gender}
                </li>
                <li className="text-white">
                  <strong>Age Group:</strong> {values.age}
                </li>
                <li className="text-white">
                  <strong>Goal:</strong> {values.goal}
                </li>
                <li className="text-white">
                  <strong>Activity Level:</strong> {values.activity}
                </li>
              </ul>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="px-4 py-2 bg-black text-[#EE7838] border-2 border-[#EE7838] rounded hover:bg-[#EE7838] hover:text-black"
                  onClick={resetForm}
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Recommended Supplements</h2>
                <button
                  className="px-4 py-2 bg-black text-[#EE7838] border-2 border-[#EE7838] rounded hover:bg-[#EE7838] hover:text-black"
                  onClick={resetForm}
                >
                  Start Again
                </button>
              </div>
              {supplements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supplements.map((supplement) => (
                    <div
                      key={supplement.id}
                      className="bg-black p-6 rounded-lg shadow border-2 border-[#EE7838] hover:shadow-lg transition"
                    >
                      <div className="text-sm text-[#EE7838] font-semibold mb-2">{supplement.goal} weight</div>
                      {supplement.img ? (
                        <img
                          src={`http://localhost:8080/uploads/${supplement.img}`}
                          alt={supplement.name}
                          width={200}
                          height={200}
                          className="mx-auto rounded"
                        />
                      ) : (
                        <div className="w-[200px] h-[200px] mx-auto bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-gray-400">No img</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-white mt-4">{supplement.name}</h3>
                      <p className="text-gray-300 mt-2">{supplement.description}</p>
                      <p className="text-[#EE7838] font-bold mt-2">{supplement.price}€</p>
                      <button
                        className="mt-4 px-4 py-2 bg-[#EE7838] text-black rounded hover:bg-[#d66b30]"
                        onClick={() => handleSeeMore(supplement)}
                      >
                        Buy Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No supplements found for your criteria.</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default StartToday;