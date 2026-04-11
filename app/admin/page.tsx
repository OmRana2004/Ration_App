"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [cardType, setCardType] = useState("AAY");

  const handleAdd = async () => {
    if (!name || !unit) return alert("Fill all fields");

    await fetch("/api/add-entry", {
      method: "POST",
      body: JSON.stringify({
        name,
        unit: Number(unit),
        cardType,
      }),
    });

    setName("");
    setUnit("");
    alert("Added ✅");
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Person</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="number"
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <select
        value={cardType}
        onChange={(e) => setCardType(e.target.value)}
        className="border p-2 w-full mb-3"
      >
        <option value="AAY">AAY</option>
        <option value="SYF">SYF</option>
        <option value="PHH">PHH</option>
      </select>

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white w-full p-2 rounded"
      >
        Add Person
      </button>
    </div>
  );
}