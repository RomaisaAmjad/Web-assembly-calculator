(module
  ;; ---------------------------
  ;; INTEGER & FLOAT PARAMETERS
  ;; ---------------------------

  ;; Basic arithmetic (float-capable)
  (func $add (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.add)

  ;; SUB
  (func $sub (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.sub)

  (func $mul (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.mul)

  (func $div (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.div)

  ;; increment / decrement
  (func $inc (param $a f64) (result f64)
    local.get $a
    f64.const 1
    f64.add)

  (func $dec (param $a f64) (result f64)
    local.get $a
    f64.const 1
    f64.sub)

  ;; factorial (needs integers but returns f64)
  (func $factorial (param $n f64) (result f64)
    (local $i f64)
    (local $res f64)
    
    f64.const 1
    local.set $res

    local.get $n
    local.set $i

    (loop $loop
      local.get $i
      f64.const 1
      f64.gt
      if
        local.get $res
        local.get $i
        f64.mul
        local.set $res

        local.get $i
        f64.const 1
        f64.sub
        local.set $i

        br $loop
      end
    )
    local.get $res)

  ;; Power
  (func $power (param $a f64) (param $b f64) (result f64)
    (local $res f64)
    f64.const 1
    local.set $res

    (loop $loop
      local.get $b
      f64.const 0
      f64.gt
      if
        local.get $res
        local.get $a
        f64.mul
        local.set $res

        local.get $b
        f64.const 1
        f64.sub
        local.set $b

        br $loop
      end
    )
    local.get $res)

  ;; exports
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "inc" (func $inc))
  (export "dec" (func $dec))
  (export "factorial" (func $factorial))
  (export "power" (func $power))
)
