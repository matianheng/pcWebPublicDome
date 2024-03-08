import { VNodeChild, VNodeNormalizedChildren } from 'vue'
import { isComment, isFragment, isTemplate } from './TypeUtils'

/**
 * get a valid child node (not fragment nor comment)
 * @param node {VNode} node to be searched
 * @param depth {number} depth to be searched
 */
function getChildren(
  node: VNodeNormalizedChildren | VNodeChild,
  depth: number
): VNodeNormalizedChildren | VNodeChild {
  if (isComment(node)) return
  if (isFragment(node) || isTemplate(node)) {
    return depth > 0 ? getFirstValidNode(node.children, depth - 1) : undefined
  }
  return node
}

export const getFirstValidNode = (
  nodes: VNodeNormalizedChildren,
  maxDepth = 3
) => {
  if (Array.isArray(nodes)) {
    return getChildren(nodes[0], maxDepth)
  } else {
    return getChildren(nodes, maxDepth)
  }
}
