<template>
  <LsyContentContainer
    :fit-all-content="true"
    title="打字机效果"
    desc="参考资料: <a href='https://juejin.cn/post/7292395389301882931' target='_blank'>使用 CSS 实现打字机效果</a>"
  >
    <div class="w-max bg-slate-900 p-6">
      <h1 class="typing">hello 师傅, 你是做什么工作的呀?</h1>
    </div>
  </LsyContentContainer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.typing {
  overflow: hidden; /* 保证文字在动画之前隐藏 */
  margin: 0 auto;
  border-right: 0.15em solid orange; /* 使用边框实现光标 */
  white-space: nowrap;
  color: #ffffff;
  letter-spacing: 0.15em;

  /** 动画效果: 40这里表示每秒多少帧, 值越大文字显示越丝滑, 古董打印机的打字效果是那种一卡一卡的效果, 可以把这个适当调低 */
  animation: typing 3.5s steps(40, end), blink-caret 0.5s step-end infinite;
}

/* 打字机动画 */
@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

/* 光标动画 */
@keyframes blink-caret {
  0%,
  100% {
    border-color: transparent;
  }

  50% {
    border-color: orange;
  }
}
</style>
