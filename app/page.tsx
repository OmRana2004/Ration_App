"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCcw,
  Users,
  Box,
  CreditCard,
  Search,
  Calendar,
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
    let url = "/api/get-entries";
    if (from && to) url += `?from=${from}&to=${to}`;

    const res = await fetch(url);
    const data = await res.json();

    setEntries(data);
    setFiltered(data);

    setTotalPeople(data.length);

    const units = data.reduce((sum: number, item: any) => sum + item.unit, 0);
    setTotalUnits(units);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFrom(today);
    setTo(today);
  }, []);

  useEffect(() => {
  fetchData();

  const interval = setInterval(() => {
    fetchData();

    // spin trigger
    setSpin(true);
    setTimeout(() => setSpin(false), 800);
  }, 4000);

  return () => clearInterval(interval);
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
    <div className="min-h-screen bg-[#f6f8fb] p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
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
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-blue-100 rounded-2xl p-5 text-center shadow">
          <Users className="mx-auto mb-2 text-blue-600" size={18} />
          <p className="text-2xl font-bold">{totalPeople}</p>
          <p className="text-sm text-gray-500">People</p>
        </div>

        <div className="bg-green-100 rounded-2xl p-5 text-center shadow">
          <Box className="mx-auto mb-2 text-green-600" size={18} />
          <p className="text-2xl font-bold">{totalUnits}</p>
          <p className="text-sm text-gray-500">Units</p>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5 text-center shadow">
          <CreditCard className="mx-auto mb-2 text-yellow-600" size={18} />
          <p className="text-2xl font-bold">{cardTypesCount}</p>
          <p className="text-sm text-gray-500">Card Types</p>
        </div>
      </div>

      {/* SEARCH + DATE */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow w-full">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            placeholder="Search name or card type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow">
          <Calendar size={16} className="text-gray-400 mr-2" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="outline-none text-sm"
          />
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 h-11 shadow">
          <Calendar size={16} className="text-gray-400 mr-2" />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="outline-none text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

  {/* HEADER */}
  <div className="grid grid-cols-[40px_1fr_120px_160px] px-6 py-4 text-xs text-gray-600 font-semibold bg-gray-200">
    <p>#</p>
    <p>NAME</p>
    <p className="text-center">UNITS</p>
    <p className="text-center">CARD TYPE</p>
  </div>

  {/* ROWS */}
  {filtered.map((e: any, i) => (
    <div
      key={e.id}
      className={`grid grid-cols-[40px_1fr_120px_160px] px-6 py-2 items-center border-t border-gray-200
      ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <p className="text-gray-400 text-sm">{i + 1}</p>

      <p className="font-medium text-gray-800">{e.name}</p>

      <div className="flex justify-center">
        <span className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-sm font-medium">
          {e.unit}
        </span>
      </div>

      <div className="flex justify-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
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

  {/* 🔥 TOTAL ROW */}
  <div className="grid grid-cols-[4px_1fr_120px_160px] px-6 py-5 items-center border-t border-gray-300 bg-gray-200 font-extrabold">
    <p></p>
    <p>Total</p>

    <div className="text-center">
      {filtered.reduce((sum: number, e: any) => sum + e.unit, 0)}
    </div>

    <div className="text-center text-gray-500">
      {filtered.length} entries
    </div>
  </div>

  {/* FOOTER */}
  <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-400 border-t border-gray-200">
    <p>Showing {filtered.length} of {entries.length} records</p>

    <p className="text-green-500 flex items-center gap-2">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      Auto-refreshing
    </p>
  </div>
</div>
    </div>
  );
}