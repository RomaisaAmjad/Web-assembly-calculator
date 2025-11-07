#  WASM Calculator

A modern **WebAssembly-powered calculator** built with **Next.js**, **Tailwind CSS**, and **shadcn/ui**.  
It integrates **low-level WebAssembly (WASM)** functions (written in Assembly language) with a **beautiful React UI**, providing fast and accurate mathematical operations.

---

##  Features

This WebAssembly calculator supports **integer arithmetic and scientific operations**, all written in **low-level Assembly (.wat)** and compiled to **`.wasm`**.

###  Supported Operations

| Category | Function | Description |
|-----------|-----------|-------------|
| **Basic Arithmetic** | `add(a, b)` | Adds two integers |
|  | `sub(a, b)` | Subtracts two integers |
|  | `mul(a, b)` | Multiplies two integers |
|  | `div(a, b)` | Divides two integers (signed division) |
|  | `mod(a, b)` | Returns the remainder of `a / b` |
| **Increment / Decrement** | `inc(a)` | Increments a number by 1 |
|  | `dec(a)` | Decrements a number by 1 |
| **Advanced Math** | `factorial(n)` | Calculates factorial (`n!`) iteratively |
|  | `square(a)` | Returns square of `a` (`a²`) |
|  | `cube(a)` | Returns cube of `a` (`a³`) |
|  | `sqrt(n)` | Approximates square root using Newton-Raphson method |
|  | `power(a, b)` | Calculates exponential (`a^b`) |


---

##  Tech Stack

| Category | Tools Used |
|:----------|:------------|
| **Framework** | [Next.js 14](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **WASM** | WebAssembly module (`calc.wasm`) compiled from Assembly (.wat) |

---

##  Project Structure
```bash
wasm-calculator/
│
├── public/
│   └── calc.wasm           # Compiled with wat2wasm (converted from Assembly .wat to .wasm)
│
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main calculator page
│   │   └── favicon.ico     # Application icon
│   │
│   ├── components/
│   │   └── ui/         # shadcn/ui components (Button, Card, etc.)
|            └── button.ts 
|            └── card.ts
|            └── input.ts
|            └── sheet.ts        
|            └── dialog.ts        
│   │
│   └── types/
│       └── key.ts          # Type definition for calculator keys
│
├── package.json
└── postcss.config.mjs

```

---

##  Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/romaisaamjad/wasm-calculator.git
cd wasm-calculator

```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Run the Development Server
```bash
npm run dev
```

Then open <a>http://localhost:3000</a> in your browser 

## 👩‍💻 Author

**Romaisa Amjad**  

