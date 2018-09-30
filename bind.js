class Bind {
    constructor(module) {
      this.module = module;
      this.elements = module.querySelectorAll('[bind]');
      this.scope =  {};
      this.elements.forEach(this.setevent, this);
    }
    setevent(element) {
      if (element.type === 'text' || element.type === 'textarea' || element.isContentEditable) {
        var propToBind = element.getAttribute('bind');
        this.addScopeProp(propToBind);
        element.addEventListener("keyup", this.setval.bind(this, propToBind));

      } else if (element.tagName === 'SELECT') {
        var propToBind = element.getAttribute('bind');
        this.addScopeProp(propToBind);
        element.addEventListener("change", this.setval.bind(this, propToBind));
      }
    }
    addScopeProp(prop) {
      function changevalue(element, newValue) {
        if (element.getAttribute('bind') === prop && element !== document.activeElement) {
          if (element.type && (element.type === 'text' || element.type === 'textarea')) {
            element.value = newValue;
          } else if (element.tagName === 'SELECT') {
            for (var i = 0; i < element.options.length; i++) {
              if (element.options[i].value === newValue) {
                element.selectedIndex = i;
                break;
              }
            }
          } else if (!element.type) {
            element.innerHTML = newValue;
          }
        }
      }
      if (!this.scope.hasOwnProperty(prop)) {
        var value,
          elements = this.elements;
        Object.defineProperty(this.scope, prop, {
          set: function(newValue) {
            elements.forEach(function(element) {
              changevalue(element, newValue);
            });
          },
          get: function() {
            return value;
          },
          enumerable: true
        });
      }
    }
    setval(propToBind, element) {
      if (!element.target.isContentEditable) {
        this.scope[propToBind] = element.target.value;
      } else {
        this.scope[propToBind] = element.target.innerHTML;
      }
    }
    modify(key, val) {
      this.scope[key] = val;
    }
    destroy() {
      this.scope = null;
      this.elements = null;
    }
  }
