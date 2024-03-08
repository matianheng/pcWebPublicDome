<template>
  <div :key="dynKey">
    <editor
      v-model="tinymceValue"
      :init="init"
      :disabled="disabled"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
// tinymce 使用了 globalThis,但 globalThis 在chrome 71, edge 79, firefix 65 才开始支持，这里使用 polyfill 方式解决
import 'globalthis/auto'
// tinymce 使用了 Promise.allSettled,但 Promise.allSettled 在chrome 76, edge 79, firefix 71 才开始支持，这里使用 polyfill 方式解决
import 'core-js/actual/promise'
import tinymce, {
  RawEditorOptions,
  Editor as TinyEditor,
} from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 解决icons.js异常问题
import 'tinymce/icons/default'

// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/quickbars'
import { computed } from 'vue'
import { toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { ref } from 'vue'

defineOptions({
  name: 'LsyTinymce',
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    plugins?: string
    toolbar?: string
    /**
     * 高度. 将值设置为100%则会充满所在容器
     */
    height?: string | number
    /**
     * 语言. 默认: zh-Hans
     *
     * 英文: en
     * 繁体中文: zh-Hant
     * 简体中文: zh-Hans
     *
     * 其他语言: 要先下载语言包，再将语言包放入 public目录的tinymce目录
     */
    language?: string
    /**
     * 是否自动获取焦点
     */
    autoFocus?: boolean
  }>(),
  {
    modelValue: undefined,
    toolbar:
      'undo redo | quickimage quicktable | blocks blockquote | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image | code | fullscreen myBtn',
    plugins:
      'quickbars code advlist lists image media wordcount link fullscreen',
    height: undefined,
    language: 'zh-Hans',
  }
)
const $emits = defineEmits<{
  'update:modelValue': [modelValue?: string]
  /**
   * 这个change事件只会在编辑器失去焦点的时候才会触发
   *
   * 如果期望在值变化的时候，加入逻辑，则直接监听v-model变量的变化即可
   */
  change: [editor: TinyEditor | null]
}>()
const { modelValue, plugins, toolbar, height, language, autoFocus } =
  toRefs(props)

const dynKey = ref(1)
watch([plugins, toolbar, height, language], () => {
  // 插件, 工具条, 高度或语言变化时, 则重新初始化tinymce编辑器
  dynKey.value += 1
})
const tinymceValue = computed({
  get() {
    return modelValue.value
  },
  set(val?: string) {
    $emits('update:modelValue', val)
  },
})

const projectBasePath =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_PUBLIC_BASEPATH
    : '/'
// 设置基础路径，解决: models/dom/model.js 404问题
tinymce.baseURL = `${projectBasePath}tinymce`
const languageComputed = computed(() =>
  language.value === 'en' ? undefined : language.value
)
const languageUrl = computed(() =>
  language.value === 'en'
    ? undefined
    : `${projectBasePath}tinymce/${language.value}.js`
)
const init = computed(() => ({
  // 是否自动获取焦点
  auto_focus: autoFocus.value,
  language_url: languageUrl.value,
  language: languageComputed.value,
  skin_url: `${projectBasePath}tinymce/skins/ui/oxide`,
  content_css: `${projectBasePath}tinymce/skins/content/default/content.css`,
  plugins: plugins.value,
  toolbar: toolbar.value,
  object_resizing: false, //禁用表格内联样式拖拽拉伸
  table_resize_bars: false, //禁用表格单元格拖拽拉伸
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  height: height.value,
  font_formats:
    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
  branding: false, //不显示富文本支持方
  contextmenu: 'undo redo | cut copy paste pastetext | selectall table', // 富文本右键菜单
  menubar: false,
  // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
  images_upload_handler: (blobInfo: any, success: any, failure: any) => {
    const file = blobInfo.blob() || {}
    if (!file || !file.size) return
    const maxSize = 10
    if (file.size > maxSize * 1024 * 1024) {
      ElMessage.warning(`图片最大尺寸是${maxSize}M`)
      return
    }
  },
  file_picker_types: 'file image',
  resize: false,
  quickbars_insert_toolbar: false,
  setup(editor: TinyEditor) {
    // 这是自定义工具栏按钮
    editor.ui.registry.addButton('myBtn', {
      text: '自定义',
      tooltip: '自定义工具按钮',
      onAction: () => {
        const dialogConfig = {
          title: '上传图片',
          body: {
            type: 'panel',
            items: [],
          },
          buttons: [],
        }
        // @ts-ignore
        editor.windowManager.open(dialogConfig)
        console.log('点击自定义工具按钮')
        editor.execCommand(
          'mceInsertContent',
          false,
          `<img src='https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg'/>`
        )
      },
    })
  },
}))

function onChange(e: any) {
  const editor: TinyEditor | null = tinymce.activeEditor
  $emits('change', editor)
}
/**
 * 获取纯文本内容
 */
function getText() {
  const editor: TinyEditor | null = tinymce.activeEditor
  if (editor) {
    return editor.getContent({ format: 'text' })
  }
  return undefined
}
defineExpose({
  getText,
})
</script>

<style scoped></style>
