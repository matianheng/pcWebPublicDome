module.exports = {
  header: '# 管理系统骨架 \n## 更新历史',
  commitUrlFormat:
    'https://gitee.com/free_pan/archetype-backend-template/commit/{{hash}}',
  issueUrlFormat:
    'https://gitee.com/free_pan/archetype-backend-template/issues/{{id}}',
  types: [
    { type: 'feat', section: '✨ Features | 新功能' },
    { type: 'fix', section: '🐛 Bug Fixes | Bug 修复' },
    { type: 'docs', section: '📝 Documentation | 文档更新' },
    { type: 'refactor', section: '♻️ Code Refactoring | 代码重构' },
    { type: 'perf', section: '⚡ Performance Improvements | 性能优化' },
    { type: 'test', section: '✅ Tests | 添加/更新测试代码' },
    { type: 'revert', section: '⏪ Revert | 回退' },
    { type: 'release', section: '🔖 Build System | 打包构建' },
    { type: 'chore', section: '🤖 Chore | 构建/工程依赖/工具' },
    { type: 'ci', section: '👷 Continuous Integration | CI 配置' },
    { type: 'ui', section: '💄 Add or update the UI | 添加/更新UI' },
    {
      type: 'experience',
      section: '🧑‍💻 Improve developer experience. | 增强开发体验',
    },
    {
      type: 'logic',
      section: '👔 Add or update business logic. | 添加或更新业务逻辑',
    },
    {
      type: 'dependencies',
      section: '⬆️ Upgrade dependencies. | 依赖更新',
    },
  ],
}
