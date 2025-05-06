import React from "react";

interface Trainer {
  name: string;
  title: string;
  description: string;
  image: string;
}

interface Props {
  trainer: Trainer;
}

const TrainerCard: React.FC<Props> = ({ trainer }) => {
  return (
    <div className="bg-[#1a1a1a] text-white p-4 rounded-xl shadow-md w-full max-w-xs">
      <img
        src={trainer.image}
        alt={trainer.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold">{trainer.name}</h3>
      <p className="text-sm text-orange-400">{trainer.title}</p>
      <p className="text-sm mt-2">{trainer.description}</p>
    </div>
  );
};

export default TrainerCard;
