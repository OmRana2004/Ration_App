"use client";

import { useEffect, useState } from "react";
import { User, Users, CreditCard, Plus } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [cardType, setCardType] = useState("AAY");
  const [entries, setEntries] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/get-entries");
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
  if (!name || !unit) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("/api/add-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        unit: Number(unit),
        cardType,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed");
    }

    //  SUCCESS (no popup)
    setName("");
    setUnit("");

    fetchData(); // refresh silently
  } catch (error) {
    //  ONLY ERROR POPUP
    alert("❌ Failed to add. Please try again");
  }
};

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4">

      <div className="max-w-md mx-auto">

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-xl text-white">
              <Plus size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Add Person</h1>
              <p className="text-sm text-gray-400">Enter ration details</p>
            </div>
          </div>

          {/* NAME */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-11 mb-3">
            <User size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* UNIT */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-11 mb-3">
            <Users size={16} className="text-gray-400 mr-2" />
            <input
              type="number"
              placeholder="Enter units"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* CARD TYPE */}
         <div className="mb-5">
  <label className="text-xs text-gray-400 mb-1 block">
    Card Type
  </label>

  <select
    value={cardType}
    onChange={(e) => setCardType(e.target.value)}
    className="w-full h-11 px-4 rounded-xl bg-gray-50 text-sm outline-none touch-manipulation active:scale-[0.99]"
  >
    <option value="AAY">AAY</option>
    <option value="SYF">SYF</option>
    <option value="PHH">PHH</option>
  </select>
</div>

          <button
            onClick={handleAdd}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl font-medium"
          >
            Add Person
          </button>
        </div>

        {/* PEOPLE LIST */}
        <div className="bg-white rounded-2xl shadow-md p-4">

          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            Recent Entries
          </h2>

          {entries.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <>
              {(showAll ? entries : entries.slice(0, 10)).map((e: any) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <p className="font-medium text-gray-800">{e.name}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{e.unit}</span>

                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {e.cardType}
                    </span>
                  </div>
                </div>
              ))}

              {/* VIEW ALL BUTTON */}
              {entries.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full mt-3 text-blue-500 text-sm font-medium hover:underline"
                >
                  {showAll ? "Show Less ▲" : "View All ▼"}
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}