import { createVNode, defineComponent, renderSlot } from 'vue'
import {
  PatchFlags,
  isArray,
  isFragment,
  isValidElementNode,
} from '@/utils/TypeUtils'

import type { VNode, VNodeArrayChildren } from 'vue'

/**
 * 结合el-form-item对子项进行响应式控制
 */
const LsyContainerResponsiveWrapper = defineComponent({
  name: 'LsyContainerResponsiveWrapper',
  props: {
    class: {
      type: [String, Array],
      default: '',
    },
    /**
     * 列数量
     */
    colCount: {
      type: Number,
      required: true,
    },
    /**
     * 是否展开
     *
     * true表示展开
     * false表示收缩
     */
    expand: {
      type: Boolean,
      required: true,
    },
    /**
     * 实际的单元格总数量(包含隐藏的和显示的)[由组件内部更新,这个只是为了方便外部使用](v-model)
     */
    realCellCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:realCellCount'],
  setup(props, { slots, emit }) {
    // retrieve the children out via a simple for loop
    // the edge case here is that when users uses directives like <v-for>, <v-if>
    // we need to go deeper until the child is not the Fragment type
    function extractChildren(
      children: VNodeArrayChildren,
      parentKey = '',
      extractedChildren: VNode[] = []
    ): VNode[] {
      children.forEach((child, loopKey) => {
        // @ts-ignore
        if (isFragment(child)) {
          if (isArray(child.children)) {
            child.children.forEach((nested, key) => {
              if (isFragment(nested) && isArray(nested.children)) {
                extractChildren(
                  nested.children,
                  `${parentKey + key}-`,
                  extractedChildren
                )
              } else {
                extractedChildren.push(
                  createVNode(
                    'div',
                    {
                      key: `LoopKey${parentKey + loopKey}`,
                    },
                    {
                      default: () => [nested],
                    },
                    PatchFlags.PROPS,
                    ['class']
                  )
                )
              }
            })
          }
          // if the current child is valid vnode, then append this current vnode
          // to item as child node.
        } else if (isValidElementNode(child)) {
          extractedChildren.push(
            createVNode(
              'div',
              {},
              {
                default: () => [child],
              },
              PatchFlags.PROPS,
              ['class']
            )
          )
        }
      })

      return extractedChildren
    }

    return () => {
      const children = renderSlot(slots, 'default', { key: 0 }, () => [])

      if ((children.children ?? []).length === 0) return null

      // loop the children, if current children is rendered via `renderList` or `<v-for>`
      if (isArray(children.children)) {
        const extractedChildren = extractChildren(children.children)
        const retArr: VNode[] = []
        const lastIndex = extractedChildren.length - 1
        for (let i = 0; i < extractedChildren.length; i++) {
          const vnodeItem = extractedChildren[i]
          if (i === 0) {
            // 第一个必显
            retArr.push(vnodeItem)
          } else if (i === lastIndex) {
            // 最后一个必显
            retArr.push(vnodeItem)
          } else if (i < props.colCount - 1) {
            // 前colCount-1个必显
            retArr.push(vnodeItem)
          } else if (props.expand) {
            // 其余单元格根据expand是否为true，决定显示或不显示
            retArr.push(vnodeItem)
          }
        }
        emit('update:realCellCount', extractedChildren.length)

        // spacer container.
        return createVNode(
          'div',
          {
            class: ['o-responsive-wrapper', props.class],
          },
          retArr,
          PatchFlags.STYLE | PatchFlags.CLASS
        )
      }

      return children.children
    }
  },
})
export default LsyContainerResponsiveWrapper
