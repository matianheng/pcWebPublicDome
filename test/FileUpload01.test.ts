import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FileUpload01Vue from '@/pages/demo/other/example/file-upload/FileUpload01.vue'
import { AjaxUtil } from '@/utils/ajax/AjaxUtil'
import { delay } from 'msw'

describe('文件上传测试', () => {
  it('FileUpload01.vue', async () => {
    const uploadFileSpy = vi.spyOn(AjaxUtil, 'reqPost')
    const wrapper = mount(FileUpload01Vue)
    const inputFile2 = wrapper.find('.el-upload__input')
    let liDomArr = wrapper.findAll('.el-upload-list li')
    expect(liDomArr, '存在两个已上传文件').toHaveLength(2)
    expect(inputFile2.exists()).toBe(true)
    // console.log('inputFile2', inputFile2)
    // console.log('inputFile2.element', inputFile2.element)
    const inputFileDom = inputFile2.element as HTMLInputElement
    // 触发文件选择事件
    inputFileDom.value = '' // 清空 input 的值以避免某些情况下导致的错误
    // 创建一个模拟的File对象
    const mockFileName = 'mock-file.txt'
    const mockFile = new File(['mock file content'], mockFileName, {
      type: 'text/plain',
    })
    // const file = readFileSync('./mocks/test.xlsx')
    const changeEvent = new Event('change')
    Object.defineProperty(changeEvent, 'target', {
      value: { files: [mockFile] },
    })
    // 触发change事件，以实现文件上传回调函数
    inputFileDom.dispatchEvent(changeEvent)
    await flushPromises()
    // 等待500毫秒, 等待ajax请求执行完毕
    await delay(500)
    expect(uploadFileSpy, '上传方法执行一次').toHaveBeenCalledTimes(1)
    // 获取组件vue实例
    console.log('获取组件vue实例', wrapper.vm)
    // 再次获取li
    liDomArr = wrapper.findAll('.el-upload-list li')
    expect(liDomArr).toHaveLength(3)
    const text = liDomArr[2].text()
    console.log('text', text)
    expect(text, `包含文件名:${mockFile}`).toContain(mockFileName)
    // 清除监视
    uploadFileSpy.mockRestore()
  })
})
