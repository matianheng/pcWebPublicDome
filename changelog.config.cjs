module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: [
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
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: [
    'type',
    'scope',
    'subject',
    'body',
    'breaking',
    'issues',
    'lerna',
  ],
  scopes: [],
  types: {
    chore: {
      description: '构建过程或辅助工具更改',
      emoji: '🤖',
      value: 'chore',
    },
    ci: {
      description: 'CI 相关的改变',
      emoji: '👷',
      value: 'ci',
    },
    docs: {
      description: '文档/注释更新',
      emoji: '📝',
      value: 'docs',
    },
    feat: {
      description: '完成新功能',
      emoji: '✨',
      value: 'feat',
    },
    fix: {
      description: '故障修复',
      emoji: '🐛',
      value: 'fix',
    },
    perf: {
      description: '改进性能的代码修改',
      emoji: '⚡️',
      value: 'perf',
    },
    refactor: {
      description: '代码重构',
      emoji: '♻️',
      value: 'refactor',
    },
    release: {
      description: '打包构建',
      emoji: '🔖',
      value: 'release',
    },
    style: {
      description: '仅仅是代码格式/风格的修改',
      emoji: '🎨',
      value: 'style',
    },
    test: {
      description: '添加/更新测试代码',
      emoji: '✅',
      value: 'test',
    },
    wip: {
      description: '开发中',
      emoji: '🚧',
      value: 'wip',
    },
    begin: {
      description: '项目首次提交',
      emoji: '🎉',
      value: 'begin',
    },
    revert: {
      description: '回退代码',
      emoji: '⏪️',
      value: 'revert',
    },
    ui: {
      description: 'ui更新或样式文件修改',
      emoji: '💄',
      value: 'ui',
    },
    experience: {
      description: '增强开发体验',
      emoji: '🧑‍💻',
      value: 'experience',
    },
    logic: {
      description: '添加或更新业务逻辑',
      emoji: '👔',
      value: 'logic',
    },
    dependencies: {
      description: '依赖更新',
      emoji: '⬆️',
      value: 'dependencies',
    },
  },
}
