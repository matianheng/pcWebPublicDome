import { LsyFormItemConfig } from '@/components/lsy/dyn-form/typing'
import { Ref } from 'vue'

type SaveMarkErrorFun = (
  prop: string,
  _markError: string,
  callback: (ret: boolean) => void
) => Promise<void>
type ClearMarkErrorFun = (
  prop: string,
  callback: (ret: boolean) => void
) => Promise<void>

export function useMarkErrorHook(itemConfig: Ref<LsyFormItemConfig>) {
  function onSaveMarkError(
    _markError: string,
    callback: (ret: boolean) => void
  ) {
    const _onSaveMarkError = itemConfig.value.customCompEvents
      ?.onSaveMarkError as SaveMarkErrorFun
    if (_onSaveMarkError) {
      _onSaveMarkError(itemConfig.value.prop, _markError, callback)
    }
  }
  function onClearMarkError(callback: (ret: boolean) => void) {
    const _onClearMarkError = itemConfig.value.customCompEvents
      ?.onClearMarkError as ClearMarkErrorFun
    if (_onClearMarkError) {
      _onClearMarkError(itemConfig.value.prop, callback)
    }
  }
  return { onSaveMarkError, onClearMarkError }
}
