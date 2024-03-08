import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import Login from '@/pages/Login.vue'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { setupGuard } from './guard'
import Page403 from '@/pages/Page403.vue'
import Page404 from '@/pages/Page404.vue'
import Page500 from '@/pages/Page500.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: Login,
  },
  {
    name: 'Index',
    path: '/',
    component: BasicLayout,
    redirect: { name: 'ElResponsiveForm' },
    children: [
      {
        name: 'demo',
        path: 'demo',
        children: [
          {
            name: 'Form',
            path: 'form',
            children: [
              {
                name: 'ElResponsiveForm',
                path: 'el-responsive-form',
                component: () =>
                  import(
                    '@/pages/demo/form/responsive-form/ElResponsiveForm.vue'
                  ),
              },
              {
                name: 'ContainerResponsiveForm',
                path: 'container-responsive-form',
                component: () =>
                  import(
                    '@/pages/demo/form/responsive-form/ContainerResponsiveForm.vue'
                  ),
              },
              {
                name: 'DynFormDemo',
                path: 'dyn-form-demo',
                component: () =>
                  import('@/pages/demo/form/complex-form/DynFormExample.vue'),
              },
              {
                name: 'StepFormDemo',
                path: 'step-form-demo',
                component: () =>
                  import('@/pages/demo/form/StepFormExample.vue'),
              },
            ],
          },
          {
            name: 'Table',
            path: 'table',
            children: [
              {
                name: 'JsonTable',
                path: 'json-table',
                component: () =>
                  import('@/pages/demo/table/JsonTableExample.vue'),
              },
              {
                name: 'EditableRowTable',
                path: 'editable-row-table',
                component: () =>
                  import('@/pages/demo/table/EditableRowTableExample.vue'),
              },
            ],
          },
          {
            name: 'ComprehensiveExample',
            path: 'comprehensive-example',
            children: [
              {
                name: 'SearchExample',
                path: 'search',
                children: [
                  {
                    name: 'SimpleSearch',
                    path: 'simple',
                    component: () =>
                      import('@/pages/demo/search/SimpleSearch.vue'),
                  },
                  {
                    name: 'TabSearch',
                    path: 'tab',
                    component: () =>
                      import('@/pages/demo/search/TabSearch.vue'),
                    meta: {
                      keepAlive: true,
                      onlyToRouteKeepAlive: [
                        'DetailExample',
                        'NewDetailExample',
                      ],
                    },
                  },
                ],
              },
              {
                name: 'DetailExample',
                path: 'detail/:account',
                component: () =>
                  import('@/pages/demo/detail/DetailExample.vue'),
                meta: {
                  useRoutePathAsWrapperCompName: false,
                },
              },
              {
                name: 'NewDetailExample',
                path: 'new-detail/:account',
                component: () =>
                  import('@/pages/demo/new-detail/NewDetailExample.vue'),
                meta: {
                  useRoutePathAsWrapperCompName: false,
                },
              },
              {
                name: 'RoleMgr',
                path: 'role-mgr',
                component: () => import('@/pages/demo/role-mgr/RoleMgr.vue'),
              },
              {
                name: 'OrderList',
                path: 'order-list',
                component: () =>
                  import('@/pages/demo/small-demo/order-list/OrderList.vue'),
              },
              {
                name: 'OrderList2',
                path: 'order-list-2',
                component: () =>
                  import('@/pages/demo/small-demo/order-list/OrderList2.vue'),
              },
              {
                name: 'ScrollFadeIn',
                path: 'scroll-fade-in',
                component: () =>
                  import(
                    '@/pages/demo/small-demo/scroll-fade-in/ScrollFadeIn.vue'
                  ),
              },
              {
                name: 'MenuParentClick',
                path: 'menu-parent-click',
                component: () =>
                  import(
                    '@/pages/demo/small-demo/menu-parent-click/MenuParentClick.vue'
                  ),
              },
              {
                name: 'FloatingUIMenuDemo',
                path: 'floating-ui-menu',
                component: () =>
                  import(
                    '@/pages/demo/small-demo/floating-ui-menu/FloatingUIMenuDemo.vue'
                  ),
              },
              {
                name: 'WordCasting',
                path: 'word-casting',
                component: () =>
                  import(
                    '@/pages/demo/small-demo/word-casting/WordCasting.vue'
                  ),
              },
              {
                name: 'TypedDemo',
                path: 'typed-demo',
                component: () =>
                  import('@/pages/demo/small-demo/typed-demo/TypedDemo.vue'),
              },
              {
                name: 'CascadeDemo',
                path: 'cascade-demo',
                component: () =>
                  import(
                    '@/pages/demo/small-demo/cascade-demo/CascadeDemo.vue'
                  ),
              },
            ],
          },
          {
            name: 'RichEditor',
            path: 'rich-editor',
            children: [
              {
                name: 'TinymceExample',
                path: 'tinymce-example',
                component: () =>
                  import('@/pages/demo/rich-editor/TinymceExample.vue'),
              },
            ],
          },
          {
            name: 'ChartsPlugin',
            path: 'charts-plugin',
            children: [
              {
                name: 'EchartsExample',
                path: 'echarts-example',
                component: () =>
                  import('@/pages/demo/echarts/EchartsExample.vue'),
              },
            ],
          },
          {
            name: 'OtherExample',
            path: 'other',
            children: [
              {
                name: 'ExpandExample',
                path: 'expand-example',
                component: () => import('@/pages/demo/other/ExpandExample.vue'),
              },
              {
                name: 'WatermarkExample',
                path: 'watermark-example',
                component: () =>
                  import('@/pages/demo/other/WatermarkExample.vue'),
              },
              {
                name: 'RingExample',
                path: 'ring-example',
                component: () => import('@/pages/demo/other/RingExample.vue'),
              },
              {
                name: 'OrgTreeExample',
                path: 'org-tree-example',
                component: () =>
                  import('@/pages/demo/other/OrgTreeExample.vue'),
              },
              {
                name: 'DataExportExample',
                path: 'data-export-example',
                component: () =>
                  import('@/pages/demo/other/DataExportExample.vue'),
              },
              {
                name: 'PdfPreviewExample',
                path: 'pdf-preview-example',
                component: () =>
                  import('@/pages/demo/other/PdfPreviewExample.vue'),
              },
              {
                name: 'RouterTabExample',
                path: 'router-tab-example',
                component: () =>
                  import('@/pages/demo/router-tab/RouterTabExample.vue'),
              },
              {
                name: 'HeaderPage',
                path: 'header-page-example',
                component: () =>
                  import('@/pages/demo/content-container/HeaderPage.vue'),
              },
              {
                name: 'NotHeaderPage',
                path: 'not-header-page-example',
                component: () =>
                  import('@/pages/demo/content-container/NotHeaderPage.vue'),
              },
              {
                name: 'JsStickyExample',
                path: 'js-sticky-example',
                component: () =>
                  import('@/pages/demo/other/JsStickyExample.vue'),
              },
              {
                name: 'FileUploadExample',
                path: 'file-upload-example',
                component: () =>
                  import('@/pages/demo/other/FileUploadExample.vue'),
              },
            ],
          },
          {
            name: 'PrintExample',
            path: 'print',
            children: [
              {
                name: 'ElTablePrintExample',
                path: 'el-table',
                component: () =>
                  import('@/pages/demo/print/ElTablePrintExample.vue'),
              },
              {
                name: 'PicPrintExample',
                path: 'pic',
                component: () =>
                  import('@/pages/demo/print/PicPrintExample.vue'),
              },
              {
                name: 'CanvasPrintExample',
                path: 'canvas',
                component: () =>
                  import('@/pages/demo/print/CanvasPrintExample.vue'),
              },
            ],
          },
          {
            name: 'ButtonPermissionExample',
            path: 'btn-permission',
            children: [
              {
                name: 'HasButtonPermissionPage',
                path: 'has-permission',
                component: () =>
                  import(
                    '@/pages/demo/btn-permission/HasButtonPermissionPage.vue'
                  ),
              },
              {
                name: 'NotButtonPermissionPage',
                path: 'not-permission',
                component: () =>
                  import(
                    '@/pages/demo/btn-permission/NotButtonPermissionPage.vue'
                  ),
              },
            ],
          },
          {
            name: 'LongListExample',
            path: 'long-list',
            children: [
              {
                name: 'DynHeightLongListExample',
                path: 'dyn-height',
                component: () =>
                  import('@/pages/demo/long-list/DynHeightLongListExample.vue'),
              },
              {
                name: 'LikeMeiTuanMenuExample',
                path: 'mei-tuan',
                component: () =>
                  import('@/pages/demo/long-list/LikeMeiTuanMenuExample.vue'),
              },
            ],
          },
          {
            name: 'About',
            path: 'about',
            component: () => import('@/pages/demo/About.vue'),
          },
        ],
      },
    ],
  },
  { path: '/page-403', name: 'Page403', component: Page403 },
  { path: '/page-500', name: 'Page500', component: Page500 },
  // 前面的路由都未匹配上，则会匹配到该路由
  { path: '/:pathMatch(.*)*', name: 'Page404', component: Page404 },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  // { path: '/user-:afterUser(.*)', component: UserGeneric },
]
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

setupGuard(router)

export default router
