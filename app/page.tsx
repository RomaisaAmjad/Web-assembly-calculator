"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import Key from "@/types/key";

export default function Calculator() {
  const wasmRef = useRef<any>(null);

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [activeInput, setActiveInput] = useState<"a" | "b">("a");
  const [result, setResult] = useState<number | string>("");
  const [history, setHistory] = useState<{ expr: string; value: string | number }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/calc.wasm");
        const buf = await res.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buf);
        wasmRef.current = instance.exports;
      } catch {
        toast.error("Failed to load WebAssembly module");
      }
    })();
  }, []);

  const keypad: Key[] = [
    { label: "AC", action: "clear", className: "bg-red-500" },
    { label: "DEL", action: "del", className: "bg-orange-500" },
    { label: "/", action: "div", className: "bg-neutral-600" },
    { label: "×", action: "mul", className: "bg-neutral-600" },

    ...["7", "8", "9"].map(n => ({ label: n, type: "num" as const })),
    { label: "−", action: "sub", className: "bg-neutral-600" },

    ...["4", "5", "6"].map(n => ({ label: n, type: "num" as const })),
    { label: "+", action: "add", className: "bg-neutral-600" },

    ...["1", "2", "3"].map(n => ({ label: n, type: "num" as const })),
    { label: "^", action: "pow", className: "bg-amber-500 text-black" },

    { label: "0", type: "num", className: "col-span-2" },
    { label: "++", action: "inc", className: "bg-blue-500" },
    { label: "--", action: "dec", className: "bg-purple-500" },

    { label: "n!", action: "fact", className: "col-span-4 bg-amber-600 text-white" },
  ];

  const validate = (op: string) => {
    const two = ["add", "sub", "mul", "div", "pow"];
    const one = ["inc", "dec", "fact"];

    if (!wasmRef.current) return toast.error("WASM not loaded"), false;
    if (two.includes(op) && (a === "" || b === "")) return toast.error("Two inputs required"), false;
    if (one.includes(op) && a === "") return toast.warning("Enter A first"), false;
    if (op === "div" && Number(b) === 0) return toast.error("Cannot divide by zero"), false;
    if (op === "fact" && Number(a) < 0) return toast.error("Invalid factorial input"), false;
    return true;
  };

  const run = (op: string) => {
    if (!validate(op)) return;

    const wasm = wasmRef.current;
    const x = Number(a);
    const y = Number(b);
    let res: number | string;

    switch (op) {
      case "add": res = wasm.add(x, y); break;
      case "sub": res = wasm.sub(x, y); break;
      case "mul": res = wasm.mul(x, y); break;
      case "div": res = wasm.div(x, y); break;
      case "inc": res = wasm.inc(x); break;
      case "dec": res = wasm.dec(x); break;
      case "fact": res = wasm.factorial(x); break;
      case "pow": res = wasm.power(x, y); break;
      default: return;
    }

    setResult(res);
    setHistory(prev => [...prev, { expr: `${op}(${a || 0}${b ? `, ${b}` : ""})`, value: res }]);
    toast.success("Done!");

    setTimeout(() => { setA(""); setB(""); }, 250);
  };

  const handleKey = (key: Key) => {
    if (key.type === "num") {
      activeInput === "a" ? setA(a + key.label) : setB(b + key.label);
    } else if (key.action === "clear") {
      setA(""); setB(""); setResult("");
    } else if (key.action === "del") {
      activeInput === "a" ? setA(a.slice(0, -1)) : setB(b.slice(0, -1));
    } else if (key.action) {
      run(key.action);
    }
  };

  const clearHistory = () => setHistory([]);
  const deleteEntry = (i: number) => setHistory(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-200 to-amber-400 p-6">
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl p-6 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-400">WASM Calculator</h1>

        <div className="bg-neutral-700 text-right text-white rounded-2xl py-3 px-4 mb-4 text-2xl min-h-[48px]">
          {result || 0}
        </div>

        <div className="flex gap-3 mb-4">
          {["a", "b"].map(input => (
            <input
              key={input}
              type="number"
              value={input === "a" ? a : b}
              onChange={e => input === "a" ? setA(e.target.value) : setB(e.target.value)}
              onFocus={() => setActiveInput(input as "a" | "b")}
              className={` hover:cursor-default w-full p-2 rounded-xl bg-neutral-700 text-white text-center focus:ring-2 ${
                activeInput === input ? "focus:ring-amber-400" : "focus:ring-neutral-600"
              }`}
              placeholder={`Enter ${input.toUpperCase()}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {keypad.map((key, i) => (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className={` hover:cursor-pointer rounded-full p-4 text-white font-semibold hover:brightness-125 transition ${
                key.className ?? "bg-neutral-600"
              }`}
            >
              {key.label}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className=" hover:cursor-pointer bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-500"
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>

        {showHistory && (
          <div className="mt-4 bg-neutral-700 rounded-xl p-3 max-h-40 overflow-y-auto text-white">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center">No history yet.</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-neutral-600">
                  <span>{h.expr} = {h.value}</span>
                  <button onClick={() => deleteEntry(i)} className="text-red-400 hover:text-red-600 hover:cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            {history.length > 0 && (
              <Button onClick={clearHistory} className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                Clear All
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
