module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore', // 构建过程或辅助工具更改
        'ci', // CI 相关的改变
        'docs', // 添加/修改文档
        'feat', // 完成新功能
        'fix', // 故障修复
        'perf', // 改进性能的代码修改
        'refactor', // 代码重构
        'release', // 打包构建
        'style', // 仅仅是代码格式/风格的修改
        'test', // 添加/更新测试代码
        'wip', // 开发中
        'begin', // 代码初始化/开始一个新功能
        'revert', // 回退代码
        'ui', // ui更新或样式文件修改
        'experience', //增强开发体验
        'logic', //添加或更新业务逻辑
        'dependencies', //依赖更新
      ],
    ],
  },
}
