const buildFactory = deps => `
(function(modules) {
  function load(id) {
    const [factory, mapping] = modules[id];
    function require(relativePath) {
      return load(mapping[relativePath]);
    }
    const module = {
      exports: {}
    }
    const result = factory(require, module, module.exports);
    if (module.exports && Object.getOwnPropertyNames(module.exports).length === 0) {
      return result;
    }
    return module.exports;
  }
  return function() {
    return load(0);
  }
})({${deps}})
`;

module.exports = {
  umd: function(deps) {
    return `(function(root, factory) {
      if (typeof module === 'Object' && typeof exports === 'Object') 
        exports['dummy'] = factory();
      else 
        root['dummy'] = factory();
    })(window, ${buildFactory(deps)});`    
  }
};
