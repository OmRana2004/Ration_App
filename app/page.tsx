"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCcw,
  Users,
  Box,
  CreditCard,
  Search,
} from "lucide-react";

export default function Viewer() {
  const [entries, setEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const [totalPeople, setTotalPeople] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const [spin, setSpin] = useState(false);

  const fetchData = async () => {
    try {
      let url = "/api/get-entries";
      if (from && to) url += `?from=${from}&to=${to}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      setEntries(data);
      setFiltered(data);
      setTotalPeople(data.length);

      const units = data.reduce(
        (sum: number, item: any) => sum + item.unit,
        0
      );
      setTotalUnits(units);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loop = async () => {
      if (!isMounted) return;

      setSpin(true);
      await fetchData();
      setTimeout(() => setSpin(false), 800);

      setTimeout(loop, 4000);
    };

    loop();

    return () => {
      isMounted = false;
    };
  }, [from, to]);

  useEffect(() => {
    const filteredData = entries.filter((e: any) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.cardType.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
  }, [search, entries]);

  const cardTypesCount = useMemo(() => {
    const types = new Set(entries.map((e: any) => e.cardType));
    return types.size;
  }, [entries]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] p-3 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-3 rounded-2xl text-white shadow">
            <Box size={20} />
          </div>
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
        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow min-w-[40%]">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            placeholder="Search name or card type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <input
  type="date"
  value={from}
  onChange={(e) => setFrom(e.target.value)}
  className="bg-white rounded-xl px-2 h-11 shadow text-sm w-[30%]"
/>

<input
  type="date"
  value={to}
  onChange={(e) => setTo(e.target.value)}
  className="bg-white rounded-xl px-2 h-11 shadow text-sm w-[30%]"
/>
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

              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{e.name}</p>

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
            <p>Showing {filtered.length} of {entries.length} records</p>

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