module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    library: 'umd-test',
    libraryTarget: 'umd'  
  },
  presets: [
    '@babel/preset-env'
  ]
}