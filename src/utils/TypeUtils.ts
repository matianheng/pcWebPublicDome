export {
  isArray,
  isFunction,
  isObject,
  isString,
  isDate,
  isPromise,
  isSymbol,
  // eslint-disable-next-line vue/prefer-import-from-vue
} from '@vue/shared'
import { isNil } from 'lodash-unified'
import { Fragment, VNode, isVNode, Comment, Text } from 'vue'

export const isUndefined = (val: any): val is undefined => val === undefined
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
export const isNumber = (val: any): val is number => typeof val === 'number'

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  // @ts-ignore
  (isArray(val) && val.length === 0) ||
  // @ts-ignore
  (isObject(val) && !Object.keys(val).length)

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

export const isPropAbsent = (prop: unknown): prop is null | undefined => {
  return isNil(prop)
}

export const isStringNumber = (val: string): boolean => {
  // @ts-ignore
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}

export function isFragment(node: VNode): boolean
export function isFragment(node: unknown): node is VNode
export function isFragment(node: unknown): node is VNode {
  return isVNode(node) && node.type === Fragment
}
export function isText(node: VNode): boolean
export function isText(node: unknown): node is VNode
export function isText(node: unknown): node is VNode {
  return isVNode(node) && node.type === Text
}

export function isComment(node: VNode): boolean
export function isComment(node: unknown): node is VNode
export function isComment(node: unknown): node is VNode {
  return isVNode(node) && node.type === Comment
}

const TEMPLATE = 'template'
export function isTemplate(node: VNode): boolean
export function isTemplate(node: unknown): node is VNode
export function isTemplate(node: unknown): node is VNode {
  return isVNode(node) && node.type === TEMPLATE
}
/**
 * determine if the element is a valid element type rather than fragments and comment e.g. <template> v-if
 * @param node {VNode} node to be tested
 */
export function isValidElementNode(node: VNode): boolean
export function isValidElementNode(node: unknown): node is VNode
export function isValidElementNode(node: unknown): node is VNode {
  return isVNode(node) && !isFragment(node) && !isComment(node)
}
export enum PatchFlags {
  TEXT = 1,
  CLASS = 2,
  STYLE = 4,
  PROPS = 8,
  FULL_PROPS = 16,
  HYDRATE_EVENTS = 32,
  STABLE_FRAGMENT = 64,
  KEYED_FRAGMENT = 128,
  UNKEYED_FRAGMENT = 256,
  NEED_PATCH = 512,
  DYNAMIC_SLOTS = 1024,
  HOISTED = -1,
  BAIL = -2,
}
export function isNotNullAndNotUndefined(val: unknown): boolean {
  return val !== undefined && val !== null
}
