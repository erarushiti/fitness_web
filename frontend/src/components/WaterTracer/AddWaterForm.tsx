import React, { useState, useEffect } from "react";

export function AddWaterForm({ onAdd }: { onAdd: (amount: number) => void }) {
    const [custom, setCustom] = useState("");
  
    return (
      <div className="flex gap-2 items-center mt-4">
        {[250, 500, 750].map((amt) => (
          <button key={amt} onClick={() => onAdd(amt)} className="bg-blue-500 text-white px-3 py-1 rounded-full">
            {amt}ml
          </button>
        ))}
        <input
          type="number"
          placeholder="Custom amount (ml)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="border px-2 py-1 rounded-md"
        />
        <button onClick={() => { onAdd(Number(custom)); setCustom(""); }} className="bg-green-500 text-white px-3 py-1 rounded-md">
          Add
        </button>
      </div>
    );
  }
  