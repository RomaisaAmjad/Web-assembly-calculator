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
      className:
        "bg-gray-400 hover:bg-gray-500 text-white hover:cursor-pointer",
    },
    {
      label: "DEL",
      action: "del",
      className: "bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer",
    },
    {
      label: "/",
      action: "div",
      className:
        "bg-gray-700 hover:bg-gray-800 text-white hover:cursor-pointer",
    },
    {
      label: "×",
      action: "mul",
      className:
        "bg-gray-700 hover:bg-gray-800 text-white hover:cursor-pointer",
    },

    ...["7", "8", "9"].map((n) => ({ label: n, type: "num" as const })),
    {
      label: "−",
      action: "sub",
      className:
        "bg-gray-700 hover:bg-gray-800 text-white hover:cursor-pointer",
    },

    ...["4", "5", "6"].map((n) => ({ label: n, type: "num" as const })),
    {
      label: "+",
      action: "add",
      className:
        "bg-gray-700 hover:bg-gray-800 text-white hover:cursor-pointer",
    },

    ...["1", "2", "3"].map((n) => ({ label: n, type: "num" as const })),
    {
      label: "^",
      action: "pow",
      className:
        "bg-blue-600 hover:bg-blue-700 text-white hover:cursor-pointer",
    },

    {
      label: "0",
      type: "num",
      className: "col-span-2 bg-gray-600 hover:bg-gray-700 text-white",
    },
    {
      label: "++",
      action: "inc",
      className:
        "bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer",
    },
    {
      label: "--",
      action: "dec",
      className:
        "bg-yellow-600 hover:bg-yellow-700 text-white hover:cursor-pointer",
    },

    {
      label: "sin",
      action: "sin",
      className:
        "bg-[#723D46] hover:bg-[#5D3141] text-white hover:cursor-pointer",
    },
    {
      label: "cos",
      action: "cos",
      className:
        "bg-[#723D46] hover:bg-[#5D3141] text-white hover:cursor-pointer",
    },
    {
      label: "tan",
      action: "tan",
      className:
        "bg-[#723D46] hover:bg-[#5D3141] text-white hover:cursor-pointer",
    },
    {
      label: "eˣ",
      action: "exp",
      className:
        "bg-[#723D46] hover:bg-[#5D3141] text-white hover:cursor-pointer",
    },

    {
      label: "n!",
      action: "fact",
      className:
        "col-span-4 bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer",
    },
  ];

  const validate = (op: string) => {
    const two = ["add", "sub", "mul", "div", "pow"];
    const one = ["inc", "dec", "fact", "sin", "cos", "tan", "exp"];

    if (!wasmRef.current) {
      toast.error("WASM not loaded");
      return false;
    }

    if (two.includes(op)) {
      if (a === "" || b === "") {
        toast.error("Two values are required to perform this operation");
        return false;
      }
      if (op === "div" && Number(b) === 0) {
        toast.error("Cannot divide by zero");
        return false;
      }
      return true;
    }

    if (one.includes(op)) {
      if (a === "" && b === "") {
        toast.error("Enter a value in the first field (A)");
        return false;
      }
      if (b !== "" && a === "") {
        toast.error("Single-input operations use field A only");
        return false;
      }
      if (b !== "" && a !== "") {
        toast.error("Single-input operations cannot use both fields");
        return false;
      }
      if (op === "fact" && Number(a) < 0) {
        toast.error("Invalid factorial input");
        return false;
      }
      return true;
    }

    return true;
  };

  const run = (op: string) => {
    if (!validate(op)) return;

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
    toast.success("Done!");
    setTimeout(() => {
      setA("");
      setB("");
    }, 250);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <Card className="w-full max-w-lg rounded-md shadow-xl p-6 bg-white border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          WASM Calculator
        </h1>

        <div className="bg-gray-100 text-right text-gray-800 rounded-md py-3 px-4 mb-4 text-2xl min-h-[48px] shadow-inner border border-gray-300">
          {result || 0}
        </div>

        <div className="flex gap-3 mb-4">
          {["a", "b"].map((input) => (
            <input
              key={input}
              type="number"
              value={input === "a" ? a : b}
              onChange={(e) =>
                input === "a" ? setA(e.target.value) : setB(e.target.value)
              }
              onFocus={() => setActiveInput(input as "a" | "b")}
              className={`w-full p-2 rounded-md bg-gray-100 text-black text-center focus:ring-2 ${
                activeInput === input
                  ? "focus:ring-gray-900"
                  : "focus:ring-gray-700"
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
              className={`rounded-sm p-4 font-semibold transition text-white shadow-md ${
                key.className ??
                "bg-gray-700 hover:bg-gray-800 hover:cursor-pointer"
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
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-md border border-gray-400 hover:cursor-pointer"
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>

        {showHistory && (
          <div className="mt-4 bg-white rounded-xl p-3 max-h-40 overflow-y-auto text-gray-800 border border-gray-300 shadow-inner">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center">No history yet.</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-1 border-b border-gray-200"
                >
                  <span>
                    {h.expr} = {h.value}
                  </span>
                  <button
                    onClick={() => deleteEntry(i)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
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
