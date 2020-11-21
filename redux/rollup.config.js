import ts from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import path from 'path';

const getPlugins = type => [
  ts({
    declarationDir: path.dirname(pkg[type])
  }),
  babel({
    extensions: ['.ts']
  })
]

const config = [
  //umd
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'umd',
      name: 'redux'
    },
    plugins: getPlugins('unpkg')
  },
  //cjs
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'cjs'
    },
    plugins: getPlugins('main')
  },
  //es
  {
    input: 'src/index.ts',
    output: {
      dir: 'es',
      format: 'es'
    },
    plugins: getPlugins('module')
  }
]

export default config