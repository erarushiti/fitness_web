export default function WaterLevel({ amount, goal }: { amount: number; goal: number }) {
    const height = (amount / goal) * 100;
  
    return (
      <div className="relative w-24 h-48 border-2 border-blue-400 rounded-md overflow-hidden bg-blue-100">
        <div
          className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
          style={{ height: `${height}%` }}
        />
      </div>
    );
  }
  