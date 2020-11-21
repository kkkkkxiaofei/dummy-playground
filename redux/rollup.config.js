import ts from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel';

const config = [
  //umd
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'redux'
    },
    plugins: [
      ts(),
      babel({
        extensions: ['.ts']
      })
    ]
  },
  //cjs
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs'
    },
    plugins: [
      ts(),
      babel({
        extensions: ['.ts']
      })
    ]
  },
  //es
  {
    input: 'src/index.ts',
    output: {
      dir: 'es',
      format: 'es'
    },
    plugins: [
      ts({
        declaration: true,
        declarationDir: 'es'
      }),
      babel({
        extensions: ['.ts']
      })
    ]
  }
]

export default config