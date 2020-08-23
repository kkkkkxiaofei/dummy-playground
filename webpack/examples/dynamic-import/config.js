module.exports = {
  entry: './main.js',
  output: 'chunck.js',
  library: 'umd-test',
  libraryTarget: 'umd',
  presets: [
    '@babel/preset-env'
  ]
}