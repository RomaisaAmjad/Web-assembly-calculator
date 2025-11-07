(module
  ;; --- Basic Arithmetic ---
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  (func $sub (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub)

  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)

  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s)

  ;; --- Modulus (remainder) ---
  (func $mod (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.rem_s)

  ;; --- Increment / Decrement ---
  (func $inc (param $a i32) (result i32)
    local.get $a
    i32.const 1
    i32.add)

  (func $dec (param $a i32) (result i32)
    local.get $a
    i32.const 1
    i32.sub)

  ;; --- Factorial (iterative) ---
  (func $factorial (param $n i32) (result i32)
    (local $i i32)
    (local $res i32)
    i32.const 1
    local.set $res
    local.get $n
    local.set $i
    (loop $loop
      local.get $i
      i32.const 1
      i32.gt_s
      if
        local.get $res
        local.get $i
        i32.mul
        local.set $res
        local.get $i
        i32.const 1
        i32.sub
        local.set $i
        br $loop
      end)
    local.get $res)

  ;; --- Square (a²) ---
  (func $square (param $a i32) (result i32)
    local.get $a
    local.get $a
    i32.mul)

  ;; --- Cube (a³) ---
  (func $cube (param $a i32) (result i32)
    local.get $a
    local.get $a
    i32.mul
    local.get $a
    i32.mul)

  ;; --- Square Root (integer approximation using Newton-Raphson) ---
  (func $sqrt (param $n i32) (result i32)
    (local $x i32)
    (local $y i32)
    local.get $n
    local.set $x
    (loop $loop
      local.get $x
      local.get $n
      local.get $x
      i32.div_s
      i32.add
      i32.const 1
      i32.shr_s  ;; divide by 2
      local.set $y
      local.get $x
      local.get $y
      i32.ne
      if
        local.get $y
        local.set $x
        br $loop
      end)
    local.get $x)

  ;; --- Exponential (a^b) ---
  (func $power (param $a i32) (param $b i32) (result i32)
    (local $res i32)
    i32.const 1
    local.set $res
    (loop $loop
      local.get $b
      i32.const 0
      i32.gt_s
      if
        local.get $res
        local.get $a
        i32.mul
        local.set $res
        local.get $b
        i32.const 1
        i32.sub
        local.set $b
        br $loop
      end)
    local.get $res)

  ;; --- Export all functions ---
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "mod" (func $mod))
  (export "inc" (func $inc))
  (export "dec" (func $dec))
  (export "factorial" (func $factorial))
  (export "square" (func $square))
  (export "cube" (func $cube))
  (export "sqrt" (func $sqrt))
  (export "power" (func $power))
)
