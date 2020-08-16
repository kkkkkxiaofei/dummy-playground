module.exports = {
  visitor: {
    Identifier(path) {
      if (path.node.name === 'dynamicImport') {
        path.node.name = 'require';
      }
    }
  }
};