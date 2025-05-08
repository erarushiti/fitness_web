export default function CircularProgress({ value, max }: { value: number; max: number }) {
    const percentage = (value / max) * 100;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
  
    return (
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          stroke="#e5e7eb" strokeWidth="10" fill="none"
        />
        <circle
          cx="50" cy="50" r={radius}
          stroke="#3b82f6" strokeWidth="10" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-lg fill-blue-600">
          {value}ml
        </text>
      </svg>
    );
  }
  