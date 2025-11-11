"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Github } from "lucide-react";
import validateOperation from "@/validators/operationValidator";
import Key from "@/types/key";

export default function Calculator() {
  const wasmRef = useRef<any>(null);

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [activeInput, setActiveInput] = useState<"a" | "b">("a");
  const [result, setResult] = useState<number | string>("");
  const [history, setHistory] = useState<
    { expr: string; value: string | number }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/calc.wasm");
        const buf = await res.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(buf);

        wasmRef.current = {
          ...instance.exports,
          sin: (x: number) => Math.sin(x),
          cos: (x: number) => Math.cos(x),
          tan: (x: number) => Math.tan(x),
          exp: (x: number) => Math.exp(x),
        };
      } catch {
        toast.error("Failed to load WebAssembly module");
      }
    })();
  }, []);

  const keypad: Key[] = [
    {
      label: "AC",
      action: "clear",
      className: "bg-[#E63946] hover:bg-[#B81D29] text-white",
    },
    {
      label: "DEL",
      action: "del",
      className: "bg-[#D7263D] hover:bg-[#A41B2C] text-white",
    },
    {
      label: "/",
      action: "div",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white",
    },
    {
      label: "%",
      action: "mod",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white",
    },
    {
      label: "×",
      action: "mul",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white",
    },

    ...["7", "8", "9"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] hover:bg-[#3A4452] text-white",
    })),
    {
      label: "−",
      action: "sub",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white",
    },

    ...["4", "5", "6"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] hover:bg-[#3A4452] text-white",
    })),
    {
      label: "+",
      action: "add",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white",
    },

    ...["1", "2", "3"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] hover:bg-[#3A4452] text-white",
    })),
    {
      label: "^",
      action: "pow",
      className: "bg-[#5C6BC0] hover:bg-[#4B56A6] text-white",
    },

    {
      label: "0",
      type: "num",
      className: "col-span-2 bg-[#2C3440] hover:bg-[#3A4452] text-white",
    },
    {
      label: "++",
      action: "inc",
      className: "bg-[#00C8A0] hover:bg-[#00A585] text-white",
    },
    {
      label: "--",
      action: "dec",
      className: "bg-[#00C8A0] hover:bg-[#00A585] text-white",
    },

    {
      label: "sin",
      action: "sin",
      className: "bg-[#5C6BC0] hover:bg-[#4B56A6] text-white",
    },
    {
      label: "cos",
      action: "cos",
      className: "bg-[#5C6BC0] hover:bg-[#4B56A6] text-white",
    },
    {
      label: "tan",
      action: "tan",
      className: "bg-[#5C6BC0] hover:bg-[#4B56A6] text-white",
    },
    {
      label: "eˣ",
      action: "exp",
      className: "bg-[#5C6BC0] hover:bg-[#4B56A6] text-white col-span-2",
    },
    {
      label: "n!",
      action: "fact",
      className: "bg-[#007ACC] hover:bg-[#0064A8] text-white col-span-2",
    },
  ];

  const run = (op: string) => {
    if (!validateOperation(op, !!wasmRef.current, a, b)) return;

    const wasm = wasmRef.current;
    const x = Number(a);
    const y = Number(b);
    let res: number | string;

    try {
      switch (op) {
        case "add":
          res = wasm.add(x, y);
          break;
        case "sub":
          res = wasm.sub(x, y);
          break;
        case "mul":
          res = wasm.mul(x, y);
          break;
        case "div":
          res = wasm.div(x, y);
          break;
        case "inc":
          res = wasm.inc(x);
          break;
        case "dec":
          res = wasm.dec(x);
          break;
        case "fact":
          res = wasm.factorial(x);
          break;
        case "pow":
          res = wasm.power(x, y);
          break;
        case "mod":
          res = wasm.mod(x, y);
          break;
        case "sin":
          res = wasm.sin((x * Math.PI) / 180);
          break;
        case "cos":
          res = wasm.cos((x * Math.PI) / 180);
          break;
        case "tan":
          res = wasm.tan((x * Math.PI) / 180);
          break;
        case "exp":
          res = wasm.exp(x);
          break;
        default:
          return;
      }
    } catch {
      toast.error("Computation error");
      return;
    }

    if (["sin", "cos", "tan", "exp"].includes(op)) {
      res = Number(Number(res).toFixed(6));
    }
    setResult(res);
    setHistory((prev) => [...prev, { expr: `${op}(${a})`, value: res }]);
    toast.success("Operation successful!");
    setTimeout(() => {
      setA("");
      setB("");
    }, 400);
  };

  const handleKey = (key: Key) => {
    if (key.type === "num") {
      activeInput === "a" ? setA(a + key.label) : setB(b + key.label);
    } else if (key.action === "clear") {
      setA("");
      setB("");
      setResult("");
    } else if (key.action === "del") {
      activeInput === "a" ? setA(a.slice(0, -1)) : setB(b.slice(0, -1));
    } else if (key.action) {
      run(key.action);
    }
  };

  const clearHistory = () => setHistory([]);
  const deleteEntry = (i: number) =>
    setHistory((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0C10] p-6">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl p-6 bg-[#1F2833] border border-[#2E3A47] transition-transform hover:scale-[1.01] duration-300">
        {/* Display */}
        <div className="bg-[#14181F] text-right text-[#EAEAEA] rounded-lg py-4 px-5 mb-5 text-2xl min-h-[48px] shadow-inner border border-[#2E3A47]">
          {result || 0}
        </div>

        {/* Inputs */}
        <div className="flex gap-3 mb-5">
          {["a", "b"].map((input) => (
            <input
              key={input}
              type="number"
              value={input === "a" ? a : b}
              onChange={(e) =>
                input === "a" ? setA(e.target.value) : setB(e.target.value)
              }
              onFocus={() => setActiveInput(input as "a" | "b")}
              className={`w-full p-3 rounded-md bg-[#14181F] text-[#EAEAEA] text-center placeholder-gray-500 focus:ring-2 focus:outline-none ${
                activeInput === input
                  ? "focus:ring-[#00C8A0]"
                  : "focus:ring-[#2E3A47]"
              }`}
              placeholder={`Enter ${input.toUpperCase()}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {keypad.map((key, i) => (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className={`rounded-lg p-4 font-semibold transition-all duration-200 text-[#EAEAEA] shadow-sm active:scale-95 hover: cursor-pointer ${
                key.className ??
                "bg-[#2C3440] hover:bg-[#3A4452] hover:cursor-pointer"
              }`}
            >
              {key.label}
            </button>
          ))}
        </div>

        {/* History Button */}
        <div className=" text-center">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="bg-[#14181F] hover:bg-[#2C3440] text-[#00C8A0] font-semibold rounded-lg border border-[#00C8A0]/40 transition-all duration-200 hover:cursor-pointer"
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>

        {/* History Section */}
        {showHistory && (
          <div className="mt-5 bg-[#14181F] rounded-xl p-4 max-h-48 overflow-y-auto text-gray-300 border border-[#2E3A47] shadow-inner">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center font-semibold">
                No history yet
              </p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className="font-semibold flex justify-between items-center py-2 border-b border-[#2E3A47]"
                >
                  <span>
                    {h.expr} = {h.value}
                  </span>
                  <button
                    aria-label="Delete"
                    onClick={() => deleteEntry(i)}
                    className="text-[#E63946] hover:text-[#e94242] transition-colors hover:cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                className="w-full mt-3 bg-[#f54756] hover:bg-[#f63333] text-white font-semibold rounded-md transition-all duration-200 hover:cursor-pointer"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </Card>

      <footer className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-400">
        <span>
          Made by{" "}
          <span className="text-[#00FFC6] font-medium">Romaisa Amjad</span>
        </span>
        <a
          href="https://github.com/RomaisaAmjad/Web-assembly-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#00B8FF] hover:text-[#00FFC6] font-semibold transition-colors"
        >
          <Github size={18} /> Github Link
        </a>
      </footer>
    </div>
  );
}
