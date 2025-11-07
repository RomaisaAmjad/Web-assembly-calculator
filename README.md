#  WASM Calculator

A modern **WebAssembly-powered calculator** built with **Next.js**, **Tailwind CSS**, and **shadcn/ui**.  
It integrates **low-level WebAssembly (WASM)** functions (written in Assembly language) with a **beautiful React UI**, providing fast and accurate mathematical operations.

---

## Features

-  **Basic Operations** — Addition, Subtraction, Multiplication, Division  
-  **Advanced Functions** — Power, Factorial, Increment, Decrement  
- **WebAssembly Integration** — All core math functions run in WASM for performance  
-  **Modern UI** — Built with `shadcn/ui` + `Tailwind CSS`  
-  **History Panel** — View, delete, or clear previous calculations  
-  **Interactive Keypad** — Smooth transitions and hover effects  
-  **Error Handling** — Toast notifications for invalid inputs or failed operations  

---

##  Tech Stack

| Category | Tools Used |
|:----------|:------------|
| **Framework** | [Next.js 14](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **WASM** | WebAssembly module (`calc.wasm`) for math logic |

---
##  Project Structure

wasm-calculator/
│
├── public/
│ └── calc.wasm # Compiled with wat2wasm (converted from Assembly .wat to .wasm)
│
├── src/
│ ├── app/
│ │ ├── page.tsx # Main calculator page
│ │ └── favicon.ico # Application icon
│ │
│ ├── components/
│ │ └── ui/ # shadcn/ui components (Button, Card, etc.)
│ │
│ └── types/
│ └── key.ts # Type definition for calculator keys
│
├── package.json
└── tailwind.config.js


##  Setup & Installation

### 1 Clone the Repository
git clone https://github.com/RomaisaAmjad/wasm-calculator.git
cd wasm-calculator

### 2 Install dependencies
npm install

### 3 Run the development server
npm run dev

### How It Works

The calculator UI is rendered using React components (Next.js App Router).

On page load, it fetches and instantiates the calc.wasm module.

When a user clicks a button, the corresponding WASM function is called:

Example: wasm.add(a, b) or wasm.factorial(a)

The result is displayed in real-time, and stored in a local history list.

### Author

### Romaisa Amjad



