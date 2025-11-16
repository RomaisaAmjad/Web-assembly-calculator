"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Github } from "lucide-react";
import validateOperation from "@/validators/operationValidator";
import Key from "@/types/key";

export default function Calculator() {
  const wasmRef = useRef<any>(null);

  const [mode, setMode] = useState<0 | 1>(1);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [activeInput, setActiveInput] = useState<"a" | "b">("a");
  const [result, setResult] = useState<number | string>("");

  const [lastOp, setLastOp] = useState<string | null>(null);

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
          sin: Math.sin,
          cos: Math.cos,
          tan: Math.tan,
          exp: Math.exp,
          taninv: Math.atan,
          cosinv: Math.acos,
          sininv: Math.asin,
          log: Math.log,
        };
      } catch {
        toast.error("Failed to load WebAssembly module");
      }
    })();
  }, []);

  const NormalKeys: Key[] = [
    { label: "AC", action: "clear", className: "bg-[#E63946] text-white" },
    { label: "DEL", action: "del", className: "bg-[#D7263D] text-white" },
    { label: "/", action: "div", className: "bg-[#007ACC] text-white" },
    { label: "%", action: "mod", className: "bg-[#007ACC] text-white" },
    { label: "×", action: "mul", className: "bg-[#007ACC] text-white" },

    ...["7", "8", "9"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),
    { label: "−", action: "sub", className: "bg-[#007ACC] text-white" },

    ...["4", "5", "6"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),
    { label: "+", action: "add", className: "bg-[#007ACC] text-white" },

    ...["1", "2", "3"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),

    {
      label: "0",
      type: "num",
      className: "col-span-2 bg-[#2C3440] text-white",
    },
    { label: "++", action: "inc", className: "bg-[#00C8A0] text-white" },
    { label: "--", action: "dec", className: "bg-[#00C8A0] text-white" },

    { label: "sin", action: "sin", className: "bg-[#5C6BC0] text-white" },
    { label: "cos", action: "cos", className: "bg-[#5C6BC0] text-white" },
    { label: "tan", action: "tan", className: "bg-[#5C6BC0] text-white" },

    { label: "=", action: "equal", className: "bg-[#00C8A0] text-white" },
  ];

  const AdvancedKeys: Key[] = [
    { label: "AC", action: "clear", className: "bg-[#E63946] text-white" },
    { label: "DEL", action: "del", className: "bg-[#D7263D] text-white" },

    {
      label: "eˣ",
      action: "exp",
      className: "bg-[#5C6BC0] text-white col-span-2",
    },
    {
      label: "n!",
      action: "fact",
      className: "bg-[#007ACC] text-white col-span-2",
    },
    { label: "^", action: "pow", className: "bg-[#5C6BC0] text-white" },

    ...["7", "8", "9"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),
    ...["4", "5", "6"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),
    ...["1", "2", "3"].map((n) => ({
      label: n,
      type: "num" as const,
      className: "bg-[#2C3440] text-white",
    })),

    {
      label: "0",
      type: "num",
      className: "col-span-2 bg-[#2C3440] text-white",
    },
    { label: "ln", action: "ln", className: "bg-[#5C6BC0] text-white" },
    { label: "tan⁻¹", action: "taninv", className: "bg-[#4B56A6] text-white" },

    { label: "sin⁻¹", action: "sininv", className: "bg-[#4B56A6] text-white" },
    { label: "cos⁻¹", action: "cosinv", className: "bg-[#4B56A6] text-white" },

    { label: "=", action: "equal", className: "bg-[#00C8A0] text-white" },
  ];

  const executeOp = (op: string) => {
    if (!validateOperation(op, !!wasmRef.current, a, b)) return;

    const wasm = wasmRef.current;
    const x = Number(a);
    const y = Number(b);
    let res: number | string = "";

    try {
      const ops: Record<string, any> = {
        add: () => wasm.add(x, y),
        sub: () => wasm.sub(x, y),
        mul: () => wasm.mul(x, y),
        div: () => wasm.div(x, y),
        inc: () => (wasm.inc ? wasm.inc(x) : x + 1),
        dec: () => (wasm.dec ? wasm.dec(x) : x - 1),
        mod: () => x - Math.floor(x / y) * y,
        pow: () => (wasm.power ? wasm.power(x, y) : Math.pow(x, y)),

        sin: () => wasm.sin((x * Math.PI) / 180),
        cos: () => wasm.cos((x * Math.PI) / 180),
        tan: () => wasm.tan((x * Math.PI) / 180),

        exp: () => wasm.exp(x),
        ln: () => wasm.log(x),

        sininv: () => wasm.sininv(x),
        cosinv: () => wasm.cosinv(x),
        taninv: () => wasm.taninv(x),
        fact: () => wasm.factorial(x),

      };

      if (!ops[op]) return toast.error("Unknown operation");

      res = ops[op]();

      if (
        [
          "sin",
          "cos",
          "tan",
          "exp",
          "ln",
          "sininv",
          "cosinv",
          "taninv",
        ].includes(op)
      ) {
        res = Number(Number(res).toFixed(6));
      }
    } catch {
      return toast.error("Computation error");
    }

    setResult(res);

    const expr = ["add", "sub", "mul", "div", "pow", "mod"].includes(op)
      ? `${op}(${a}, ${b})`
      : `${op}(${a})`;

    setHistory((prev) => [...prev, { expr, value: res }]);
  };

  const handleKey = (key: Key) => {
    if (key.type === "num") {
      activeInput === "a"
        ? setA((v) => v + key.label)
        : setB((v) => v + key.label);
      return;
    }

    if (key.action === "clear") {
      setA("");
      setB("");
      setResult("");
      setLastOp(null);
      return;
    }

    if (key.action === "del") {
      activeInput === "a"
        ? setA((v) => v.slice(0, -1))
        : setB((v) => v.slice(0, -1));
      return;
    }

    if (key.action === "equal") {
      if (!lastOp) return toast.error("No operation selected");
      executeOp(lastOp);
      return;
    }

    setLastOp(key.action!);
    toast.success(`Operation selected: ${key.label}`);
  };

  const clearHistory = () => setHistory([]);
  const deleteEntry = (i: number) =>
    setHistory((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0C10] p-6">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl p-6 bg-[#1F2833] border border-[#2E3A47]">
        {/* Display */}
        <div className="bg-[#14181F] text-right text-[#EAEAEA] rounded-lg py-4 px-5 mb-5 text-2xl min-h-[48px]">
          {result || 0}
        </div>

        {/* Inputs */}
        <div className="flex gap-3 mb-2">
          {["a", "b"].map((input) => (
            <input
              key={input}
              type="number"
              value={input === "a" ? a : b}
              onChange={(e) =>
                input === "a" ? setA(e.target.value) : setB(e.target.value)
              }
              onFocus={() => setActiveInput(input as "a" | "b")}
              className={`w-full p-3 rounded-md bg-[#14181F] text-[#EAEAEA] text-center ${
                activeInput === input
                  ? "focus:ring-[#00C8A0]"
                  : "focus:ring-[#2E3A47]"
              }`}
              placeholder={`Enter ${input.toUpperCase()}`}
            />
          ))}
        </div>

        {/* Mode switch */}
        <button
          onClick={() => setMode((prev) => (prev ? 0 : 1))}
          className="rounded-lg p-3 font-semibold bg-[#5C6BC0] text-white w-full mb-2"
        >
          {mode === 1 ? "Switch to Advanced" : "Switch to Normal"}
        </button>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {(mode === 1 ? NormalKeys : AdvancedKeys).map((key, i) => (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className={`rounded-lg p-4 font-semibold text-[#EAEAEA] active:scale-95 ${
                key.className || "bg-[#2C3440]"
              }`}
            >
              {key.label}
            </button>
          ))}
        </div>

        {/* History */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowHistory((v) => !v)}
            className="mt-4 text-[#00C8A0] border-[#00C8A0]/40"
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </div>

        {showHistory && (
          <div className="mt-5 bg-[#14181F] rounded-xl p-4 max-h-48 overflow-y-auto text-gray-300">
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
                    className="text-[#E63946] hover:text-[#FF7070]"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}

            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                className="w-full mt-3 bg-[#f54756] text-white"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </Card>

      <footer className="mt-6 text-gray-400 text-sm text-center">
        <span>
          Developed by <span className="text-[#00FFC6]">Romaisa Amjad</span>
        </span>
        <a
          href="https://github.com/RomaisaAmjad/Web-assembly-calculator"
          target="_blank"
          className="flex items-center justify-center gap-2 mt-1 text-[#00B8FF] hover:text-[#00FFC6]"
        >
          <Github size={18} /> Github Link
        </a>
      </footer>
    </div>
  );
}
