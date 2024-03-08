import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginVue from '@/pages/Login.vue'
import { AjaxUtil } from '@/utils/ajax/AjaxUtil'
import { delay } from 'msw'

describe('登录界面测试', () => {
  it('登录按钮点击后应该调用登录函数', async () => {
    const loginSpy = vi.spyOn(AjaxUtil, 'reqPost')
    const wrapper = mount(LoginVue)
    /*
    这段代码: await wrapper.find('[data-test="login-btn"]').trigger('click')
    相当于:
      wrapper.find('[data-test="login-btn"]').trigger('click')
      await nextTick()
     */
    const dom = wrapper.find('[data-test="login-btn"]')
    // 判断元素是否存在
    expect(dom.exists(), '登录按钮存在').toBe(true)
    // dom.attributes() 获取所有属性. toHaveProperty('disabled') 断言有 disabled 属性
    // expect(dom.attributes()).toHaveProperty('disabled')
    // dom.classes() 获取所有class名, toContainEqual 判断是否包含指定class名
    // expect(dom.classes()).toContainEqual('myClassName')
    await dom.trigger('click')
    /*
    这段代码: await flushPromises() (目的是等待ajax请求执行完毕)
    相当于:
      await new Promise((resolve)=>setTimeout(()=>{resolve()},1))
     */
    await flushPromises()
    // 等待2.5秒, 等待ajax请求执行完毕
    await delay(2500)
    // console.log(wrapper.html())
    // 预期 AjaxUtil.reqPost 方法被调用1次
    expect(loginSpy, '登录方法执行一次').toHaveBeenCalledTimes(1)
    // 预期 AjaxUtil.reqPost 方法的执行时会使用 这两个参数，第一个请求url，第二个请求参数
    expect(loginSpy, '使用admin登录').toHaveBeenCalledWith('/api/login', {
      data: { account: 'admin', pwd: 'admin' },
    })
    // 清除监视
    loginSpy.mockRestore()
  })
})
