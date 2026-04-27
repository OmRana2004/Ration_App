"use client";

import { useEffect, useState, useRef } from "react";
import { User, Users, CreditCard, Plus } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [cardType, setCardType] = useState("AAY");
  const [entries, setEntries] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const unitRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLSelectElement>(null);

  // ✅ fetch with retry
  const fetchData = async () => {
    try {
      let res = await fetch("/api/get-entries");

      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1500));
        res = await fetch("/api/get-entries");
      }

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
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
      setLoading(true);

      let res = await fetch("/api/add-entry", {
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

      // 🔥 retry if DB sleeping
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1500));
        res = await fetch("/api/add-entry", {
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
      }

      if (!res.ok) throw new Error("Failed");

      // ✅ success
      setName("");
      setUnit("");
      fetchData();

    } catch (error) {
      alert("❌ Failed to add. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-4">
      <div className="max-w-md mx-auto">

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white">
              <Plus size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Add Person</h1>
              <p className="text-sm text-gray-400">Enter ration details</p>
            </div>
          </div>

          {/* NAME */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-10 mb-2">
            <User size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") unitRef.current?.focus();
              }}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* UNIT */}
          <div className="flex items-center bg-gray-50 rounded-xl px-4 h-10 mb-2">
            <Users size={16} className="text-gray-400 mr-2" />
            <input
              ref={unitRef}
              type="number"
              placeholder="Enter units"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") cardRef.current?.focus();
              }}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* CARD TYPE */}
          <select
            ref={cardRef}
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            className="w-full h-11 px-4 rounded-xl bg-gray-50 text-sm outline-none mb-3"
          >
            <option value="AAY">AAY</option>
            <option value="SFY">SFY</option>
            <option value="PHH">PHH</option>
          </select>

          {/* BUTTON */}
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-1.5 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Person"}
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow-md p-3">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            Recent Entries
          </h2>

          {entries.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <>
              {(showAll ? entries : entries.slice(0, 10)).map((e: any, i) => (
                <div key={e.id} className="flex justify-between py-1.5 border-b">
                  <p>{i + 1}. {e.name}</p>
                  <p>{e.unit} ({e.cardType})</p>
                </div>
              ))}

              {entries.length > 10 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full mt-3 text-blue-500 text-sm"
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