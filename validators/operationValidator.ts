import { toast } from "sonner";

 function validateOperation(
  op: string,
  wasmLoaded: boolean,
  a: string,
  b: string
): boolean {
  const twoOperandOps = ["add", "sub", "mul", "div", "pow", "mod"];
  const oneOperandOps = ["inc", "dec", "fact", "sin", "cos", "tan", "exp"];

  if (!wasmLoaded) {
    toast.error("WASM not loaded");
    return false;
  }

  if (twoOperandOps.includes(op)) {
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

  if (oneOperandOps.includes(op)) {
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
}

export default validateOperation;