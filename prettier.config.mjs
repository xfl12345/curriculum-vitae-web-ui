/**
 * 代码格式化配置
 * @typedef {import('prettier').Config} Config
 */
/** @type {Config} */
const config = {
  // 在语句末尾打印分号
  semi: false,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 在JSX中使用单引号而不是双引号。
  jsxSingleQuote: true,
  // 在多行逗号分隔的语法结构中，尽可能打印尾随逗号。（例如，单行数组后面永远不会有逗号。） 可选值"<none|es5|all>"，默认all
  trailingComma: 'es5',
  printWidth: 108,
  overrides: [],
}

const getNoOverridesConfig = () => {
  // oxlint-disable-next-line no-unused-vars
  const { overrides, ...rest } = config
  return rest
}

/**
 * 个别文件另外照顾
 * @typedef {import('prettier').Config} Config
 */
/** @type {Config['overrides']} */
const overrides = [
  {
    files: ['src/path/to/file.ts'],
    options: {
      ...getNoOverridesConfig(),
      printWidth: 144,
    },
  },
]

config.overrides = overrides

export default config
