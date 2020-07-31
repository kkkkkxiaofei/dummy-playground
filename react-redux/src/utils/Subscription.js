function Subscription(store, parentSub) {
  const self = this;
  self.store = store;
  self.parentSub = parentSub;
  self.unSubscribe = null;
  self.subscribe = function(listener) {
    self.trySubscribe();
    self.listeners.push(listener);
    return () => self.listeners.splice(self.listeners.indexOf(listener), 1);
  };
  self.notify = function() {
    self.listeners.forEach(listener => listener());
  }
  self.onStateChange = null;
  self.handleStateChange = function() {
    if (self.onStateChange) {
      self.onStateChange();
    }
  }
  self.trySubscribe = function() {
    if (!self.unSubscribe) {
      self.unSubscribe = self.parentSub ? 
        self.parentSub.subscribe(self.handleStateChange) :
        self.store.subscribe(self.handleStateChange);
      self.listeners = [];
    }
  }

  return self;
}

export default Subscription;
