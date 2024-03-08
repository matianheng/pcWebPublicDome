import { expect, test } from 'vitest'
import { add } from 'lodash-unified'
import Big from 'big.js'
test('lodash 的 add 方法无法解决精度问题', () => {
  console.log(0.1 + 0.2)
  expect(0.1 + 0.2).toBe(0.30000000000000004)
  console.log(add(0.1, 0.2))
  expect(add(0.1, 0.2)).toBe(0.30000000000000004)
})

test('big.js 解决精度丢失问题', () => {
  expect(new Big(0.1).add(0.2).toNumber()).toBe(0.3)
})
