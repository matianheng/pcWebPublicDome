<script setup lang="ts">
import { ref } from 'vue'
import type { OrgTreeNodeData } from './typing.d'

withDefaults(
  defineProps<{
    treeData?: OrgTreeNodeData[]
  }>(),
  { treeData: () => [] }
)

/**
 * 层级节点的间隔
 */
const levelNodeMargin = ref<number>(30)
const borderRadius = ref<string>('5px')
</script>

<template>
  <div class="o-lsy-org-tree">
    <ul>
      <li>
        <div>Parent</div>
        <ul>
          <li>
            <div>1.Child</div>
            <ul>
              <li>
                <div>1.1.Grand Child</div>
              </li>
            </ul>
          </li>
          <li>
            <div>2.Child</div>
            <ul>
              <li>
                <div>2.1.Grand Child</div>
                <ul>
                  <li><div>2.1.1.Grand Child the text is long</div></li>
                </ul>
              </li>
              <li><div>2.2.Grand Child</div></li>
              <li>
                <div>2.3.Grand Child</div>
                <ul>
                  <li>
                    <div>2.3.1.Great Grand Child</div>
                  </li>
                  <li>
                    <div>2.3.2.Great Grand Child</div>
                  </li>
                  <li>
                    <div>2.3.3.Great Grand Child</div>
                  </li>
                  <li>
                    <div>2.3.4.Great Grand Child</div>
                  </li>
                  <li>
                    <div>2.3.5.Great Grand Child</div>
                  </li>
                  <li>
                    <div>2.3.6.Great Grand Child</div>
                  </li>
                </ul>
              </li>
              <li><div>2.4.Grand Child</div></li>
            </ul>
          </li>
          <li><div>3.Grand Child</div></li>
          <li><div>4.Grand Child</div></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.o-lsy-org-tree {
  overflow: auto;

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  ul {
    position: relative;

    // 基于flex实现树的层级结构
    display: flex;
    margin-top: calc(v-bind(levelNodeMargin) * 1px);

    // 清除第一个ul的margin-top
    &:first-child {
      margin-top: 0;
    }

    // 节点正下方的竖向连线
    &::before {
      position: absolute;
      top: -30px; /* px-to-viewport-ignore */
      left: 50%;
      border-left: 2px solid green; /* px-to-viewport-ignore */
      height: 18px; /* px-to-viewport-ignore */
      content: '';
    }

    // 去除第一个ul的before伪元素
    &:first-child::before {
      display: none;
    }
  }

  li {
    position: relative;

    // 以下css实现li下的子元素水平居中的效果
    display: flex;
    align-items: center;
    padding: 3px; /* px-to-viewport-ignore */
    box-sizing: border-box;

    // 让内容将li撑开
    flex-shrink: 0;
    flex-direction: column;

    // 节点矩形样式
    > div {
      border: 1px solid red;
      border-radius: 3px; /* px-to-viewport-ignore */
      padding: 10px 15px; /* px-to-viewport-ignore */
      color: lightseagreen;
      cursor: pointer;
    }

    // 节点左上横竖连线
    &::before {
      position: absolute;
      top: -13px; /* px-to-viewport-ignore */
      left: 1px;
      border-top: 2px solid green; /* px-to-viewport-ignore */
      border-right: 2px solid green; /* px-to-viewport-ignore */
      width: calc(50% + 1px);
      height: 15px; /* px-to-viewport-ignore */
      content: '';
    }

    // 节点右上横竖连线
    &::after {
      position: absolute;
      top: -13px; /* px-to-viewport-ignore */
      right: -1px;
      border-top: 2px solid green; /* px-to-viewport-ignore */
      border-left: 2px solid green; /* px-to-viewport-ignore */
      width: calc(50% + 1px);
      height: 15px; /* px-to-viewport-ignore */
      content: '';
    }
  }

  // 去除所有ul下所有非第一个li的before伪元素的右边框(避免重复绘制竖线)
  ul > li + li::before {
    border-right: none;
  }

  // 隐藏所有ul下第一个li的左上连线, 隐藏所有ul下最后一个li的右上连线
  ul > li:first-child::before,
  ul > li:last-child::after {
    display: none;
  }

  // 设置所有ul下第一个li的右上横竖连线，连线的圆角
  ul > li:first-child {
    &::after {
      border-top-left-radius: v-bind(borderRadius);
    }
  }

  // 设置所有ul下最后一个li的左上横竖连线，连线的圆角
  ul > li:last-child {
    &::before {
      border-top-right-radius: v-bind(borderRadius);

      // 因为 ul > li + li:before 选择器中将ul下的非第一个li的竖线都去除了，导致最后一个li无竖线,所以这里补全
      border-right: 2px solid green; /* px-to-viewport-ignore */
    }
  }

  /*
  该选择器表示找到ul下只有一个子节点的 li。属于:only-child的替换写法
  :only-child 详见: 
  https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-child
  
  https://blog.csdn.net/qiuqiu1894/article/details/107663181
   */
  ul > li:first-child:last-child {
    &::after {
      position: absolute;
      top: -30px; /* px-to-viewport-ignore */
      left: 50%;
      display: block;
      border-top: none;
      height: 32px; /* px-to-viewport-ignore */
      border-top-left-radius: 0;
    }
  }

  ul:first-child > li:first-child {
    // 去除第一个ul下的第一个li的after伪元素
    &::after {
      display: none;
    }
  }
}
</style>
