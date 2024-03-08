import { LsyMenuItemType } from '@/components/lsy/menu/typing'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LsyTabMetadata } from '@/components/lsy/router-tabs/typing'
import { LsyBreadcrumbItem } from '@/components/lsy/breadcrumb/typing'
import { reduceMenuArr } from '../components/lsy/menu/LsyMenuUtil'
import { loadMenuData } from '@/pages/demo/mock-api/ListApi'
import { useRoute } from 'vue-router'

function copySystemMenuItemExcludeChildren(val: LsyMenuItemType) {
  const ret: LsyMenuItemType = {
    ...val,
  }
  ret.children = undefined
  return ret
}

export const useLsyMenuBreadcrumbTabStore = defineStore(
  'lsy-menu-breadcrumb-tab-store',
  () => {
    /**
     * 完整菜单数据
     */
    const menuArr = ref<LsyMenuItemType[]>([])
    const clickedRootMenuItemRouteName = ref<string>()
    /**
     * key 为 LsyMenuItemType 的 index 值
     */
    const routeNameMapMenu = ref<Map<string, LsyMenuItemType>>(
      new Map<string, LsyMenuItemType>()
    )

    const routeNameList = ref<string[]>([])

    /**
     * 将数组结构转换为map结构，并填充hasHideChild和parentIndex属性值
     * @param arr 待转换的数组
     * @returns
     */
    function menuArrToMap(arr: LsyMenuItemType[]) {
      const map = new Map<string, LsyMenuItemType>()
      reduceMenuArr(arr, map)
      fitHasHideChildFieldAndParentIndex(map)
      return map
    }
    /**
     * 填充 hasHideChild 屬性和 parentId 屬性
     * @param map
     */
    function fitHasHideChildFieldAndParentIndex(
      map: Map<string, LsyMenuItemType>
    ) {
      map.forEach(val => {
        // 设置当前菜单项的 hasHideChild 属性和 parentIndex 属性
        val.hasHideChild = childHasHideItem(val)
      })
    }
    /**
     * 判断 item 的直属子菜单，是否包含 hide 属性为 true 的项。并设置子菜单的 parentIndex 属性
     * @param item 菜单项目
     * @returns 返回 true 表示子菜单项中包含 hide 属性为 true 的项, 否则表示不包含
     */
    function childHasHideItem(item: LsyMenuItemType) {
      if (!item.children || item.children.length === 0) {
        return false
      } else {
        let hide = false
        item.children.forEach(child => {
          // 设置子菜单的 parentIndex
          child.parentIndex = item.index
          if (child.hide) {
            hide = child.hide
          }
        })
        return hide
      }
    }

    const rootMenuArr = computed<LsyMenuItemType[]>(() =>
      menuArr.value.map(item => copySystemMenuItemExcludeChildren(item))
    )

    /**
     * 系统tab元数据
     */
    const tabMetadataArr = ref<LsyTabMetadata[]>()
    /**
     * 面包屑元数据
     */
    const breadcrumbItemMetadataArr = ref<LsyBreadcrumbItem[]>()

    /**
     * 更新选中的根菜单(用于混合布局模式下，自动更新侧边菜单)
     * @param routeName 路由名
     */
    function updateClickedRootMenuItemRouteName(routeName: string) {
      /*
      更新该属性，会触发 LsyLayoutAndMenuStore.ts#sideMenuData 的计算属性更新
      
      P.S. 原本该计算属性应该写在当前store中，但pinia的store不能相互依赖
        (即:LsyLayoutStore.ts, LsyMenuBreadcrumbTabStore.ts不能存在你中有我，我中有你的情况)，
        因此抽取到了一个公共Store(LsyLayoutAndMenuStore.ts)
       */
      clickedRootMenuItemRouteName.value = routeName
    }

    /**
     * 复制arr为一个新数组(复制过程中填充rootIndex值)
     *
     * @param arr 待复制数据
     * @param loopLevel 当前遍历深度
     * @param rootIndex 根菜单项的index
     */
    function copyAndFitRootIndex(
      arr: LsyMenuItemType[],
      loopLevel: number,
      rootIndex?: string
    ): LsyMenuItemType[] {
      const ret: LsyMenuItemType[] = []
      if (arr === undefined || arr === null || arr.length === 0) {
        return ret
      }

      for (const item of arr) {
        const tmp: LsyMenuItemType = { ...item }
        // 设置菜单项所属的根菜单项index
        tmp.rootIndex = rootIndex
        ret.push(tmp)
        if (
          undefined !== tmp.children &&
          null !== tmp.children &&
          tmp.children.length > 0
        ) {
          // 当遍历深度为0的时候，将当前tmp的index作为rootIndex向下传递, 当rootIndex有值的时候，将rootIndex继续向下传递
          const tmpRootIndex =
            loopLevel === 0 ? tmp.index : rootIndex ? rootIndex : undefined
          tmp.children = copyAndFitRootIndex(
            tmp.children,
            loopLevel + 1,
            tmpRootIndex
          )
        }
      }
      return ret
    }

    /**
     * 更新菜单数据, tab数据, 面包屑数据(菜单/tab/面包屑数据结构实际是一样的)
     * @param val 菜单数据
     */
    function updateMenuTabBreadcrumbData(val: LsyMenuItemType[]) {
      const arr: LsyMenuItemType[] = copyAndFitRootIndex(val, 0)
      // 菜单/tab/面包屑数据结构实际是一样的
      menuArr.value = val == null ? [] : arr
      routeNameMapMenu.value = menuArrToMap(arr)
      routeNameList.value = Array.from(routeNameMapMenu.value.keys())
      tabMetadataArr.value = arr as LsyTabMetadata[]
      clickedRootMenuItemRouteName.value =
        menuArr.value != null && menuArr.value.length > 0
          ? menuArr.value[0].index
          : undefined
      breadcrumbItemMetadataArr.value = arr as LsyBreadcrumbItem[]
    }

    /**
     * 根据路由名查找子孙路由树数据
     * @param routeName 路由名
     */
    function findChildMenuTree(
      routeName: string
    ): LsyMenuItemType[] | undefined {
      const menuItem = routeNameMapMenu.value.get(routeName)
      return undefined != menuItem ? menuItem.children : undefined
    }

    /**
     * 根据路由名查找路由数据
     * @param routeName 路由名
     */
    function findMenuItem(routeName: string): LsyMenuItemType | undefined {
      return routeNameMapMenu.value.get(routeName)
    }

    /**
     * 获取菜单数据，并将菜单数据同时转换为tab数据和面包屑数据, 并存储到 pinia 的store中
     */
    async function loadMenuDataToStore(loginFlag: string) {
      if (!menuArr.value || menuArr.value.length === 0) {
        const ret = await loadMenuData(loginFlag)
        if (ret && ret.length > 0) {
          updateMenuTabBreadcrumbData(ret)
        }
      }
    }
    const $route = useRoute()
    /**
     * 判断当前路由对应的菜单项中是否有对应的权限标识
     * @param permissionFlag 权限标识
     * @returns
     */
    function hasPermission(permissionFlag: string) {
      const routeName = $route.name as string
      // 路由名不存在，则认为无权限
      if (!routeName) return false

      const menuInfo = routeNameMapMenu.value.get(routeName)
      // 菜单数据不存在，则认为无权限
      if (!menuInfo) return

      const permissionArr = menuInfo.permission
      // 权限数据不存在，认为无权限
      if (!permissionArr || permissionArr.length === 0) return false

      // 包含对应权限标识则认为有权限，反之，无权限
      return permissionArr.indexOf(permissionFlag) >= 0
    }
    return {
      clickedRootMenuItemRouteName,
      tabMetadataArr,
      menuArr,
      rootMenuArr,
      breadcrumbItemMetadataArr,
      findMenuItem,
      findChildMenuTree,
      updateClickedRootMenuItemRouteName,
      loadMenuDataToStore,
      hasPermission,
      routeNameList,
    }
  }
)
