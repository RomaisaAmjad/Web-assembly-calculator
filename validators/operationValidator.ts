import { toast } from "sonner";

export const twoOperandOps = ["add", "sub", "mul", "div", "pow", "mod"];

export const oneOperandOps = [
  "inc",
  "dec",
  "fact",
  "sin",
  "cos",
  "tan",
  "exp",
  "log",
  "taninv",
  "sininv",
  "cosinv",
  "pow"
];

 function validateOperation(
  op: string,
  wasmLoaded: boolean,
  a: string,
  b: string
): boolean {

  if (!wasmLoaded) {
    console.warn("WASM not loaded");
  }

  if (twoOperandOps.includes(op)) {
    if (!a || !b) {
      toast.error("Two values are required for this operation");
      return false;
    }
    if (op === "div" && Number(b) === 0) {
      toast.error("Cannot divide by zero");
      return false;
    }
    return true;
  }

  if (oneOperandOps.includes(op)) {
    if (!a && !b) {
      toast.error("Enter a value in field A");
      return false;
    }
    if (b !== "" && a === "") {
      toast.error("Single-operand operations use field A only");
      return false;
    }
    if (b !== "" && a !== "") {
      toast.error("Single-operand operations cannot use both fields");
      return false;
    }
    if (op === "fact" && Number(a) < 0) {
      toast.error("Factorial cannot be negative");
      return false;
    }
    return true;
  }

  return true;
}

export default validateOperation;