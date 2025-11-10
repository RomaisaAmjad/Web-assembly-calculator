(module
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

  (func $mod (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.rem_s)

  (func $inc (param $a i32) (result i32)
    local.get $a
    i32.const 1
    i32.add)

  (func $dec (param $a i32) (result i32)
    local.get $a
    i32.const 1
    i32.sub)

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

  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "mod" (func $mod))
  (export "inc" (func $inc))
  (export "dec" (func $dec))
  (export "factorial" (func $factorial))
  (export "power" (func $power))
)
