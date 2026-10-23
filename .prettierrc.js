// .prettierrc.js
module.exports = {
  // ─── Sintaxe básica ───────────────────────────────
  singleQuote: true,           // aspas simples em vez de duplas
  semi: true,                  // ponto e vírgula no fim das instruções
  trailingComma: 'all',        // vírgula final em objetos, arrays, parâmetros
  arrowParens: 'avoid',        // (x) => x  →  x => x   (o JSON tinha 'avoid', o JS tinha 'always')

  // ─── Largura e indentação ─────────────────────────
  printWidth: 100,             // quebra linha após 100 caracteres
  tabWidth: 2,                 // 2 espaços por tabulação
  useTabs: false,              // usa espaços, não tabs

  // ─── Objetos e arrays ─────────────────────────────
  bracketSpacing: true,        // { foo: bar } em vez de {foo: bar}
  bracketSameLine: false,      // fecha > de JSX em linha separada
  objectWrap: 'preserve',      // mantém a quebra de linha original (Prettier 3.5+)

  // ─── Strings ──────────────────────────────────────
  quoteProps: 'as-needed',     // aspas em chaves de objeto só quando necessário
  jsxSingleQuote: true,        // aspas simples em atributos JSX
  insertPragma: false,         // não insere @format no topo
  requirePragma: false,        // não exige @format para formatar

  // ─── Markdown / HTML ──────────────────────────────
  proseWrap: 'preserve',       // não reformata markdown por padrão
  htmlWhitespaceSensitivity: 'css',

  // ─── Fim de linha ─────────────────────────────────
  endOfLine: 'lf',             // \n (LF), padrão Unix

  // ─── Arquivos específicos ─────────────────────────
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'always',
      },
    },
  ],
};
