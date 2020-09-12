module.exports = {
  entry: './main.js',
  output: {
    filename: 'chunck.js',
    library: 'umd-test',
    libraryTarget: 'umd'  
  },
  presets: [
    '@babel/preset-env'
  ]
}