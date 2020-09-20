const presets = process.env.TYPE === 'es' ?  ['@babel/preset-typescript'] : ['@babel/preset-env', '@babel/preset-typescript']; 

const config = {
  presets
}

module.exports = config;