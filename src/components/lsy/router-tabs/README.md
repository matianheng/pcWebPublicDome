# 路由tab组件说明

## 如何使用

### 将组件引入

引入 `LsyRouterTabsKeepAliveWrapper.vue` 组件，并在该组件中设置tab元数据获取方式, tab元数据数据结构

```ts
export interface LsyBaseTabMetadata extends Record<string, unknown> {
  /**
   * 唯一标识(必填)
   */
  index?: string
  /**
   * 名称(必填)
   */
  name?: string
  /**
   * 图标
   */
  icon?: string
  /**
   * 菜单跳转路由地址
   */
  routePath?: string
  /**
   * 用户自定义数据
   */
  customDataMap?: Map<string, unknown>
  /**
   * 标签页是否可关闭. 默认: true
   */
  closeAble: boolean
}
export interface LsyTabMetadata extends LsyBaseTabMetadata {
  /**
   * 子菜单
   */
  children?: LsyTabMetadata[]
}
```

### 通过路由配置，来控制 `keep-alive` 缓存

```ts
declare module 'vue-router' {
  interface RouteMeta {
    // 该vue组件对应的tab是否可关闭. 默认: true
    closeAble?: boolean
    // 是否对该vue组件实例进行keep-alive缓存. 默认: false
    keepAlive?: boolean
    /**
     * 当keepAlive为true时, 该配置生效. 表示仅当从当前路由到指定路由时，才保存当前路由的keep-alive缓存，否清除该缓存
     * 当keepAlive为true时, 如果不配置该字段，则表示当前路由在任何时候，都启用keep-alive缓存
     */
    onlyToRouteKeepAlive?: string[]
    /**
     * keep-alive渲染的包装组件是否使用route.path值构建.默认:true
     * 如果为true, 则包装的组件名为: RouteName_md5(route.path)
     * 如果为false, 则包装的组件名为: RouteName_Wrapper
     */
    useRoutePathAsWrapperCompName?: boolean
  }
}
```

## 文件说明

* `LsyRouterTabsKeepAliveWrapper.vue`: 该组件内部调用了 `LsyRouterTabs.vue` 组件和 `LsyRouterViewKeepAliveWrapper.vue` 组件
* `LsyRouterTabs.vue`: 实现tab效果，以及暴露相关事件
* `LsyRouterViewKeepAliveWrapper.vue`: 实现 `keep-alive` 组件的缓存控制

## `LsyRouterTabs.vue` 和 `LsyRouterViewKeepAliveWrapper.vue` 组件如何通信

通过事件总线(emitter组件)进行。

## 原理简述

### 新建tab

**tab控制**

`RouterTabs.vue` 组件，通过 watch 方式监听路由变化，当检测到当前新路由在 `openedTabArr` 中不存在时，则将当前路由信息，添加到 `openedTabArr` 中

**keep-alive缓存控制**

 `RouterViewKeepAliveWrapper.vue` 组件中，监听 `onBeforeRouteUpdate` 事件, 对 from 路由的 mate 数据进行解析，判断是否需要对 from 路由进行缓存，如果需要进行缓存，则将路由名存入 keep-alive 的 include 中，否则，从 include 中删除

### 关闭当前tab

### 关闭非当前tab

### 刷新

1. `LsyRouterViewKeepAliveWrapper.vue` 文件中，通过一个boolean变量 `showRouterViewComp`，使用v-if来控制组件的销毁与创建
2. 在更新了boolean变量为false之后, 从 keep-alive 的 include 中删除对应路由名, 然后在 `nextTick` 再次更新 boolean 变量为true，并再次将路由名，放入 keep-alive 的 include 中
