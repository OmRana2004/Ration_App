"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Users, Box, CreditCard, Search } from "lucide-react";

export default function Viewer() {
  const [entries, setEntries] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const [totalPeople, setTotalPeople] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const [spin, setSpin] = useState(false);

  // ✅ helper to update state
  const updateState = (data: any[]) => {
    setEntries(data);
    setFiltered(data);
    setTotalPeople(data.length);

    const units = data.reduce((sum, item) => sum + item.unit, 0);
    setTotalUnits(units);
  };

  // ✅ fetch with retry (fix Neon sleep)
  const fetchData = async () => {
    try {
      let url = "/api/get-entries";
      if (from && to) url += `?from=${from}&to=${to}`;

      setSpin(true);

      let res = await fetch(url, { cache: "no-store" });

      // 🔥 retry once if DB sleeping
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1500));
        res = await fetch(url, { cache: "no-store" });
      }

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      updateState(data);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setTimeout(() => setSpin(false), 800);
    }
  };

  // ✅ clean interval instead of loop
  useEffect(() => {
    fetchData(); // initial load

    const interval = setInterval(fetchData, 8000); // every 8 sec

    return () => clearInterval(interval);
  }, [from, to]);

  // ✅ search filter
  useEffect(() => {
    const filteredData = entries.filter(
      (e: any) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.cardType.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(filteredData);
  }, [search, entries]);

  // ✅ unique card types
  const cardTypesCount = useMemo(() => {
    const types = new Set(entries.map((e: any) => e.cardType));
    return types.size;
  }, [entries]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-3 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <a href="/admin">
            <div className="bg-green-500 p-3 rounded-2xl text-white shadow cursor-pointer transition active:scale-95 hover:scale-105">
              <Box size={20} />
            </div>
          </a>
          <div>
            <h1 className="text-lg font-semibold">Ration Distribution</h1>
            <p className="text-sm text-gray-400">Live tracking system</p>
          </div>
        </div>

        <button onClick={fetchData} className="text-gray-400 hover:text-black">
          <RefreshCcw size={20} className={spin ? "animate-spin" : ""} />
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-6">
        <div className="bg-blue-100 rounded-2xl p-5 text-center shadow">
          <Users className="mx-auto mb-2 text-blue-600" size={18} />
          <p className="text-xl sm:text-2xl font-bold">{totalPeople}</p>
          <p className="text-xs sm:text-sm text-gray-500">People</p>
        </div>

        <div className="bg-green-100 rounded-2xl p-5 text-center shadow">
          <Box className="mx-auto mb-2 text-green-600" size={18} />
          <p className="text-xl sm:text-2xl font-bold">{totalUnits}</p>
          <p className="text-xs sm:text-sm text-gray-500">Units</p>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5 text-center shadow">
          <CreditCard className="mx-auto mb-2 text-yellow-600" size={18} />
          <p className="text-xl sm:text-2xl font-bold">{cardTypesCount}</p>
          <p className="text-xs sm:text-sm text-gray-500">Card Types</p>
        </div>
      </div>

      {/* SEARCH + DATE */}
      <div className="flex gap-2 mb-6">
        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow w-full sm:min-w-[40%]">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            placeholder="Search name or card type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* FROM DATE */}
        <div className="relative w-[48%] sm:w-[30%]">
          {!from && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              From date
            </span>
          )}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-white rounded-xl px-2 h-11 shadow text-sm w-full"
          />
        </div>

        {/* TO DATE */}
        <div className="relative w-[48%] sm:w-[30%]">
          {!to && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              To date
            </span>
          )}
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-white rounded-xl px-2 h-11 shadow text-sm w-full"
          />
        </div>
      </div>

      {/* TABLE (FIXED — NO SCROLL) */}
      <div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-[30px_1fr_70px_90px] px-6 py-4 text-xs sm:text-sm text-gray-600 font-semibold bg-gray-200">
            <p>#</p>
            <p>NAME</p>
            <p className="text-center">UNITS</p>
            <p className="text-center">CARD TYPE</p>
          </div>

          {/* ROWS */}
          {filtered.map((e: any, i) => (
            <div
              key={e.id}
              className={`grid grid-cols-[30px_1fr_70px_90px] px-6 py-2 items-center border-t border-gray-200
              ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <p className="text-gray-400 text-xs sm:text-sm">{i + 1}</p>

              <p className="font-semibold text-gray-900 text-sm sm:text-base">
                {e.name}
              </p>

              <div className="flex justify-center">
                <span className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-50 rounded-full text-red-500 text-xs sm:text-sm font-medium">
                  {e.unit}
                </span>
              </div>

              <div className="flex justify-center">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    e.cardType === "AAY"
                      ? "bg-yellow-100 text-yellow-600"
                      : e.cardType === "PHH"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  {e.cardType}
                </span>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="grid grid-cols-[30px_1fr_70px_90px] px-6 py-4 items-center border-t border-gray-300 bg-gray-200 font-bold text-xs sm:text-sm">
            <p></p>
            <p>Total Ration Distribution</p>

            <div className="text-center text-gray-800">
              {filtered.length} People
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 text-xs sm:text-sm text-gray-400 border-t border-gray-200 gap-2">
            <p>
              Showing {filtered.length} of {entries.length} records
            </p>

            <p className="text-green-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Auto-refreshing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
