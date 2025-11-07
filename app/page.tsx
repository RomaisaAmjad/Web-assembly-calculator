"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Trash2 } from "lucide-react";

export default function Calculator() {
  const [wasm, setWasm] = useState<any>(null);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [activeInput, setActiveInput] = useState<"a" | "b" | null>("a");
  const [result, setResult] = useState<number | string>("");
  const [history, setHistory] = useState<{ expr: string; value: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load WebAssembly module
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/calc.wasm");
        const buf = await res.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buf);
        setWasm(instance.exports);
      } catch {
        toast.error(" Failed to load WebAssembly module");
      }
    })();
  }, []);

  // Validate inputs
  const validateInputs = (op: string): boolean => {
    const twoInputOps = ["add", "sub", "mul", "div", "pow"];
    const singleInputOps = ["inc", "dec", "fact"];

    if (twoInputOps.includes(op)) {
      if (a === "" || b === "") {
        toast.error(" Two inputs required for this operation");
        return false;
      }
    }

    if (singleInputOps.includes(op)) {
      if (a === "") {
        toast.warning("One input required for this operation");
        return false;
      }
      if (b !== "") {
        toast.warning("Only one input allowed for this operation");
        return false;
      }
    }

    if (!wasm) {
      toast.error(" WASM module not loaded yet!");
      return false;
    }

    return true;
  };

  // Perform operation
  const calculate = (op: string) => {
    if (!validateInputs(op)) return;

    const x = Number(a);
    const y = Number(b);
    let res;

    try {
      switch (op) {
        case "add": res = wasm.add(x, y); break;
        case "sub": res = wasm.sub(x, y); break;
        case "mul": res = wasm.mul(x, y); break;
        case "div":
          if (y === 0) return toast.error("Cannot divide by zero!");
          res = wasm.div(x, y);
          break;
        case "inc": res = wasm.inc(x); break;
        case "dec": res = wasm.dec(x); break;
        case "fact":
          if (x < 0) return toast.error("Factorial not defined for negative numbers!");
          res = wasm.factorial(x);
          break;
        case "pow": res = wasm.power(x, y); break;
        default: res = "Invalid operation";
      }

      setResult(res);
      setHistory(prev => [...prev, { expr: `${op}(${a || 0}, ${b || 0})`, value: res }]);
      toast.success(` ${op.toLowerCase()} successful!`);

      setTimeout(() => {
        setA("");
        setB("");
      }, 300);
    } catch {
      toast.error(" Error while calculating");
    }
  };

  // Number button click handler (knows which input is active)
  const handleNumberClick = (num: string) => {
    if (activeInput === "a") setA(prev => prev + num);
    else if (activeInput === "b") setB(prev => prev + num);
  };

  const clearHistory = () => setHistory([]);
  const deleteEntry = (index: number) => setHistory(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 to-amber-400 p-6">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: { fontSize: "14px", borderRadius: "8px", padding: "16px 16px" },
        }}
      />

      <Card className="w-full max-w-sm rounded-3xl shadow-2xl p-6 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-400">WASM Calculator</h1>

        {/* Display */}
        <div className="bg-neutral-700 text-right text-white rounded-2xl py-3 px-4 mb-4 text-2xl min-h-[48px]">
          {result || 0}
        </div>

        {/* Inputs */}
        <div className="flex gap-3 mb-4">
          <input
            type="number"
            value={a}
            onChange={e => setA(e.target.value)}
            onFocus={() => setActiveInput("a")}
            className={`w-full border-none p-2 rounded-xl bg-neutral-700 text-white text-center placeholder-gray-400 focus:ring-2 ${
              activeInput === "a" ? "focus:ring-amber-400" : "focus:ring-neutral-600"
            }`}
            placeholder="Enter A"
          />
          <input
            type="number"
            value={b}
            onChange={e => setB(e.target.value)}
            onFocus={() => setActiveInput("b")}
            className={`w-full border-none p-2 rounded-xl bg-neutral-700 text-white text-center placeholder-gray-400 focus:ring-2 ${
              activeInput === "b" ? "focus:ring-amber-400" : "focus:ring-neutral-600"
            }`}
            placeholder="Enter B"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => { setA(""); setB(""); setResult(""); }} className="bg-red-500 text-white p-4 rounded-full font-semibold">AC</button>
          <button onClick={() => (activeInput === "a" ? setA(a.slice(0, -1)) : setB(b.slice(0, -1)))} className="bg-orange-500 text-white p-4 rounded-full font-semibold">DEL</button>
          <button onClick={() => calculate("div")} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">/</button>
          <button onClick={() => calculate("mul")} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">×</button>

          {["7", "8", "9"].map(n => (
            <button key={n} onClick={() => handleNumberClick(n)} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">{n}</button>
          ))}
          <button onClick={() => calculate("sub")} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">−</button>

          {["4", "5", "6"].map(n => (
            <button key={n} onClick={() => handleNumberClick(n)} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">{n}</button>
          ))}
          <button onClick={() => calculate("add")} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">+</button>

          {["1", "2", "3"].map(n => (
            <button key={n} onClick={() => handleNumberClick(n)} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold">{n}</button>
          ))}
          <button onClick={() => calculate("pow")} className="bg-amber-500 text-black p-4 rounded-full font-semibold">^</button>

          <button onClick={() => handleNumberClick("0")} className="bg-neutral-600 hover:bg-neutral-500 text-white p-4 rounded-full font-semibold col-span-2">0</button>
          <button onClick={() => calculate("inc")} className="bg-blue-500 text-white p-4 rounded-full font-semibold">++</button>
          <button onClick={() => calculate("dec")} className="bg-purple-500 text-white p-4 rounded-full font-semibold">--</button>

          <button onClick={() => calculate("fact")} className="bg-amber-600 text-white p-4 rounded-full font-semibold col-span-4">n!</button>
        </div>

        {/* History toggle */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-500"
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>

        {/* History list */}
        {showHistory && (
          <div className="mt-4 bg-neutral-700 rounded-xl p-3 max-h-40 overflow-y-auto text-white">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center">No history yet.</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="flex justify-between items-center border-b border-neutral-600 py-1">
                  <span>{h.expr} = {h.value}</span>
                  <button onClick={() => deleteEntry(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
