type Key =
  | { label: string; type: "num"; className?: string; action?: never }
  | { label: string; action: string; className?: string; type?: never };

export default Key;
