const { TYPE } = process.env;
const moduleType = TYPE === 'cjs' ? 'commonjs' : false;

const config = {
  presets: [
    [
      "@babel/preset-env", 
      { 
        modules: moduleType
      }
    ]
  ],
  plugins: [
    "@babel/plugin-transform-react-jsx"
  ]
}

module.exports = config;