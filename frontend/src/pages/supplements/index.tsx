// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import male from "@/public/assets/male.png";
// import female from "@/public/assets/female.png";
// import gain from "@/public/assets/gain.png";
// import losew from "@/public/assets/losew.png";
// import light from "@/public/assets/light.png";
// import medium from "@/public/assets/medium.png";
// import active from "@/public/assets/active.png";

// export default function StartTodaySupplements() {
//   const [step, setStep] = useState(1);
//   const [values, setValues] = useState(() => {
//     if (typeof window !== "undefined") {
//       const saved = sessionStorage.getItem("startTodayValues");
//       return saved ? JSON.parse(saved) : { gender: "", age: "", goal: "", activity: "" };
//     }
//     return { gender: "", age: "", goal: "", activity: "" };
//   });
//   const [supplements, setSupplements] = useState([]);

//   useEffect(() => {
//     if (typeof window !== "undefined" && sessionStorage.getItem("startTodayValues")) {
//       setStep(6);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchSupplements = async () => {
//       try {
//         const res = await fetch("/api/supplements");
//         const data = await res.json();
//         setSupplements(data);
//       } catch (err) {
//         console.error("Error fetching supplements", err);
//       }
//     };
//     fetchSupplements();
//   }, []);

//   const next = () => setStep((prev) => prev + 1);
//   const back = () => setStep((prev) => prev - 1);

//   const updateValue = (key: string, val: string) => {
//     const updated = { ...values, [key]: val };
//     setValues(updated);
//     sessionStorage.setItem("startTodayValues", JSON.stringify(updated));
//     next();
//   };

//   const reset = () => {
//     sessionStorage.clear();
//     setValues({ gender: "", age: "", goal: "", activity: "" });
//     setStep(1);
//   };

//   const handleSubmit = () => {
//     const { gender, age, goal, activity } = values;
//     const matched = supplements.filter(
//       (s: any) =>
//         s.gender.toLowerCase() === gender &&
//         s.age === age &&
//         s.goal.toLowerCase() === goal &&
//         s.activity.toLowerCase() === activity
//     );
//     if (matched.length > 0) {
//       setStep(6);
//     } else {
//       alert("No matching supplement plans found.");
//     }
//   };

//   const renderStep = () => {
//     const Button = ({ children, onClick }: any) => (
//       <button
//         onClick={onClick}
//         className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 mt-4"
//       >
//         {children}
//       </button>
//     );

//     switch (step) {
//       case 1:
//         return (
//           <div className="text-center p-6">
//             <h2 className="text-2xl font-bold mb-4">Select Your Gender</h2>
//             <div className="flex justify-center gap-8">
//               {["male", "female"].map((gender) => (
//                 <div
//                   key={gender}
//                   className={`cursor-pointer p-2 border-2 rounded-lg ${
//                     values.gender === gender ? "border-blue-500" : "border-gray-300"
//                   }`}
//                   onClick={() => updateValue("gender", gender)}
//                 >
//                   <Image
//                     src={gender === "male" ? male : female}
//                     alt={gender}
//                     width={100}
//                     height={100}
//                   />
//                   <p>{gender.charAt(0).toUpperCase() + gender.slice(1)}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="text-center p-6">
//             <h2 className="text-2xl font-bold mb-4">Select Your Age Group</h2>
//             <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
//               {["18-29", "30-39", "40-54", "55+"].map((age) => (
//                 <button
//                   key={age}
//                   className={`p-4 rounded border ${
//                     values.age === age ? "bg-blue-500 text-white" : "bg-white"
//                   }`}
//                   onClick={() => updateValue("age", age)}
//                 >
//                   {age}
//                 </button>
//               ))}
//             </div>
//             <Button onClick={back}>Back</Button>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="text-center p-6">
//             <h2 className="text-2xl font-bold mb-4">What’s Your Goal?</h2>
//             <div className="flex justify-center gap-8">
//               <div
//                 className={`cursor-pointer p-2 border-2 rounded-lg ${
//                   values.goal === "gain" ? "border-blue-500" : "border-gray-300"
//                 }`}
//                 onClick={() => updateValue("goal", "gain")}
//               >
//                 <Image src={gain} alt="gain" width={100} height={100} />
//                 <p>Gain</p>
//               </div>
//               <div
//                 className={`cursor-pointer p-2 border-2 rounded-lg ${
//                   values.goal === "lose" ? "border-blue-500" : "border-gray-300"
//                 }`}
//                 onClick={() => updateValue("goal", "lose")}
//               >
//                 <Image src={losew} alt="lose" width={100} height={100} />
//                 <p>Lose</p>
//               </div>
//             </div>
//             <Button onClick={back}>Back</Button>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="text-center p-6">
//             <h2 className="text-2xl font-bold mb-4">How Active Are You?</h2>
//             <div className="flex justify-center gap-8">
//               {[{ key: "low", img: light }, { key: "moderate", img: medium }, { key: "high", img: active }].map(({ key, img }) => (
//                 <div
//                   key={key}
//                   className={`cursor-pointer p-2 border-2 rounded-lg ${
//                     values.activity === key ? "border-blue-500" : "border-gray-300"
//                   }`}
//                   onClick={() => updateValue("activity", key)}
//                 >
//                   <Image src={img} alt={key} width={100} height={100} />
//                   <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
//                 </div>
//               ))}
//             </div>
//             <Button onClick={back}>Back</Button>
//           </div>
//         );
//      case 5:
//   return (
//     <div className="text-center p-6">
//       <h2 className="text-xl font-bold mb-4">Summary</h2>
//       <ul className="mb-4">
//         {Object.entries(values).map(([k, v]) => (
//           <li key={k}>
//             {/* <strong>{k}:</strong> {v || "N/A"} */}
//           </li>
//         ))}
//       </ul>
//       <Button onClick={handleSubmit}>Submit</Button>
//       <Button onClick={reset}>Restart</Button>
//     </div>
//   );

//       case 6:
//         return (
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold">Supplement Recommendations</h2>
//               <Button onClick={reset}>Start Over</Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {supplements
//                 .filter(
//                   (s: any) =>
//                     s.gender === values.gender &&
//                     s.age === values.age &&
//                     s.goal === values.goal &&
//                     s.activity === values.activity
//                 )
//                 .map((s: any) => (
//                   <div key={s.id} className="border rounded p-4 shadow">
//                     <h3 className="text-xl font-semibold mb-2">{s.name}</h3>
//                     <p className="mb-2">{s.description}</p>
//                     <p className="mb-2 font-bold">{s.price} €</p>
//                     <Button onClick={() => alert(`Proceed to buy: ${s.name}`)}>See More & Pay</Button>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return <div className="min-h-screen bg-gradient-to-br from-green-100 to-pink-100">{renderStep()}</div>;
// }
