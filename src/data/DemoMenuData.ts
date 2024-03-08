import { LsyMenuItemType } from '@/components/lsy/menu/typing'

export const demoMenuData: LsyMenuItemType[] = [
  {
    index: 'Index',
    name: '路由路由路由A',
    icon: 'menu-icon-dashboard',
    children: [
      {
        index: 'Home',
        name: '首页',
        icon: '',
        routePath: '/home',
        children: [],
      },
      {
        index: 'TestA',
        name: '测试A',
        icon: '',
        routePath: '/test-a',
        children: [],
      },
      {
        index: 'routeA.2',
        name: '路由A.2',
        icon: '',
        children: [
          {
            index: 'routeA.1.1',
            name: '路由A.1.1',
            icon: '',
            children: [],
          },
        ],
      },
    ],
  },
  {
    index: 'Table',
    name: '表格示例',
    icon: 'menu-icon-table',
    children: [
      {
        index: 'JsonTable',
        name: 'Json配置表格',
        icon: '',
        routePath: '/demo/table/json-table',
      },
      {
        index: 'EditableRowTable',
        name: '可编辑行表格',
        icon: '',
        routePath: '/demo/table/editable-row-table',
      },
      // {
      //   index: 'SimpleSearch',
      //   name: '可编辑单元格表格',
      //   icon: '',
      //   routePath: '/demo/search/simple-search',
      // },
    ],
  },
  {
    index: 'Form',
    name: '表单示例',
    icon: 'menu-icon-form',
    children: [
      {
        index: 'ElResponsiveForm',
        name: 'el响应式表单',
        icon: '',
        routePath: '/demo/form/el-responsive-form',
      },
      {
        index: 'ContainerResponsiveForm',
        name: '容器响应式表单',
        icon: '',
        routePath: '/demo/form/container-responsive-form',
      },
      {
        index: 'DynFormDemo',
        name: '动态表单示例',
        icon: '',
        routePath: '/demo/form/dyn-form-demo',
      },
      {
        index: 'StepFormDemo',
        name: '分步表单示例',
        icon: '',
        routePath: '/demo/form/step-form-demo',
      },
    ],
  },
  {
    index: 'ComprehensiveExample',
    name: '综合示例',
    icon: 'menu-icon-crud',
    children: [
      {
        index: 'SearchExample',
        name: '查询示例',
        icon: '',
        children: [
          {
            index: 'SimpleSearch',
            name: '简单查询',
            routePath: '/demo/comprehensive-example/search/simple',
          },
          {
            index: 'TabSearch',
            name: 'tab查询',
            routePath: '/demo/comprehensive-example/search/tab',
            children: [
              {
                index: 'DetailExample',
                name: '详情页',
                routePath: '/demo/comprehensive-example/detail',
                hide: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    index: 'routeD',
    name: '富文本组件',
    icon: 'menu-icon-rich-editor',
    children: [],
  },
  { index: 'routeE', name: '打印预览', icon: 'menu-icon-print', children: [] },
  { index: 'routeF', name: '图表组件', icon: 'menu-icon-chat', children: [] },
  { index: 'routeG', name: '其他示例', icon: 'menu-icon-other', children: [] },
]
